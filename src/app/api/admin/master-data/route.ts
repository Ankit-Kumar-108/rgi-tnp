export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

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

    let created = 0;
    let skipped = 0;

    if (type === "student") {
      for (const record of records) {
        try {
          await db.studentMaster.upsert({
            where: { enrollmentNumber: record.enrollmentNumber },
            update: {
              name: record.name,
              branch: record.branch,
              batch: parseFloat(record.batch),
            },
            create: {
              enrollmentNumber: record.enrollmentNumber,
              name: record.name,
              branch: record.branch,
              batch: parseFloat(record.batch),
            },
          });
          created++;
        } catch {
          skipped++;
        }
      }
    } else if (type === "alumni") {
      for (const record of records) {
        try {
          await db.alumniMaster.upsert({
            where: { enrollmentNumber: record.enrollmentNumber },
            update: {
              name: record.name,
              branch: record.branch,
              batch: record.batch,
            },
            create: {
              enrollmentNumber: record.enrollmentNumber,
              name: record.name,
              branch: record.branch,
              batch: record.batch,
            },
          });
          created++;
        } catch {
          skipped++;
        }
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${records.length} records: ${created} created/updated, ${skipped} skipped`,
      created,
      skipped,
    });
  } catch (error) {
    console.error("Master Data Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
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
