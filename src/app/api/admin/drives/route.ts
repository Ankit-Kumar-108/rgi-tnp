export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET: Fetch all drives with registration counts
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    let drives = await db.placementDrive.findMany({
      include: {
        recruiter: { select: { name: true, company: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { driveDate: "desc" },
    });

    drives = drives.filter(d => d.status !== "archived");

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
      jobDescription: string;
      ctc: string;
      eligibleBranches: string;
      minCGPA: number;
      minBatch: string;
      maxBatch: string;
      course: string;
      driveDate: string;
      driveType: string;
      jobType: string;
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
        jobDescription: body.jobDescription,
        ctc: body.ctc,
        eligibleBranches: body.eligibleBranches,
        minCGPA: body.minCGPA,
        minBatch: body.minBatch,
        maxBatch: body.maxBatch,
        course: body.course,
        driveDate: new Date(body.driveDate),
        driveType: body.driveType || existingDrive.driveType,
        jobType: body.jobType || existingDrive.jobType,
      },
    });

    return NextResponse.json({ success: true, message: "Drive updated successfully", drive: updatedDrive });
  } catch (error) {
    console.error("Update Drive Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update drive" }, { status: 500 });
  }
}
