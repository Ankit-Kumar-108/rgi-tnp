export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET: Fetch published/approved items by type
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "memories";
    const parsedLimit = parseInt(searchParams.get("limit") || "200", 10);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);

    const limit = isNaN(parsedLimit) ? 200 : Math.max(1, parsedLimit);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const skip = (page - 1) * limit;

    const db = getDb();

    if (type === "memories") {
      const where = { status: "approved" };
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

    if (type === "referrals") {
      const where = { status: "published" };
      const [referrals, totalCount] = await Promise.all([
        db.referral.findMany({
          where,
          include: { alumni: { select: { name: true, personalEmail: true, profileImageUrl: true, enrollmentNumber: true } } },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.referral.count({ where })
      ]);
      return NextResponse.json({ success: true, items: referrals, totalCount });
    }

    if (type === "studentFeedback") {
      const where = { isApproved: true };
      const [feedbacks, totalCount] = await Promise.all([
        db.studentFeedback.findMany({
          where,
          include: { student: { select: { name: true, enrollmentNumber: true, profileImageUrl: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.studentFeedback.count({ where })
      ]);
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    if (type === "alumniFeedback") {
      const where = { isApproved: true };
      const [feedbacks, totalCount] = await Promise.all([
        db.alumniFeedback.findMany({
          where,
          include: { alumni: { select: { name: true, personalEmail: true, profileImageUrl: true, enrollmentNumber: true } } },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.alumniFeedback.count({ where })
      ]);
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    if (type === "corporateFeedback") {
      const where = { isApproved: true };
      const [feedbacks, totalCount] = await Promise.all([
        db.corporateFeedback.findMany({
          where,
          include: { recruiter: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.corporateFeedback.count({ where })
      ]);
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Published GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Unpublish or delete published items (Supports Bulk)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: string;
      id?: string;
      ids?: string[];
      action: "unpublish" | "delete";
    };
    const { type, id, ids, action } = body;
    const targetIds = ids || (id ? [id] : []);

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, message: "No IDs provided" }, { status: 400 });
    }

    const db = getDb();

    if (type === "memories") {
      if (action === "unpublish") {
        await db.memory.updateMany({
          where: { id: { in: targetIds } },
          data: { status: "pending_moderation" },
        });
      } else {
        await db.memory.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "referrals") {
      if (action === "unpublish") {
        await db.referral.updateMany({
          where: { id: { in: targetIds } },
          data: { status: "pending" },
        });
      } else {
        await db.referral.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "studentFeedback") {
      if (action === "unpublish") {
        await db.studentFeedback.updateMany({
          where: { id: { in: targetIds } },
          data: { isApproved: false },
        });
      } else {
        await db.studentFeedback.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "alumniFeedback") {
      if (action === "unpublish") {
        await db.alumniFeedback.updateMany({
          where: { id: { in: targetIds } },
          data: { isApproved: false },
        });
      } else {
        await db.alumniFeedback.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "corporateFeedback") {
      if (action === "unpublish") {
        await db.corporateFeedback.updateMany({
          where: { id: { in: targetIds } },
          data: { isApproved: false },
        });
      } else {
        await db.corporateFeedback.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else {
      return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    const action_text = action === "unpublish" ? "unpublished" : "deleted";
    return NextResponse.json({ success: true, message: `${action_text.charAt(0).toUpperCase() + action_text.slice(1)} ${targetIds.length} item(s)` });
  } catch (error) {
    console.error("Published POST Error:", error);
    return NextResponse.json({ success: false, message: "Action failed" }, { status: 500 });
  }
}
