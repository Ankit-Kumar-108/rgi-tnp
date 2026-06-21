export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { NotificationService } from "@/lib/notification-service";
import { driveRegistrationTemplate } from "@/lib/email-templates";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { formatCgpaCriteria, meetsCgpaCriteria } from "@/lib/cgpa-utils";
import { runInBackground } from "@/lib/background";
import { eq, and, desc, count } from "drizzle-orm";
import { alumni as alumniTable, placementDrive, driveRegistration } from "@/lib/schema";

// Same token extraction pattern as your student/drives/route.ts



function parseBranches(branchesStr: string): Set<string> {
  return new Set(
    branchesStr.split(',').map(b => b.trim()).filter(b => b.length > 0)
  );
}

function extractBatchNumber(batchStr: string): number {
  if (!batchStr) return NaN;
  return parseInt(batchStr.split('-').pop() || "0", 10);
}

// GET: Fetch drives eligible for this alumni
export async function GET(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni || !alumni.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();

    // Fetch alumni data to know their branch/course/batch for eligibility
    const alumniData = await db.query.alumni.findFirst({
      where: eq(alumniTable.id, alumni.id),
      columns: { id: true, branch: true, course: true, batch: true, cgpa: true, gender: true },
    });

    if (!alumniData) {
      return NextResponse.json(
        { success: false, message: "Alumni not found" },
        { status: 404 }
      );
    }

    // Fetch active drives that allow alumni
    const drives = await db.query.placementDrive.findMany({
      where: and(
        eq(placementDrive.allowAlumni, true),
        eq(placementDrive.status, "active")
      ),
      with: {
        recruiter: { columns: { name: true, company: true } },
        //  Include this alumni's registration to check isRegistered
        registrations: {
          where: eq(driveRegistration.alumniId, alumniData.id),
          columns: { id: true },
        },
      },
      orderBy: [desc(placementDrive.driveDate)],
    });
    //  Map drives to add isRegistered, eligibility flags, and registration counts
    const processedDrives = drives.map((drive) => {
      const eligibilityErrors: string[] = [];

      // Course check
      if (drive.course !== "All" && !drive.course.includes(alumniData.course)) {
        eligibilityErrors.push(`Course (${alumniData.course}) is not eligible`);
      }

      // Branch check
      const branches = parseBranches(drive.eligibleBranches);
      if (!branches.has(alumniData.branch)) {
        eligibilityErrors.push(`Branch (${alumniData.branch}) is not eligible`);
      }

      // Batch check
      const alumniBatchNum = extractBatchNumber(alumniData.batch);
      const minBatchNum = extractBatchNumber(drive.minBatch);
      const maxBatchNum = extractBatchNumber(drive.maxBatch);
      if (!isNaN(alumniBatchNum) && !isNaN(minBatchNum) && !isNaN(maxBatchNum) && 
          (alumniBatchNum < minBatchNum || alumniBatchNum > maxBatchNum)) {
        eligibilityErrors.push(`Batch (${alumniData.batch}) is not eligible (Requires ${drive.minBatch} to ${drive.maxBatch})`);
      }

      // CGPA check
      if (!meetsCgpaCriteria(alumniData.cgpa, drive.minCGPA)) {
        eligibilityErrors.push(`Minimum CGPA of ${drive.minCGPA} required (Your CGPA: ${alumniData.cgpa || 0})`);
      }

      // Gender check
      if (drive.genderPreference !== "Both" && alumniData.gender !== drive.genderPreference) {
        eligibilityErrors.push(`Drive is open to ${drive.genderPreference} candidates only`);
      }

      return {
        ...drive,
        isRegistered: drive.registrations.length > 0,
        registrations: undefined,
        isEligible: eligibilityErrors.length === 0,
        ineligibilityReason: eligibilityErrors.length > 0 ? eligibilityErrors.join(", ") : undefined,
      };
    });

    const registrationCounts = await Promise.all(
      processedDrives.map(async (drive) => {
        const res = await db.select({ count: count() })
          .from(driveRegistration)
          .where(eq(driveRegistration.driveId, drive.id));
        return res[0]?.count || 0;
      })
    );

    const eligibleDrives = processedDrives.map((drive, idx) => ({
      ...drive,
      registrationCount: registrationCounts[idx],
    }));

    return NextResponse.json({
      success: true,
      drives: eligibleDrives,
    });
  } catch (error) {
    console.error("Alumni Drives GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch drives" },
      { status: 500 }
    );
  }
}

