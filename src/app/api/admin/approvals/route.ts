export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET: Fetch pending items by type
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "drives";
    const db = getDb();

    if (type === "drives") {
      const drives = await db.placementDrive.findMany({
        where: { status: "pending" },
        include: { recruiter: { select: { name: true, company: true, email: true } } },
        orderBy: { driveDate: "desc" },
      });
      return NextResponse.json({ success: true, items: drives });
    }

    if (type === "referrals") {
      const referrals = await db.referral.findMany({
        where: { status: "pending" },
        include: { alumni: { select: { name: true, personalEmail: true } } },
      });
      return NextResponse.json({ success: true, items: referrals });
    }

    if (type === "external") {
      const externals = await db.externalStudent.findMany({
        where: { isScreened: false },
        select: {
          id: true, name: true, collegeName: true, branch: true, cgpa: true,
          email: true, enrollmentNumber: true, resumeUrl: true,
        },
      });
      return NextResponse.json({ success: true, items: externals });
    }

    if (type === "memories") {
      const memories = await db.memory.findMany({
        where: { status: "pending_moderation" },
        include: { student: { select: { name: true, enrollmentNumber: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, items: memories });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Approvals GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Approve or reject an item
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: string;
      id: string;
      action: "approve" | "reject";
      reason?: string;
    };
    const { type, id, action } = body;
    const db = getDb();

    if (type === "drives") {
      await db.placementDrive.update({
        where: { id },
        data: { status: action === "approve" ? "active" : "rejected" },
      });
    } else if (type === "referrals") {
      await db.referral.update({
        where: { id },
        data: { status: action === "approve" ? "published" : "rejected" },
      });
    } else if (type === "external") {
      await db.externalStudent.update({
        where: { id },
        data: { isScreened: true },
      });
    } else if (type === "memories") {
      await db.memory.update({
        where: { id },
        data: { status: action === "approve" ? "approved" : "rejected" },
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Item ${action}d successfully` });
  } catch (error) {
    console.error("Approvals POST Error:", error);
    return NextResponse.json({ success: false, message: "Action failed" }, { status: 500 });
  }
}
