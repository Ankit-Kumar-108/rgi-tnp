export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/schema";

// DELETE: Remove a drive image
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const driveImage = await db.query.driveImage.findFirst({
      where: eq(schema.driveImage.id, id),
    });

    if (!driveImage) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from database
    await db.delete(schema.driveImage).where(eq(schema.driveImage.id, id));

    // Note: You may want to also delete from R2, but that's optional
    // For now, we'll leave the image in R2 (can be cleaned up separately)

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting drive image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete image" },
      { status: 500 }
    );
  }
}

