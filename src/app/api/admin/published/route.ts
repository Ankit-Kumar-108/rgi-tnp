export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, inArray, count } from "drizzle-orm";
import * as schema from "@/lib/schema";

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
      const [memories, countResult] = await Promise.all([
        db.query.memory.findMany({
          where: eq(schema.memory.status, "approved"),
          with: {
            student: { columns: { name: true, enrollmentNumber: true, profileImageUrl: true } },
            alumni: { columns: { name: true, enrollmentNumber: true, profileImageUrl: true } }
          },
          orderBy: (t, { desc }) => [desc(t.createdAt)],
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.memory).where(eq(schema.memory.status, "approved"))
      ]);
      const totalCount = countResult[0]?.count || 0;
      return NextResponse.json({ success: true, items: memories, totalCount });
    }

    if (type === "referrals") {
      const [referrals, countResult] = await Promise.all([
        db.query.referral.findMany({
          where: eq(schema.referral.status, "published"),
          with: { alumni: { columns: { name: true, personalEmail: true, profileImageUrl: true, enrollmentNumber: true } } },
          orderBy: (t, { desc }) => [desc(t.createdAt)],
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.referral).where(eq(schema.referral.status, "published"))
      ]);
      const totalCount = countResult[0]?.count || 0;
      return NextResponse.json({ success: true, items: referrals, totalCount });
    }

    if (type === "studentFeedback") {
      const [feedbacks, countResult] = await Promise.all([
        db.query.studentFeedback.findMany({
          where: eq(schema.studentFeedback.isApproved, true),
          with: { student: { columns: { name: true, enrollmentNumber: true, profileImageUrl: true, email: true } } },
          orderBy: (t, { desc }) => [desc(t.createdAt)],
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.studentFeedback).where(eq(schema.studentFeedback.isApproved, true))
      ]);
      const totalCount = countResult[0]?.count || 0;
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    if (type === "alumniFeedback") {
      const [feedbacks, countResult] = await Promise.all([
        db.query.alumniFeedback.findMany({
          where: eq(schema.alumniFeedback.isApproved, true),
          with: { alumni: { columns: { name: true, personalEmail: true, profileImageUrl: true, enrollmentNumber: true } } },
          orderBy: (t, { desc }) => [desc(t.createdAt)],
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.alumniFeedback).where(eq(schema.alumniFeedback.isApproved, true))
      ]);
      const totalCount = countResult[0]?.count || 0;
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    if (type === "corporateFeedback") {
      const [feedbacks, countResult] = await Promise.all([
        db.query.corporateFeedback.findMany({
          where: eq(schema.corporateFeedback.isApproved, true),
          with: { recruiter: { columns: { name: true, email: true } } },
          orderBy: (t, { desc }) => [desc(t.createdAt)],
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.corporateFeedback).where(eq(schema.corporateFeedback.isApproved, true))
      ]);
      const totalCount = countResult[0]?.count || 0;
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
        await db.update(schema.memory)
          .set({ status: "pending_moderation" })
          .where(inArray(schema.memory.id, targetIds));
      } else {
        await db.delete(schema.memory).where(inArray(schema.memory.id, targetIds));
      }
    } else if (type === "referrals") {
      if (action === "unpublish") {
        await db.update(schema.referral)
          .set({ status: "pending" })
          .where(inArray(schema.referral.id, targetIds));
      } else {
        await db.delete(schema.referral).where(inArray(schema.referral.id, targetIds));
      }
    } else if (type === "studentFeedback") {
      if (action === "unpublish") {
        await db.update(schema.studentFeedback)
          .set({ isApproved: false })
          .where(inArray(schema.studentFeedback.id, targetIds));
      } else {
        await db.delete(schema.studentFeedback).where(inArray(schema.studentFeedback.id, targetIds));
      }
    } else if (type === "alumniFeedback") {
      if (action === "unpublish") {
        await db.update(schema.alumniFeedback)
          .set({ isApproved: false })
          .where(inArray(schema.alumniFeedback.id, targetIds));
      } else {
        await db.delete(schema.alumniFeedback).where(inArray(schema.alumniFeedback.id, targetIds));
      }
    } else if (type === "corporateFeedback") {
      if (action === "unpublish") {
        await db.update(schema.corporateFeedback)
          .set({ isApproved: false })
          .where(inArray(schema.corporateFeedback.id, targetIds));
      } else {
        await db.delete(schema.corporateFeedback).where(inArray(schema.corporateFeedback.id, targetIds));
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

