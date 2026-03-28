export const runtime = 'edge';
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch all active open drives unconditionally for public viewing
    const openDrives = await db.placementDrive.findMany({
      where: {
        status: "active",
        driveType: "Open",
      },
      orderBy: { driveDate: "asc" },
      select: {
        id: true,
        companyName: true,
        roleName: true,
        jobDescription: true,
        ctc: true,
        minCGPA: true,
        jobType: true,
        minBatch: true,
        maxBatch: true,
        course: true,
        eligibleBranches: true,
        driveDate: true,
        driveType: true,
        status: true,
      }
    });

    return NextResponse.json({
      success: true,
      drives: openDrives,
    });
  } catch (error) {
    console.error("Public Open Drives Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load open drives" }, { status: 500 });
  }
}
