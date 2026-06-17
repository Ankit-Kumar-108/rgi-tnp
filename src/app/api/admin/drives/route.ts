export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { normalizeAcademicScoreToCgpa } from "@/lib/cgpa-utils";

// GET: Fetch all drives with registration counts
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
    
    // 2. Define the exact conditions (Filter in the DB, not in memory)
    const where = {
        status: { not: "archived" }
    };

    // 3. Parallel fetching for speed
    const [drives, totalCount] = await Promise.all([
      db.placementDrive.findMany({
        where, 
        take: limit,
        skip: skip,
        include: {
          recruiter: { select: { name: true, company: true } },
        },
        orderBy: { driveDate: "desc" },
      }),
      db.placementDrive.count({ where })
    ]);

    // Single GROUP BY query instead of N separate count() calls
    const driveIds = drives.map((d: any) => d.id);
    const countMap = new Map<string, number>();
    if (driveIds.length > 0) {
      try {
        const placeholders = driveIds.map(() => '?').join(',');
        const countRows: any[] = await db.$queryRaw`SELECT "driveId", COUNT(*) as cnt FROM "DriveRegistration" WHERE "driveId" IN (${placeholders}) GROUP BY "driveId"`;
        for (const row of countRows) {
          countMap.set(row.driveId, Number(row.cnt));
        }
      } catch {
        // Fallback: use individual count queries if raw SQL fails
        const counts = await Promise.all(
          drives.map((drive: any) => db.driveRegistration.count({ where: { driveId: drive.id } }))
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
      await db.placementDrive.update({
        where: { id },
        data: { status: "completed" },
      });
    } else if (action === "reopen") {
      await db.placementDrive.update({
        where: { id },
        data: { status: "active" },
      });
    } else if (action === "archive") {
      await db.placementDrive.update({
        where: { id },
        data: { status: "archived" },
      });
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

    const existingDrive = await db.placementDrive.findUnique({
      where: { id: body.id },
    });

    if (!existingDrive) {
      return NextResponse.json({ success: false, message: "Drive not found" }, { status: 404 });
    }

    const updatedDrive = await db.placementDrive.update({
      where: { id: body.id },
      data: {
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
      },
    });

    return NextResponse.json({ success: true, message: "Drive updated successfully", drive: updatedDrive });
  } catch (error: any) {
    console.error("Update Drive Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update drive" }, { status: 500 });
  }
}
