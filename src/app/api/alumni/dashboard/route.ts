export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { formatCgpaCriteria, meetsCgpaCriteria } from "@/lib/cgpa-utils";

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
    const alumniData = await db.alumni.findUnique({
      where: { id: alumni.id },
      select: {
        id: true, name: true, enrollmentNumber: true, personalEmail: true,
        currentCompany: true, jobTitle: true, city: true, country: true,
        linkedInUrl: true, phoneNumber: true, isProfileComplete: true,
        isVerified: true, about: true, branch: true, batch: true,
        course: true, profileImageUrl: true, privacyJson: true,
        cgpa: true, gender: true,
      },
    });

    if (!alumniData) {
      return NextResponse.json({ success: false, message: "Alumni not found" }, { status: 404 });
    }

    const [referrals, feedbacks, memories, referralCounts, alumniDrives, registrations, archivedDrives] = await Promise.all([
      db.referral.findMany({
        where: { alumniId: alumni.id },
        orderBy: { id: "desc" },
        take: 50, // Limit to prevent large payload
      }),
      db.alumniFeedback.findMany({
        where: { alumniId: alumni.id },
      }),
      db.memory.findMany({
        where: { alumniId: alumni.id },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
      Promise.all([
        db.referral.count({ where: { alumniId: alumni.id } }),
        db.referral.count({ where: { alumniId: alumni.id, status: "published" } }),
        db.referral.count({ where: { alumniId: alumni.id, status: "pending" } }),
      ]),
      db.placementDrive.findMany({
        where: {
          allowAlumni: true,
          status: "active",
        },
        include: {
          recruiter: { select: { name: true, company: true } },
          registrations: {
            where: { alumniId: alumni.id },
            select: { id: true },
          },
        },
        orderBy: { driveDate: "desc" },
        take: 10,
      }),
      db.driveRegistration.findMany({
        where: { alumniId: alumni.id },
        include: {
          drive: { select: { companyName: true, roleName: true, driveDate: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.placementDrive.findMany({
        where: { allowAlumni: true, status: "completed" },
        take: 10, // Limit archived drives
        orderBy: { driveDate: "desc" },
      }),
    ]);
    // Map drives to add isRegistered flag and filter eligible drives
    const formattedDrives = alumniDrives
      .filter((drive: any) => {
        // Course check
        if (drive.course !== "All" && !drive.course.includes(alumniData.course)) {
          return false;
        }
        // Branch check
        const branches = parseBranches(drive.eligibleBranches);
        if (!branches.has(alumniData.branch)) {
          return false;
        }

        // Batch check
        const alumniBatchNum = extractBatchNumber(alumniData.batch);
        const minBatchNum = extractBatchNumber(drive.minBatch);
        const maxBatchNum = extractBatchNumber(drive.maxBatch);
        if (!isNaN(alumniBatchNum) && !isNaN(minBatchNum) && !isNaN(maxBatchNum) &&
          (alumniBatchNum < minBatchNum || alumniBatchNum > maxBatchNum)) {
          return false;
        }

        // CGPA check
        if (!meetsCgpaCriteria(alumniData.cgpa, drive.minCGPA)) {
          return false;
        }

        // Gender check
        if (drive.genderPreference !== "Both" && alumniData.gender !== drive.genderPreference) {
          return false;
        }

        return true;
      })
      .map((d: any) => ({
        ...d,
        isRegistered: d.registrations.length > 0,
        registrations: undefined,
      }));

    const registeredDriveIds = registrations.map((r: any) => r.driveId);

    const formattedArchivedDrives = archivedDrives.map((d: any) => ({
      ...d,
      isRegistered: registeredDriveIds.includes(d.id),
    }));

    const [totalReferrals, approvedReferrals, pendingReferrals] = referralCounts;

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
