export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsedLimit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.max(1, Math.min(parsedLimit, 100));
    const db = getDb();

    const drives = await db.placementDrive.findMany({
      where: {
        status: { in: ["active", "completed"] },
        driveImages: { some: {} },
      },
      select: {
        id: true,
        companyName: true,
        driveDate: true,
        driveImages: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            driveId: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 4,
        },
      },
      orderBy: { driveDate: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      drives,
    });
  } catch (error) {
    console.error("Home drive images error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch drive images" },
      { status: 500 },
    );
  }
}
