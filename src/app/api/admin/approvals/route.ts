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
        take: 200,
      });
      return NextResponse.json({ success: true, items: drives });
    }

    if (type === "referrals") {
      const referrals = await db.referral.findMany({
        where: { status: "pending" },
        include: { alumni: { select: { name: true, personalEmail: true, profileImageUrl: true } } },
        take: 200,
      });
      return NextResponse.json({ success: true, items: referrals });
    }

    if (type === "external") {
      const externals = await db.externalStudent.findMany({
        where: { isVerified: false },
        select: {
          id: true, name: true, collegeName: true, branch: true, cgpa: true,
          email: true, enrollmentNumber: true, resumeUrl: true, profileImageUrl: true,
          phoneNumber: true, batch: true, course: true, tenthPercentage: true, twelfthPercentage: true,
        },
        take: 200,
      });
      return NextResponse.json({ success: true, items: externals });
    }

    if (type === "memories") {
      const memories = await db.memory.findMany({
        where: {
          OR: [{ status: "pending_moderation" }, { status: "approved" }],
        },
        include: { 
          student: { select: { name: true, enrollmentNumber: true, profileImageUrl: true } },
          alumni: { select: { name: true, enrollmentNumber: true, profileImageUrl: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
      return NextResponse.json({ success: true, items: memories });
    }


    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Approvals GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Approve or reject an item (Supports Bulk)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: string;
      id?: string;
      ids?: string[];
      action: "approve" | "reject";
      reason?: string;
    };
    const { type, id, ids, action } = body;
    const targetIds = ids || (id ? [id] : []);
    
    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, message: "No IDs provided" }, { status: 400 });
    }

    const db = getDb();

    if (type === "drives") {
      await db.placementDrive.updateMany({
        where: { id: { in: targetIds } },
        data: { status: action === "approve" ? "active" : "rejected" },
      });
    } else if (type === "referrals") {
      await db.referral.updateMany({
        where: { id: { in: targetIds } },
        data: { status: action === "approve" ? "published" : "rejected" },
      });
    } else if (type === "external") {
       if (action === "approve") {
          await db.externalStudent.updateMany({
            where: { id: { in: targetIds } },
            data: { isVerified: true },
          });
       } else {
          // Permanent delete for rejected external signups
          await db.externalStudent.deleteMany({
            where: { id: { in: targetIds } },
          });
       }
    } else if (type === "memories") {
      if (action === "approve") {
        await db.memory.updateMany({
          where: { id: { in: targetIds } },
          data: { status: "approved" },
        });
      } else {
        await db.memory.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else {
      return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Action '${action}' completed for ${targetIds.length} item(s)` });
  } catch (error) {
    console.error("Approvals POST Error:", error);
    return NextResponse.json({ success: false, message: "Action failed" }, { status: 500 });
  }
}

