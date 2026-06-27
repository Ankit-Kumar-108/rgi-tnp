export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { formatCgpaCriteria, meetsCgpaCriteria } from "@/lib/cgpa-utils";
import { alumni as alumniTable, referral, alumniFeedback, memory, placementDrive, driveRegistration } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";

function parseBranches(branchesStr: string): Set<string> {
  return new Set(
    branchesStr.split(',').map(b => b.trim()).filter(b => b.length > 0)
  );
}

function extractBatchNumber(batchStr: string): number {
  if (!batchStr) return NaN;
  return parseInt(batchStr.split('-').pop() || "0", 10);
}
export async function GET(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni || !alumni.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const alumniData = await db.query.alumni.findFirst({
      where: eq(alumniTable.id, alumni.id),
      columns: {
        id: true, name: true, enrollmentNumber: true, personalEmail: true,
        currentCompany: true, jobTitle: true, city: true, country: true,
        linkedInUrl: true, phoneNumber: true, isProfileComplete: true,
        isVerified: true, about: true, branch: true, batch: true,
        course: true, profileImageUrl: true, privacyJson: true,
        cgpa: true, gender: true, tenthPercentage: true, twelfthPercentage: true,
        resumeUrl: true,
      },
    });

    if (!alumniData) {
      return NextResponse.json({ success: false, message: "Alumni not found" }, { status: 404 });
    }

    const [referrals, feedbacks, memories, referralCounts, alumniDrives, registrations, archivedDrives] = await Promise.all([
      db.query.referral.findMany({
        where: eq(referral.alumniId, alumni.id),
        orderBy: (t, { desc }) => [desc(t.id)],
        limit: 50, // Limit to prevent large payload
      }),
      db.query.alumniFeedback.findMany({
        where: eq(alumniFeedback.alumniId, alumni.id),
      }),
      db.query.memory.findMany({
        where: eq(memory.alumniId, alumni.id),
        limit: 20,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
      Promise.all([
        db.select({ count: count() }).from(referral).where(eq(referral.alumniId, alumni.id)),
        db.select({ count: count() }).from(referral).where(and(eq(referral.alumniId, alumni.id), eq(referral.status, "published"))),
        db.select({ count: count() }).from(referral).where(and(eq(referral.alumniId, alumni.id), eq(referral.status, "pending"))),
      ]),
      db.query.placementDrive.findMany({
        where: and(
          eq(placementDrive.allowAlumni, true),
          eq(placementDrive.status, "active")
        ),
        with: {
          recruiter: {
            columns: { name: true, company: true }
          },
          registrations: {
            where: eq(driveRegistration.alumniId, alumni.id),
            columns: { id: true }
          }
        },
        orderBy: (t, { desc }) => [desc(t.driveDate)],
        limit: 10,
      }),
      db.query.driveRegistration.findMany({
        where: eq(driveRegistration.alumniId, alumni.id),
        with: {
          drive: {
            columns: { companyName: true, roleName: true, driveDate: true, status: true }
          }
        },
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
      db.query.placementDrive.findMany({
        where: and(
          eq(placementDrive.allowAlumni, true),
          eq(placementDrive.status, "completed")
        ),
        limit: 10, // Limit archived drives
        orderBy: (t, { desc }) => [desc(t.driveDate)],
      }),
    ]);
    // Map drives to add isRegistered flag, eligibility status, and details
    const formattedDrives = alumniDrives.map((drive: any) => {
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

    const registeredDriveIds = registrations.map((r: any) => r.driveId);

    const formattedArchivedDrives = archivedDrives.map((d: any) => ({
      ...d,
      isRegistered: registeredDriveIds.includes(d.id),
    }));

    const totalReferrals = referralCounts[0][0]?.count || 0;
    const approvedReferrals = referralCounts[1][0]?.count || 0;
    const pendingReferrals = referralCounts[2][0]?.count || 0;

    return NextResponse.json({
      success: true,
      alumni: alumniData,
      referrals,
      memories,
      drives: formattedDrives,
      registrations,
      archivedDrives: formattedArchivedDrives,
      stats: {
        totalReferrals,
        approvedReferrals,
        pendingReferrals,
        totalFeedbacks: feedbacks.length,
      },
    });
  } catch (error) {
    console.error("Alumni Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load dashboard" }, { status: 500 });
  }
}
