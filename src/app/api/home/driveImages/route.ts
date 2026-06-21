export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

import { and, inArray, exists, eq, desc } from "drizzle-orm";
import { placementDrive, driveImage } from "@/lib/schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsedLimit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.max(1, Math.min(parsedLimit, 100));
    const db = getDb();

    const drives = await db.query.placementDrive.findMany({
      where: and(
        inArray(placementDrive.status, ["active", "completed"]),
        exists(
          db.select({ id: driveImage.id })
            .from(driveImage)
            .where(eq(driveImage.driveId, placementDrive.id))
        )
      ),
      columns: {
        id: true,
        companyName: true,
        driveDate: true,
      },
      with: {
        driveImages: {
          columns: {
            id: true,
            title: true,
            imageUrl: true,
            driveId: true,
            createdAt: true,
          },
          orderBy: [desc(driveImage.createdAt)],
          limit: 4,
        },
      },
      orderBy: [desc(placementDrive.driveDate)],
      limit: limit,
    });

    return NextResponse.json(
      { success: true, drives },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Home drive images error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch drive images" },
      { status: 500 },
    );
  }
}
