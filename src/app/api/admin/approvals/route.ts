export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET: Fetch pending items by type
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "drives";
    const parsedLimit = parseInt(searchParams.get("limit") || "200", 10);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);

    const limit = isNaN(parsedLimit) ? 200 : Math.max(1, parsedLimit);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const skip = (page - 1) * limit;



    const db = getDb();

    if (type === "drives") {
      const where = { status: "pending" };
      const [drives, totalCount] = await Promise.all([
        db.placementDrive.findMany({
          where,
          include: { recruiter: { select: { name: true, company: true, email: true } } },
          orderBy: { driveDate: "desc" },
          take: limit,
          skip: skip,
        }),
        db.placementDrive.count({ where })
      ]);
      return NextResponse.json({ success: true, items: drives, totalCount });
    }

    if (type === "referrals") {
      const where = { status: "pending" };
      const [referrals, totalCount] = await Promise.all([
        db.referral.findMany({
          where,
          include: { alumni: { select: { name: true, personalEmail: true, profileImageUrl: true } } },
          take: limit,
          skip: skip,
        }),
        db.referral.count({ where })
      ])
      return NextResponse.json({ success: true, items: referrals, totalCount });
    }

    if (type === "external") {
      const where = { isVerified: false };
      const [externals, totalCount] = await Promise.all([
        db.externalStudent.findMany({
          where,
          select: {
            id: true, name: true, collegeName: true, branch: true, cgpa: true,
            email: true, enrollmentNumber: true, resumeUrl: true, profileImageUrl: true,
          phoneNumber: true, batch: true, course: true, tenthPercentage: true, twelfthPercentage: true,
        },
        take: limit,
        skip: skip,
      }),
      db.externalStudent.count({ where })
      ]);
      return NextResponse.json({ success: true, items: externals, totalCount });
    }

    if (type === "memories") {
      const where = { OR: [{ status: "pending_moderation" }, { status: "approved" }] };
      const [memories, totalCount] = await Promise.all([
        db.memory.findMany({
          where,
          include: { 
          student: { select: { name: true, enrollmentNumber: true, profileImageUrl: true } },
          alumni: { select: { name: true, enrollmentNumber: true, profileImageUrl: true } }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
      }),
      db.memory.count({ where })
      ]);
      return NextResponse.json({ success: true, items: memories, totalCount });
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

