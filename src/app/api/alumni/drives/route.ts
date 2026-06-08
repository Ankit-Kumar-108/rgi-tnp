export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { NotificationService } from "@/lib/notification-service";
import { driveRegistrationTemplate } from "@/lib/email-templates";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

// Same token extraction pattern as your student/drives/route.ts



function parseBranches(branchesStr: string): Set<string> {
  return new Set(
    branchesStr.split(',').map(b => b.trim()).filter(b => b.length > 0)
  );
}

// GET: Fetch drives eligible for this alumni
export async function GET(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();

    // Fetch alumni data to know their branch/course/batch for eligibility
    const alumniData = await db.alumni.findUnique({
      where: { id: alumni.id },
      select: { id: true, branch: true, course: true, batch: true },
    });

    if (!alumniData) {
      return NextResponse.json(
        { success: false, message: "Alumni not found" },
        { status: 404 }
      );
    }

    // Fetch active drives that allow alumni
    const drives = await db.placementDrive.findMany({
      where: {
        allowAlumni: true,
        status: "active",
      },
      include: {
        recruiter: { select: { name: true, company: true } },
        //  Include this alumni's registration to check isRegistered
        registrations: {
          where: { alumniId: alumniData.id },
          select: { id: true },
        },
        _count: { select: { registrations: true } },
      },
      orderBy: { driveDate: "desc" },
    });

    //  Filter drives by alumni's branch/course eligibility
    //    and add isRegistered flag
    const eligibleDrives = drives
      .filter((drive) => {
        // Course check
        if (drive.course !== "All" && !drive.course.includes(alumniData.course)) {
          return false;
        }
        // Branch check
        const branches = parseBranches(drive.eligibleBranches);
        if (!branches.has(alumniData.branch)) {
          return false;
        }
        // We skip CGPA and gender checks for alumni — they're experienced
        return true;
      })
      .map((drive) => ({
        ...drive,
        isRegistered: drive.registrations.length > 0,
        registrationCount: drive._count.registrations,
        registrations: undefined,
        _count: undefined,
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
    if (!alumni) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as { driveId: string };
    const { driveId } = body;
    const db = getDb();

    // Fetch alumni for eligibility checks
    const alumniData = await db.alumni.findUnique({
      where: { id: alumni.id },
    });

    if (!alumniData) {
      return NextResponse.json(
        { success: false, message: "Alumni not found" },
        { status: 404 }
      );
    }

    // Fetch and validate the drive
    const drive = await db.placementDrive.findUnique({
      where: { id: driveId },
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
    const existing = await db.driveRegistration.findFirst({
      where: { driveId, alumniId: alumniData.id },
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

    // Register
    await db.driveRegistration.create({
      data: { driveId, alumniId: alumniData.id },
    });

    // Send notification
    //  Same notification pattern as student drives registration
    try {
      await NotificationService.notifyUser({
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
      });

      return NextResponse.json({
        success: true,
        message: "Registered for the drive, confirmation email sent",
      });
    } catch (emailError) {
      console.error("Failed to send alumni drive registration email:", emailError);
      return NextResponse.json({
        success: true,
        message: "Registered for the drive, but email notification failed",
      });
    }
  } catch (error) {
    console.error("Alumni Drive Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
