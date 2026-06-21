export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, count } from "drizzle-orm";
import * as schema from "@/lib/schema";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();

    const getCount = async (query: any) => {
      const res = await query;
      return res[0]?.count || 0;
    };

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
      getCount(db.select({ count: count() }).from(schema.student)),
      getCount(db.select({ count: count() }).from(schema.alumni)),
      getCount(db.select({ count: count() }).from(schema.recruiter)),
      getCount(db.select({ count: count() }).from(schema.externalStudent)),
      getCount(db.select({ count: count() }).from(schema.placementDrive).where(eq(schema.placementDrive.status, "pending"))),
      getCount(db.select({ count: count() }).from(schema.placementDrive).where(eq(schema.placementDrive.status, "active"))),
      getCount(db.select({ count: count() }).from(schema.referral).where(eq(schema.referral.status, "pending"))),
      getCount(db.select({ count: count() }).from(schema.memory).where(eq(schema.memory.status, "pending_moderation"))),
      getCount(db.select({ count: count() }).from(schema.externalStudent).where(eq(schema.externalStudent.isVerified, false))),
      getCount(db.select({ count: count() }).from(schema.volunteer).where(eq(schema.volunteer.isVerified, false))),
      getCount(db.select({ count: count() }).from(schema.studentFeedback).where(eq(schema.studentFeedback.isApproved, false))),
      getCount(db.select({ count: count() }).from(schema.alumniFeedback).where(eq(schema.alumniFeedback.isApproved, false))),
      getCount(db.select({ count: count() }).from(schema.corporateFeedback).where(eq(schema.corporateFeedback.isApproved, false))),
      getCount(db.select({ count: count() }).from(schema.student).where(eq(schema.student.emailVerificationFailed, true))),
      getCount(db.select({ count: count() }).from(schema.alumni).where(eq(schema.alumni.emailVerificationFailed, true))),
      getCount(db.select({ count: count() }).from(schema.externalStudent).where(eq(schema.externalStudent.emailVerificationFailed, true))),
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

