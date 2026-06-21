export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { placementDrive } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch all active open drives unconditionally for public viewing
    const openDrives = await db.query.placementDrive.findMany({
      where: and(
        eq(placementDrive.status, "active"),
        inArray(placementDrive.driveType, ["Open", "Pool"])
      ),
      orderBy: (t, { asc }) => [asc(t.driveDate)],
      columns: {
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
