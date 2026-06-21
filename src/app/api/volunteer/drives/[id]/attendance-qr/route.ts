export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { signAuthToken, verifyAuthToken } from "@/lib/auth-jwt";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, volunteer as volunteerTable, placementDrive } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify user is a student
    const studentData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    if (!studentData || !studentData.enrollmentNumber) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // 2. Verify student is actually a volunteer and is verified
    const studentInfo = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentData.enrollmentNumber),
    });

    if (!studentInfo) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const volunteerInfo = await db.query.volunteer.findFirst({
      where: eq(volunteerTable.studentId, studentInfo.id),
    });

    if (!volunteerInfo || !volunteerInfo.isVerified || !volunteerInfo.isActive) {
       return NextResponse.json({ success: false, message: "Unauthorized: Active and verified volunteer access only" }, { status: 403 });
    }

    const { id: driveId } = await params;

    // 3. Verify the drive exists and is active
    const drive = await db.query.placementDrive.findFirst({
      where: eq(placementDrive.id, driveId),
      columns: { id: true, companyName: true, status: true },
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
