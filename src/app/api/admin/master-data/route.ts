export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 25);
}

// POST: Upload CSV data for StudentMaster or AlumniMaster
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: "student" | "alumni";
      records: any[];
    };
    const { type, records } = body;
    const db = getDb();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, message: "No records provided" },
        { status: 400 }
      );
    }

    // Add batch size limit to prevent abuse
    if (records.length > 10000) {
      return NextResponse.json(
        { success: false, message: "Maximum 10000 records per batch" },
        { status: 400 }
      );
    }

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];
    const table = type === "student" ? "StudentMaster" : type === "alumni" ? "AlumniMaster" : null;

    if (!table) {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 }
      );
    }

    for (const item of records) {
      try {
        const enrollmentNumber = (item.enrollmentNumber || item["Enrollment Number"] || "").trim();
        const name = (item.name || item["Name"] || "").trim();
        const branch = (item.branch || item["Branch"] || "").trim();
        const course = (item.course || item["Course"] || "").trim();
        const batch = String(item.batch || item["Batch"] || "").trim();

        if (!enrollmentNumber || !name) {
          skipped++;
          if (errors.length < 3) errors.push(`Missing enrollmentNumber or name`);
          continue;
        }

        await db.$executeRawUnsafe(
          `INSERT OR REPLACE INTO "${table}" ("id", "enrollmentNumber", "name", "branch", "course", "batch")
           VALUES (COALESCE((SELECT "id" FROM "${table}" WHERE "enrollmentNumber" = ?), ?), ?, ?, ?, ?, ?)`,
          enrollmentNumber, // ? #1
          generateId(),     // ? #2
          enrollmentNumber, // ? #3
          name,             // ? #4
          branch,           // ? #5
          course,           // ? #6
          batch             // ? #7
        );
        created++;
      } catch (err: any) {
        const msg = err?.message || String(err);
        console.error(`Skipped ${type}:`, msg);
        if (errors.length < 3) errors.push(msg);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${records.length} records: ${created} created/updated, ${skipped} skipped`,
      created,
      skipped,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error: any) {
    console.error("Master Data Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}

// GET: Fetch master data counts
export async function GET() {
  try {
    const db = getDb();
    const [studentCount, alumniCount] = await Promise.all([
      db.studentMaster.count(),
      db.alumniMaster.count(),
    ]);
    return NextResponse.json({
      success: true,
      counts: { studentMaster: studentCount, alumniMaster: alumniCount },
    });
  } catch (error) {
    console.error("Master Data GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}
