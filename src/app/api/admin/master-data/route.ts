export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { count, sql } from "drizzle-orm";
import * as schema from "@/lib/schema";

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

    if (type !== "student" && type !== "alumni") {
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

        const generatedId = generateId();

        if (type === "student") {
          await db.run(
            sql`INSERT OR REPLACE INTO "StudentMaster" ("id", "enrollmentNumber", "name", "branch", "course", "batch")
                VALUES (COALESCE((SELECT "id" FROM "StudentMaster" WHERE "enrollmentNumber" = ${enrollmentNumber}), ${generatedId}), ${enrollmentNumber}, ${name}, ${branch}, ${course}, ${batch})`
          );
        } else {
          await db.run(
            sql`INSERT OR REPLACE INTO "AlumniMaster" ("id", "enrollmentNumber", "name", "branch", "course", "batch")
                VALUES (COALESCE((SELECT "id" FROM "AlumniMaster" WHERE "enrollmentNumber" = ${enrollmentNumber}), ${generatedId}), ${enrollmentNumber}, ${name}, ${branch}, ${course}, ${batch})`
          );
        }
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

// GET: Fetch master data counts or list records
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get("action");

    if (action === "list") {
      const type = searchParams.get("type"); // "student" | "alumni"
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "50", 10);
      const skip = (page - 1) * limit;

      if (type === "student") {
        const [records, countResult] = await Promise.all([
          db.query.studentMaster.findMany({ limit, offset: skip, orderBy: (t, { asc }) => [asc(t.name)] }),
          db.select({ count: count() }).from(schema.studentMaster)
        ]);
        const total = countResult[0]?.count || 0;
        return NextResponse.json({ success: true, records, total });
      } else if (type === "alumni") {
        const [records, totalResult] = await Promise.all([
          db.query.alumniMaster.findMany({ limit, offset: skip, orderBy: (t, { asc }) => [asc(t.name)] }),
          db.select({ count: count() }).from(schema.alumniMaster)
        ]);
        const total = totalResult[0]?.count || 0;
        return NextResponse.json({ success: true, records, total });
      } else {
         return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
      }
    }

    const [studentCountResult, alumniCountResult] = await Promise.all([
      db.select({ count: count() }).from(schema.studentMaster),
      db.select({ count: count() }).from(schema.alumniMaster),
    ]);
    const studentCount = studentCountResult[0]?.count || 0;
    const alumniCount = alumniCountResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      counts: { studentMaster: studentCount, alumniMaster: alumniCount },
    });
  } catch (error) {
    console.error("Master Data GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

