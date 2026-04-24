export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { signAuthToken } from "@/lib/auth-jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: driveId } = await params;

    const db = getDb();
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

    // Create a short-lived attendance token (2 hours)
    const attendanceToken = await signAuthToken(
      {
        driveId: drive.id,
        purpose: "attendance",
      },
      "2h"
    );

    // Build the full URL that students will visit when scanning QR
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const qrUrl = `${protocol}://${host}/mark-attendance?token=${attendanceToken}`;

    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now

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