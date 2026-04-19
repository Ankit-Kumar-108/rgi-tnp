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
        { success: false, message: "Unauthorized", isVolunteer: false },
        { status: 401 }
      );
    }

    const db = getDb();
    
    // Get student
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true, email: true, name: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found", isVolunteer: false },
        { status: 404 }
      );
    }

    // Check if student is a volunteer and is active
    const volunteer = await db.volunteer.findUnique({
      where: { studentId: student.id },
      select: {
        id: true,
        isVerified: true,
        isActive: true,
        designation: true,
        assignedAt: true,
        verificationNotes: true,
        assignedBy: true,
      },
    });

    if (!volunteer) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not registered as a volunteer",
          isVolunteer: false,
        },
        { status: 403 }
      );
    }

    if (!volunteer.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your volunteer account has been deactivated",
          isVolunteer: false,
          status: "deactivated",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Volunteer verified",
      isVolunteer: true,
      volunteer: {
        isVerified: volunteer.isVerified,
        designation: volunteer.designation,
        assignedAt: volunteer.assignedAt,
        verificationNotes: volunteer.verificationNotes,
        assignedBy: volunteer.assignedBy,
      },
    });
  } catch (error) {
    console.error("Volunteer validation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate volunteer status", isVolunteer: false },
      { status: 500 }
    );
  }
}
