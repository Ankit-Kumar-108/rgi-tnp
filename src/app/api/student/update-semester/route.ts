export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { calculateCurrentSemester } from "@/lib/semester-calculator";
import { student as studentTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify student is authenticated
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, [
      "student",
    ]);

    if (
      !studentTokenData?.enrollmentNumber ||
      studentTokenData.role !== "student"
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();

    // 2. Get student's batch and course from DB
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: {
        batch: true,
        semester: true,
        course: true,
      },
    });

    if (!studentData) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // 3. Get passing year (batch year, e.g., 2028)
    // Admission year is calculated inside calculateCurrentSemester
    const passingYear = parseInt(studentData.batch, 10);

    // 4. Calculate current semester based on course
    const currentSemester = calculateCurrentSemester(passingYear, studentData.course);

    // 5. Check if update is needed
    if (currentSemester === studentData.semester) {
      return NextResponse.json({
        success: true,
        updated: false,
        semester: currentSemester,
        message: "Semester already up to date",
      });
    }

    // 6. Update semester in database
    const updatedStudentResult = await db.update(studentTable).set({
      semester: currentSemester,
      updatedAt: new Date().toISOString(),
    }).where(eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber)).returning({
      semester: studentTable.semester,
    });
    const updatedStudent = updatedStudentResult[0];

    return NextResponse.json({
      success: true,
      updated: true,
      semester: updatedStudent.semester,
      message: "Semester updated successfully",
    });
  } catch (error) {
    console.error("Error updating semester:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}