export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, volunteer as volunteerTable, placementDrive } from "@/lib/schema";
import { eq } from "drizzle-orm";

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

    // Verify student is a volunteer
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true },
    });

    if (!studentData) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const volunteerData = await db.query.volunteer.findFirst({
      where: eq(volunteerTable.studentId, studentData.id),
    });

    if (!volunteerData) {
      return NextResponse.json(
        { success: false, message: "Not authorized as volunteer" },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "1000", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Fetch active drives
    const drives = await db.query.placementDrive.findMany({
      where: eq(placementDrive.status, "active"),
      columns: {
        id: true,
        companyName: true,
        driveDate: true,
      },
      limit: limit,
      offset: skip,
      orderBy: (t, { desc }) => [desc(t.driveDate)],
    });

    return NextResponse.json({
      success: true,
      drives,
    });
  } catch (error) {
    console.error("Error fetching drives:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch drives" },
      { status: 500 }
    );
  }
}
