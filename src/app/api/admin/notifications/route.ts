export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, count, and, or, like } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { NotificationService } from "@/lib/notification-service";

/**
 * GET /api/admin/notifications
 * Returns paginated email logs with filtering, search, and aggregated delivery stats.
 */
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);

    // Parse filters
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const skip = (page - 1) * limit;

    // Build conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          like(schema.emailLog.to, `%${search}%`),
          like(schema.emailLog.subject, `%${search}%`)
        )
      );
    }

    if (status !== "all") {
      conditions.push(eq(schema.emailLog.status, status));
    }

    if (type !== "all") {
      conditions.push(eq(schema.emailLog.template, type));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Execute queries in parallel
    const [items, totalCountResult, statsRows] = await Promise.all([
      db.query.emailLog.findMany({
        where: whereClause,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit,
        offset: skip,
      }),
      db.select({ count: count() }).from(schema.emailLog).where(whereClause),
      db.select({
        status: schema.emailLog.status,
        cnt: count(),
      })
      .from(schema.emailLog)
      .where(whereClause)
      .groupBy(schema.emailLog.status),
    ]);

    const totalCount = totalCountResult[0]?.count || 0;

    // Format metrics
    const totalSent = statsRows.reduce((acc, curr) => acc + curr.cnt, 0);
    const sentSuccess = statsRows.find((s) => s.status === "sent")?.cnt || 0;
    const sentFailed = statsRows.find((s) => s.status === "failed")?.cnt || 0;

    return NextResponse.json({
      success: true,
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      stats: {
        totalSent,
        sentSuccess,
        sentFailed,
      },
    });
  } catch (error) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notification logs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/notifications
 * Handles compose modal submissions and queues an asynchronous audience broadcast.
 */
export async function POST(req: NextRequest) {
  try {
    const adminEmail = req.headers.get("x-admin-email") || "system";
    const body = await req.json() as any;
    const audience = body.audience || body.to;
    const { subject, message, course, branch, driveId } = body;
    const registrationIds = Array.isArray(body.registrationIds)
      ? body.registrationIds
        .filter((id: unknown): id is string => typeof id === "string" && id.trim().length > 0)
        .map((id: string) => id.trim())
      : undefined;
    
    let channels = body.channels;
    if (!channels) {
      channels = [];
      if (body.emailChannel !== false) channels.push("email");
      if (body.inAppChannel !== false) channels.push("in_app");
    }

    if (!audience || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Audience, subject, and message are required" },
        { status: 400 }
      );
    }

    if (
      [
        "selected_drive_participants",
        "all_drive_participants",
        "internal_drive_participants",
        "external_drive_participants",
        "alumni_drive_participants",
      ].includes(audience) && !driveId
    ) {
      return NextResponse.json(
        { success: false, message: "Drive ID is required for participant broadcasts" },
        { status: 400 }
      );
    }

    if (audience === "selected_drive_participants" && !registrationIds?.length) {
      return NextResponse.json(
        { success: false, message: "Please select at least one participant" },
        { status: 400 }
      );
    }

    if (registrationIds && registrationIds.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Maximum 1000 selected participants per broadcast" },
        { status: 400 }
      );
    }

    // Trigger asynchronous broadcast distribution utilizing Cloudflare waitUntil
    const result = await NotificationService.triggerBroadcast({
      audience,
      subject,
      message,
      triggeredBy: adminEmail,
      channels,
      course,
      branch,
      driveId,
      registrationIds,
    });

    if(!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message,
      }, {status: 400});
    }

    return NextResponse.json({
      success: true,
      message: "Broadcast notification queued successfully",
    });
  } catch (error) {
    console.error("Notifications POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to queue broadcast" },
      { status: 500 }
    );
  }
}

