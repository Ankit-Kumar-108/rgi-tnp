export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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

    // Build Prisma query condition
    const where: any = {};

    if (search) {
      where.OR = [
        { to: { contains: search } },
        { subject: { contains: search } },
      ];
    }

    if (status !== "all") {
      where.status = status;
    }

    if (type !== "all") {
      where.template = type;
    }

    // Execute queries in parallel
    const [items, totalCount, stats] = await Promise.all([
      db.emailLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      db.emailLog.count({ where }),
      db.emailLog.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    // Format metrics
    const totalSent = stats.reduce((acc, curr) => acc + curr._count, 0);
    const sentSuccess = stats.find((s) => s.status === "sent")?._count || 0;
    const sentFailed = stats.find((s) => s.status === "failed")?._count || 0;

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
    const body = await req.json() as {
      audience: string;
      subject: string;
      message: string;
      channels?: ("email" | "in_app")[];
    };

    const { audience, subject, message, channels = ["email", "in_app"] } = body;

    if (!audience || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Audience, subject, and message are required" },
        { status: 400 }
      );
    }

    // Trigger asynchronous broadcast distribution utilizing Cloudflare waitUntil
    NotificationService.triggerBroadcast({
      audience,
      subject,
      message,
      triggeredBy: adminEmail,
      channels,
    });

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
