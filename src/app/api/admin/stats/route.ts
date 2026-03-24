
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
    ] = await Promise.all([
      db.student.count(),
      db.alumni.count(),
      db.recruiter.count(),
      db.externalStudent.count(),
      db.placementDrive.count({ where: { status: "pending" } }),
      db.placementDrive.count({ where: { status: "active" } }),
      db.referral.count({ where: { status: "pending" } }),
      db.memory.count({ where: { status: "pending_moderation" } }),
      db.externalStudent.count({ where: { isScreened: false } }),
    ]);

    const pendingApprovals =
      pendingDrives + pendingReferrals + pendingMemories + pendingExternalScreening;

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
