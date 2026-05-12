export const runtime = "edge";

import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { calculateCurrentSemester } from "@/lib/semester-calculator";

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
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: {
        batch: true,
        semester: true,
        course: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // 3. Get passing year (batch year, e.g., 2028)
    // Admission year is calculated inside calculateCurrentSemester
    const passingYear = parseInt(student.batch, 10);

    // 4. Calculate current semester based on course
    const currentSemester = calculateCurrentSemester(passingYear, student.course);

    // 5. Check if update is needed
    if (currentSemester === student.semester) {
      return NextResponse.json({
        success: true,
        updated: false,
        semester: currentSemester,
        message: "Semester already up to date",
      });
    }

    // 6. Update semester in database
    const updatedStudent = await db.student.update({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      data: { semester: currentSemester },
      select: { semester: true },
    });

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