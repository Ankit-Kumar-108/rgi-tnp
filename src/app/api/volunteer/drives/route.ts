export const runtime = 'edge';

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

    // Verify student is a volunteer
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const volunteer = await db.volunteer.findUnique({
      where: { studentId: student.id },
    });

    if (!volunteer) {
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
    const drives = await db.placementDrive.findMany({
      where: { status: "active" },
      select: {
        id: true,
        companyName: true,
        driveDate: true,
      },
      take: limit,
      skip: skip,
      orderBy: { driveDate: "desc" },
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
