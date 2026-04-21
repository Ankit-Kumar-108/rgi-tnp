export const runtime = "edge";

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

/**
 * POST: Volunteer uploads drive images (up to 4 per drive)
 */
export async function POST(req: NextRequest) {
  try {
    const studentTokenData = await getStudentFromToken(req);

    if (!studentTokenData) {
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
        { success: false, message: "Exactly 4 image URLLs are required" },
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
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true, email: true },
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

    // Verify drive exists
    const drive = await db.placementDrive.findUnique({
      where: { id: driveId },
    });

    if (!drive) {
      return NextResponse.json(
        { success: false, message: "Drive not found" },
        { status: 404 }
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
        { status: 400 }
      );
    }

    // Create all DriveImage records
    const createdImages = await db.$transaction(
      imageUrls.map((url) =>
        db.driveImage.create({
          data: {
            title,
            imageUrl: url,
            driveId,
            uploadedBy: student.email,
          },
        })
      )
    );

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
    const studentTokenData = await getStudentFromToken(req);

    if (!studentTokenData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();

    // Get student and verify volunteer status
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true, email: true },
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
    const driveId = searchParams.get("driveId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

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
      { status: 500 }
    );
  }
}
