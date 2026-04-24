export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { signAuthToken, verifyAuthToken } from "@/lib/auth-jwt";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify user is a student
    const studentData = await getStudentFromToken(req);
    if (!studentData) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // 2. Verify student is actually a volunteer and is verified
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentData.enrollmentNumber },
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const volunteer = await db.volunteer.findUnique({
      where: { studentId: student.id },
    });

    if (!volunteer || !volunteer.isVerified || !volunteer.isActive) {
       return NextResponse.json({ success: false, message: "Unauthorized: Active and verified volunteer access only" }, { status: 403 });
    }

    const { id: driveId } = await params;

    // 3. Verify the drive exists and is active
    const drive = await db.placementDrive.findUnique({
      where: { id: driveId },
      select: { id: true, companyName: true, status: true },
    });

    if (!drive) {
      return NextResponse.json(
        { success: false, message: "Drive not found" },
        { status: 404 }
      );
    }

    if (drive.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Drive is not active. Only active drives can have attendance." },
        { status: 400 }
      );
    }

    // 4. Create attendance token
    const attendanceToken = await signAuthToken(
      {
        driveId: drive.id,
        purpose: "attendance",
      },
      "2h"
    );

    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const qrUrl = `${protocol}://${host}/mark-attendance?token=${attendanceToken}`;

    const expiresAt = Date.now() + 2 * 60 * 60 * 1000;

    return NextResponse.json({
      success: true,
      qrUrl,
      driveName: drive.companyName,
      expiresAt,
    });

  } catch (error) {
    console.error("QR Generation Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate QR" },
      { status: 500 }
    );
  }
}
