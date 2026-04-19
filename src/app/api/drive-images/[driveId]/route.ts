export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET: Fetch drive images by driveId (public endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ driveId: string }> }
) {
  try {
    const { driveId } = await params;
    const db = getDb();

    // Fetch images without including drive info (already have driveId)
    // This eliminates the N+1 query problem
    const images = await db.driveImage.findMany({
      where: { driveId },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        driveId: true,
        createdAt: true,
        uploadedBy: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit results to prevent huge responses
    });

    if (images.length === 0) {
      return NextResponse.json({
        success: true,
        images: [],
      });
    }

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Error fetching drive images:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
