export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, volunteer as volunteerTable, placementDrive, driveImage } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

/**
 * POST: Volunteer uploads drive images (up to 4 per drive)
 */
export async function POST(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);

    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as {
      title?: string;
      images?: { imageUrl: string }[];
      driveId?: string;
    };

    const { title, driveId } = body;

    if (!title || !driveId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (title, driveId)" },
        { status: 400 }
      );
    }

    // Normalize to array of image URLs
    let imageUrls: string[] = [];
    if (body.images && Array.isArray(body.images)) {
      imageUrls = body.images
        .map((img) => img.imageUrl)
        .filter(Boolean);
    }

    if (imageUrls.length !== 4) {
      return NextResponse.json(
        { success: false, message: "Exactly 4 image URLs are required" },
        { status: 400 }
      );
    }

    if (imageUrls.length > 4) {
      return NextResponse.json(
        { success: false, message: "Maximum 4 images per upload batch" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Get student and verify volunteer status
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true, email: true },
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

    // Verify drive exists
    const drive = await db.query.placementDrive.findFirst({
      where: eq(placementDrive.id, driveId),
    });

    if (!drive) {
      return NextResponse.json(
        { success: false, message: "Drive not found" },
        { status: 404 }
      );
    }

    // Check existing image count for this drive (max 4 total)
    const existingCountResult = await db.select({ count: count() }).from(driveImage).where(eq(driveImage.driveId, driveId));
    const existingCount = existingCountResult[0]?.count || 0;

    if (existingCount + imageUrls.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: `This drive already has ${existingCount} image(s). You can add at most ${4 - existingCount} more.`,
        },
        { status: 400 }
      );
    }

    // Create all DriveImage records in batch
    const createdImagesResult = await db.batch(
      imageUrls.map((url) =>
        db.insert(driveImage).values({
          title,
          imageUrl: url,
          driveId,
          uploadedBy: studentData.email,
          createdAt: new Date().toISOString(),
        }).returning()
      ) as any
    ) as any[][];

    const createdImages = createdImagesResult.map(res => res[0]);

    return NextResponse.json({ success: true, driveImages: createdImages });
  } catch (error) {
    console.error("Error uploading drive image(s):", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image(s)" },
      { status: 500 }
    );
  }
}

/**
 * GET: Fetch drive images uploaded by volunteer
 */
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

    // Get student and verify volunteer status
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true, email: true },
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
    const driveId = searchParams.get("driveId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    const whereClause = driveId ? eq(driveImage.driveId, driveId) : undefined;

    const [images, totalCountResult] = await Promise.all([
      db.query.driveImage.findMany({
        where: whereClause,
        limit: limit,
        offset: skip,
        with: {
          drive: { columns: { id: true, companyName: true, driveDate: true } },
        },
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
      db.select({ count: count() }).from(driveImage).where(whereClause),
    ]);

    const totalCount = totalCountResult[0]?.count || 0;

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
      { status: 500 }
    );
  }
}
