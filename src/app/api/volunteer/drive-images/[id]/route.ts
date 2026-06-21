export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, volunteer as volunteerTable, driveImage } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);

    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    const { id } = await params;

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

    // Get the image and verify ownership
    const image = await db.query.driveImage.findFirst({
      where: eq(driveImage.id, id),
      columns: { id: true, uploadedBy: true, imageUrl: true },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    // Verify the image was uploaded by this volunteer
    if (image.uploadedBy !== studentData.email) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete this image" },
        { status: 403 }
      );
    }

    // Delete the image
    await db.delete(driveImage).where(eq(driveImage.id, id));

    return NextResponse.json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error("Error deleting drive image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete image" },
      { status: 500 }
    );
  }
}
