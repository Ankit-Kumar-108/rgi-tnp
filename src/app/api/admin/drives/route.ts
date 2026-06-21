export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, ne, count, inArray } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { normalizeAcademicScoreToCgpa } from "@/lib/cgpa-utils";

// GET: Fetch all drives with registration counts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // 1. Safe Pagination Parsing
    const parsedLimit = parseInt(searchParams.get("limit") || "50", 10);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);
    const limit = isNaN(parsedLimit) ? 50 : Math.max(1, parsedLimit);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const skip = (page - 1) * limit;

    const db = getDb();
    
    // 2. Parallel fetching for speed
    const [drives, totalCountResult] = await Promise.all([
      db.query.placementDrive.findMany({
        where: ne(schema.placementDrive.status, "archived"), 
        limit,
        offset: skip,
        with: {
          recruiter: {
            columns: {
              name: true,
              company: true,
            }
          },
        },
        orderBy: (t, { desc: descOp }) => [descOp(t.driveDate)],
      }),
      db.select({ count: count() })
        .from(schema.placementDrive)
        .where(ne(schema.placementDrive.status, "archived"))
    ]);

    const totalCount = totalCountResult[0]?.count || 0;

    // Single GROUP BY query instead of N separate count() calls
    const driveIds = drives.map((d: any) => d.id);
    const countMap = new Map<string, number>();
    if (driveIds.length > 0) {
      try {
        const countRows = await db
          .select({
            driveId: schema.driveRegistration.driveId,
            cnt: count(),
          })
          .from(schema.driveRegistration)
          .where(inArray(schema.driveRegistration.driveId, driveIds))
          .groupBy(schema.driveRegistration.driveId);

        for (const row of countRows) {
          countMap.set(row.driveId, Number(row.cnt));
        }
      } catch (e) {
        console.error("Failed to fetch drive registration counts via group by:", e);
        // Fallback: use individual count queries if group by fails
        const counts = await Promise.all(
          drives.map(async (drive: any) => {
            const res = await db
              .select({ count: count() })
              .from(schema.driveRegistration)
              .where(eq(schema.driveRegistration.driveId, drive.id));
            return res[0]?.count || 0;
          })
        );
        drives.forEach((d: any, i: number) => countMap.set(d.id, counts[i]));
      }
    }

    // 4. Format the response
    const formatted = drives.map((d: any) => ({
      ...d,
      registrationCount: countMap.get(d.id) || 0,
    }));

    return NextResponse.json({ 
        success: true, 
        drives: formatted, 
        totalCount 
    });
  } catch (error) {
    console.error("Drives GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch drives" }, { status: 500 });
  }
}

// POST: Update drive status (close, mark results, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      id: string;
      action: "close" | "reopen" | "archive";
    };
    const { id, action } = body;
    const db = getDb();

    if (action === "close") {
      await db.update(schema.placementDrive)
        .set({ status: "completed" })
        .where(eq(schema.placementDrive.id, id));
    } else if (action === "reopen") {
      await db.update(schema.placementDrive)
        .set({ status: "active" })
        .where(eq(schema.placementDrive.id, id));
    } else if (action === "archive") {
      await db.update(schema.placementDrive)
        .set({ status: "archived" })
        .where(eq(schema.placementDrive.id, id));
    }

    return NextResponse.json({ success: true, message: `Drive ${action}d successfully` });
  } catch (error) {
    console.error("Drives POST Error:", error);
    return NextResponse.json({ success: false, message: "Action failed" }, { status: 500 });
  }
}

// PUT: Update an existing drive request
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      id: string;
      companyName: string;
      roleName: string;
      genderPreference: string
      jobDescription: string;
      ctc: string;
      eligibleBranches: string;
      minCGPA: number;
      duration: string
      interviewProcess: string
      minBatch: string;
      maxBatch: string;
      course: string;
      driveDate: string;
      driveType: string;
      jobType: string;
      allowAlumni: boolean;
    };

    const db = getDb();

    const existingDrive = await db.query.placementDrive.findFirst({
      where: eq(schema.placementDrive.id, body.id),
    });

    if (!existingDrive) {
      return NextResponse.json({ success: false, message: "Drive not found" }, { status: 404 });
    }

    const updatedResult = await db.update(schema.placementDrive)
      .set({
        companyName: body.companyName,
        roleName: body.roleName,
        genderPreference: body.genderPreference,
        interviewProcess: body.interviewProcess,
        jobDescription: body.jobDescription,
        ctc: body.ctc,
        eligibleBranches: body.eligibleBranches,
        minCGPA: normalizeAcademicScoreToCgpa(body.minCGPA) ?? 0,
        minBatch: body.minBatch,
        maxBatch: body.maxBatch,
        duration: body.duration,
        course: body.course,
        driveDate: new Date(body.driveDate),
        driveType: body.driveType || existingDrive.driveType,
        jobType: body.jobType || existingDrive.jobType,
        allowAlumni: body.allowAlumni ?? existingDrive.allowAlumni,
      })
      .where(eq(schema.placementDrive.id, body.id))
      .returning();

    return NextResponse.json({ success: true, message: "Drive updated successfully", drive: updatedResult[0] });
  } catch (error: any) {
    console.error("Update Drive Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update drive" }, { status: 500 });
  }
}

