export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

async function getStudentFromToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getStudentFromToken(req);
    
    if (!studentTokenData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    
    // Get student data
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: {
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

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check if student is a volunteer
    const volunteer = await db.volunteer.findUnique({
      where: { studentId: student.id },
      select: {
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

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "You are not registered as a volunteer" },
        { status: 403 }
      );
    }

    if (!volunteer.isActive) {
      return NextResponse.json(
        { success: false, message: "Your volunteer account has been deactivated", status: "deactivated" },
        { status: 403 }
      );
    }

    // Get stats in parallel
    const [
      driveImagesCount,
      activeDrivesCount,
      totalStudentsCount,
      pendingApprovalsCount,
    ] = await Promise.all([
      db.driveImage.count({
        where: { uploadedBy: student.email },
      }),
      db.placementDrive.count({
        where: { status: "active" },
      }),
      db.student.count(),
      db.driveRegistration.count({
        where: { status: "pending" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        volunteer,
        student,
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
