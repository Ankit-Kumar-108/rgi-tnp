export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, volunteer as volunteerTable, driveImage, placementDrive, driveRegistration } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    
    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    
    // Get student data
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: {
        id: true,
        name: true,
        enrollmentNumber: true,
        email: true,
        branch: true,
        semester: true,
        cgpa: true,
        profileImageUrl: true,
        course: true,
        batch: true,
        linkedinUrl: true,
        githubUrl: true,
        isVerified: true,
        isEmailVerified: true,
      },
    });

    if (!studentData) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check if student is a volunteer
    const volunteerData = await db.query.volunteer.findFirst({
      where: eq(volunteerTable.studentId, studentData.id),
      columns: {
        id: true,
        studentId: true,
        designation: true,
        isVerified: true,
        isActive: true,
        assignedBy: true,
        assignedAt: true,
        verificationNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!volunteerData) {
      return NextResponse.json(
        { success: false, message: "You are not registered as a volunteer" },
        { status: 403 }
      );
    }

    if (!volunteerData.isActive) {
      return NextResponse.json(
        { success: false, message: "Your volunteer account has been deactivated", status: "deactivated" },
        { status: 403 }
      );
    }

    // Get stats in parallel
    const [
      driveImagesCountResult,
      activeDrivesCountResult,
      totalStudentsCountResult,
      pendingApprovalsCountResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(driveImage).where(eq(driveImage.uploadedBy, studentData.email)),
      db.select({ count: count() }).from(placementDrive).where(eq(placementDrive.status, "active")),
      db.select({ count: count() }).from(studentTable),
      db.select({ count: count() }).from(driveRegistration).where(eq(driveRegistration.status, "pending")),
    ]);

    const driveImagesCount = driveImagesCountResult[0]?.count || 0;
    const activeDrivesCount = activeDrivesCountResult[0]?.count || 0;
    const totalStudentsCount = totalStudentsCountResult[0]?.count || 0;
    const pendingApprovalsCount = pendingApprovalsCountResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        volunteer: volunteerData,
        student: studentData,
        stats: {
          driveImagesUploaded: driveImagesCount,
          activeDrives: activeDrivesCount,
          registeredStudents: totalStudentsCount,
          totalApprovals: pendingApprovalsCount,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
