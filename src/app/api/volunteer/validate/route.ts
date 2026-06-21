export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, volunteer as volunteerTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    
    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", isVolunteer: false },
        { status: 401 }
      );
    }

    const db = getDb();
    
    // Get student
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true, email: true, name: true },
    });

    if (!studentData) {
      return NextResponse.json(
        { success: false, message: "Student not found", isVolunteer: false },
        { status: 404 }
      );
    }

    // Check if student is a volunteer and is active
    const volunteerData = await db.query.volunteer.findFirst({
      where: eq(volunteerTable.studentId, studentData.id),
      columns: {
        id: true,
        isVerified: true,
        isActive: true,
        designation: true,
        assignedAt: true,
        verificationNotes: true,
        assignedBy: true,
      },
    });

    if (!volunteerData) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not registered as a volunteer",
          isVolunteer: false,
        },
        { status: 403 }
      );
    }

    if (!volunteerData.isActive) {
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
        isVerified: volunteerData.isVerified,
        designation: volunteerData.designation,
        assignedAt: volunteerData.assignedAt,
        verificationNotes: volunteerData.verificationNotes,
        assignedBy: volunteerData.assignedBy,
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