// POST: Register alumni for a drive
export async function POST(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni || !alumni.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as { driveId: string };
    const { driveId } = body;
    const db = getDb();

    // Fetch alumni for eligibility checks
    const alumniData = await db.query.alumni.findFirst({
      where: eq(alumniTable.id, alumni.id),
    });

    if (!alumniData) {
      return NextResponse.json(
        { success: false, message: "Alumni not found" },
        { status: 404 }
      );
    }

    // Fetch and validate the drive
    const drive = await db.query.placementDrive.findFirst({
      where: eq(placementDrive.id, driveId),
    });

    if (!drive || drive.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Drive not available" },
        { status: 400 }
      );
    }

    //check: drive must allow alumni
    if (!drive.allowAlumni) {
      return NextResponse.json(
        { success: false, message: "This drive does not accept alumni applications" },
        { status: 403 }
      );
    }

    // Check: already registered?
    const existing = await db.query.driveRegistration.findFirst({
      where: and(
        eq(driveRegistration.driveId, driveId),
        eq(driveRegistration.alumniId, alumniData.id)
      ),
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Already registered for this drive" },
        { status: 409 }
      );
    }

    // Check: course eligible?
    if (drive.course !== "All" && !drive.course.includes(alumniData.course)) {
      return NextResponse.json(
        { success: false, message: `Your course (${alumniData.course}) is not eligible` },
        { status: 403 }
      );
    }

    // Check: branch eligible?
    const eligibleBranches = parseBranches(drive.eligibleBranches);
    if (!eligibleBranches.has(alumniData.branch)) {
      return NextResponse.json(
        { success: false, message: "Your branch is not eligible for this drive" },
        { status: 403 }
      );
    }

    // Check: batch eligible?
    const alumniBatchNum = extractBatchNumber(alumniData.batch);
    const minBatchNum = extractBatchNumber(drive.minBatch);
    const maxBatchNum = extractBatchNumber(drive.maxBatch);
    if (!isNaN(alumniBatchNum) && !isNaN(minBatchNum) && !isNaN(maxBatchNum) && 
        (alumniBatchNum < minBatchNum || alumniBatchNum > maxBatchNum)) {
      return NextResponse.json(
        { success: false, message: `Your batch is not eligible. Eligible range: ${drive.minBatch} to ${drive.maxBatch}` },
        { status: 403 }
      );
    }
    
    // Check: CGPA eligible?
    if (!meetsCgpaCriteria(alumniData.cgpa, drive.minCGPA)) {
      return NextResponse.json(
        { success: false, message: `Minimum CGPA ${formatCgpaCriteria(drive.minCGPA)} required` },
        { status: 403 }
      );
    }
    
    // Check: Gender eligible?
    if (drive.genderPreference !== "Both" && alumniData.gender !== drive.genderPreference) {
      return NextResponse.json(
        { success: false, message: `This drive is open to ${drive.genderPreference} candidates only` },
        { status: 403 }
      );
    }

    // Register
    await db.insert(driveRegistration).values({
      driveId,
      alumniId: alumniData.id,
    });

    // Fire-and-forget: send email + in-app notification in background
    runInBackground(
      NotificationService.notifyUser({
        email: {
          to: alumniData.personalEmail,
          subject: `Registered for ${drive.companyName} Drive`,
          html: driveRegistrationTemplate(
            alumniData.name,
            drive.companyName,
            drive.driveDate.toDateString(),
            drive.roleName
          ),
          template: "drive_registration_confirmation",
          approvalId: alumniData.id,
          approvalType: "alumni",
          actionType: "drive_registration",
        },
        inApp: {
          type: "alumni",
          title: "Drive Registration",
          message: `Registered for ${drive.companyName} Drive`,
        },
        triggeredBy: "System",
        recipient: {
          id: alumniData.id,
          type: "alumni",
        },
      }),
      "alumni-drive-registration-email"
    );

    return NextResponse.json({
      success: true,
      message: "Registered for the drive",
    });
  } catch (error) {
    console.error("Alumni Drive Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
