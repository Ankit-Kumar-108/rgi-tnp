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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const studentTokenData = await getStudentFromToken(req);

    if (!studentTokenData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    const { id } = await params;

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

    // Get the image and verify ownership
    const image = await db.driveImage.findUnique({
      where: { id },
      select: { id: true, uploadedBy: true, imageUrl: true },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    // Verify the image was uploaded by this volunteer
    if (image.uploadedBy !== student.email) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete this image" },
        { status: 403 }
      );
    }

    // Delete the image
    await db.driveImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error("Error deleting drive image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete image" },
      { status: 500 }
    );
  }
}
