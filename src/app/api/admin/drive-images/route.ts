export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, count, desc } from "drizzle-orm";
import * as schema from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      title?: string;
      imageUrl?: string;
      images?: { imageUrl: string }[];
      driveId?: string;
      uploadedBy?: string;
    };

    const { title, driveId } = body;
    const uploadedBy =
      req.headers.get("x-admin-email")?.trim() || body.uploadedBy || "admin";

    if (!title || !driveId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (title, driveId)" },
        { status: 400 },
      );
    }

    // Normalise to an array of image URLs
    let imageUrls: string[] = [];

    if (body.images && Array.isArray(body.images)) {
      imageUrls = body.images
        .map((img) => img.imageUrl)
        .filter(Boolean);
    } else if (body.imageUrl) {
      imageUrls = [body.imageUrl];
    }

    if (imageUrls.length !== 4) {
      return NextResponse.json(
        { success: false, message: "Exactly 4 image URLs are required" },
        { status: 400 },
      );
    }

    if (imageUrls.length > 4) {
      return NextResponse.json(
        { success: false, message: "Maximum 4 images per upload batch" },
        { status: 400 },
      );
    }

    const db = getDb();

    // Verify drive exists
    const drive = await db.query.placementDrive.findFirst({
      where: eq(schema.placementDrive.id, driveId),
    });

    if (!drive) {
      return NextResponse.json(
        { success: false, message: "Drive not found" },
        { status: 404 },
      );
    }

    // Check existing image count for this drive (max 4 total)
    const existingCountResult = await db
      .select({ count: count() })
      .from(schema.driveImage)
      .where(eq(schema.driveImage.driveId, driveId));
    
    const existingCount = existingCountResult[0]?.count || 0;

    if (existingCount + imageUrls.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: `This drive already has ${existingCount} image(s). You can add at most ${4 - existingCount} more.`,
        },
        { status: 400 },
      );
    }

    // Create all DriveImage records using a batch for atomicity in D1
    const batchResult = await db.batch(
      imageUrls.map((url) =>
        db.insert(schema.driveImage).values({
          title,
          imageUrl: url,
          driveId,
          uploadedBy,
        }).returning()
      ) as any,
    );

    const createdImages = batchResult.map((arr) => arr[0]);

    return NextResponse.json({ success: true, driveImages: createdImages });
  } catch (error) {
    console.error("Error uploading drive image(s):", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image(s)" },
      { status: 500 },
    );
  }
}

// GET: Fetch all drive images (for admin panel)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const driveId = searchParams.get("driveId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    const db = getDb();

    const whereClause = driveId ? eq(schema.driveImage.driveId, driveId) : undefined;

    const [images, countResult] = await Promise.all([
      db.query.driveImage.findMany({
        where: whereClause,
        limit,
        offset: skip,
        with: {
          drive: {
            columns: {
              id: true,
              roleName: true,
              companyName: true,
              driveDate: true,
            }
          },
        },
        orderBy: (t, { desc: descOp }) => [descOp(t.createdAt)],
      }),
      db.select({ count: count() }).from(schema.driveImage).where(whereClause),
    ]);

    const totalCount = countResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      images,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching drive images:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

