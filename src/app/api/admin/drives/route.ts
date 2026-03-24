export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET: Fetch all drives with registration counts
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const drives = await db.placementDrive.findMany({
      include: {
        recruiter: { select: { name: true, company: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { driveDate: "desc" },
    });

    const formatted = drives.map((d: any) => ({
      ...d,
      registrationCount: d._count.registrations,
      _count: undefined,
    }));

    return NextResponse.json({ success: true, drives: formatted });
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
      action: "close" | "reopen";
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
    }

    return NextResponse.json({ success: true, message: `Drive ${action}d successfully` });
  } catch (error) {
    console.error("Drives POST Error:", error);
    return NextResponse.json({ success: false, message: "Action failed" }, { status: 500 });
  }
}
