export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();

    const [
      totalStudents,
      totalAlumni,
      totalRecruiters,
      totalExternalStudents,
      pendingDrives,
      activeDrives,
      pendingReferrals,
      pendingMemories,
      pendingExternalScreening,
      pendingVolunteers,
      pendingStudentFeedback,
      pendingAlumniFeedback,
      pendingCorporateFeedback,
      pendingUnverifiedStudents,
      pendingUnverifiedAlumni,
      pendingUnverifiedExternal,
    ] = await Promise.all([
      db.student.count(),
      db.alumni.count(),
      db.recruiter.count(),
      db.externalStudent.count(),
      db.placementDrive.count({ where: { status: "pending" } }),
      db.placementDrive.count({ where: { status: "active" } }),
      db.referral.count({ where: { status: "pending" } }),
      db.memory.count({ where: { status: "pending_moderation" } }),
      db.externalStudent.count({ where: { isVerified: false } }),
      db.volunteer.count({ where: { isVerified: false } }),
      db.studentFeedback.count({ where: { isApproved: false } }),
      db.alumniFeedback.count({ where: { isApproved: false } }),
      db.corporateFeedback.count({ where: { isApproved: false } }),
      db.student.count({ where: { emailVerificationFailed: true } }),
      db.alumni.count({ where: { emailVerificationFailed: true } }),
      db.externalStudent.count({ where: { emailVerificationFailed: true } }),
    ]);

    const pendingApprovals =
      pendingDrives + pendingReferrals + pendingMemories + pendingExternalScreening + pendingVolunteers + pendingStudentFeedback + pendingAlumniFeedback + pendingCorporateFeedback + pendingUnverifiedStudents + pendingUnverifiedAlumni + pendingUnverifiedExternal;

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalAlumni,
        totalRecruiters,
        totalExternalStudents,
        activeDrives,
        pendingApprovals,
        pendingDrives,
        pendingReferrals,
        pendingMemories,
        pendingExternalScreening,
        pendingVolunteers,
        pendingStudentFeedback,
        pendingAlumniFeedback,
        pendingCorporateFeedback,
        pendingUnverifiedStudents,
        pendingUnverifiedAlumni,
        pendingUnverifiedExternal,
      },
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
