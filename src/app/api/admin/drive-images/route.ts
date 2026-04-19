export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * POST: Batch-upload drive images (up to 4 per drive).
 *
 * Accepts two payload shapes for backward compatibility:
 *   Legacy:  { title, imageUrl, driveId, uploadedBy }         → single image
 *   Batch:   { title, images: [{ imageUrl }], driveId, uploadedBy } → up to 4 images
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      title?: string;
      imageUrl?: string;
      images?: { imageUrl: string }[];
      driveId?: string;
      uploadedBy?: string;
    };

    const { title, driveId, uploadedBy = "admin" } = body;

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

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image URL is required" },
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
    const drive = await db.placementDrive.findUnique({
      where: { id: driveId },
    });

    if (!drive) {
      return NextResponse.json(
        { success: false, message: "Drive not found" },
        { status: 404 },
      );
    }

    // Check existing image count for this drive (max 4 total)
    const existingCount = await db.driveImage.count({
      where: { driveId },
    });

    if (existingCount + imageUrls.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: `This drive already has ${existingCount} image(s). You can add at most ${4 - existingCount} more.`,
        },
        { status: 400 },
      );
    }

    // Create all DriveImage records using a transaction for atomicity
    const createdImages = await db.$transaction(
      imageUrls.map((url) =>
        db.driveImage.create({
          data: {
            title,
            imageUrl: url,
            driveId,
            uploadedBy,
          },
        }),
      ),
    );

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

    let where: any = {};
    if (driveId) {
      where.driveId = driveId;
    }

    const [images, totalCount] = await Promise.all([
      db.driveImage.findMany({
        where,
        take: limit,
        skip,
        include: {
          drive: { select: { id: true, companyName: true, driveDate: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.driveImage.count({ where }),
    ]);

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
