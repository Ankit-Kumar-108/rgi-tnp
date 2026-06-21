export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, notification } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";

/**
 * GET /api/student/notifications
 * Returns paginated notifications for the student and the total unread count.
 */
export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const skip = (page - 1) * limit;

    const db = getDb();

    // First fetch the student id
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true },
    });

    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Fetch unread count and paginated list in parallel
    const [items, totalCountResult, unreadCountResult] = await Promise.all([
      db.query.notification.findMany({
        where: and(
          eq(notification.studentId, studentData.id),
          eq(notification.recipientType, "student")
        ),
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit: limit,
        offset: skip,
      }),
      db.select({ count: count() }).from(notification).where(
        and(
          eq(notification.studentId, studentData.id),
          eq(notification.recipientType, "student")
        )
      ),
      db.select({ count: count() }).from(notification).where(
        and(
          eq(notification.studentId, studentData.id),
          eq(notification.recipientType, "student"),
          eq(notification.isRead, false)
        )
      ),
    ]);

    const totalCount = totalCountResult[0]?.count || 0;
    const unreadCount = unreadCountResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      items,
      totalCount,
      unreadCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Student Notifications GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch student notifications" }, { status: 500 });
  }
}

 // Marks a single notification (or all notifications) as read.
 export async function PATCH(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as { notificationId?: string; all?: boolean };
    const { notificationId, all } = body;

    const db = getDb();

    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true },
    });

    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (all) {
      // Mark all as read
      await db.update(notification).set({ isRead: true }).where(
        and(
          eq(notification.studentId, studentData.id),
          eq(notification.recipientType, "student"),
          eq(notification.isRead, false)
        )
      );

      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (!notificationId) {
      return NextResponse.json({ success: false, message: "notificationId is required" }, { status: 400 });
    }

    // Mark single notification as read
    await db.update(notification).set({ isRead: true }).where(
      and(
        eq(notification.id, notificationId),
        eq(notification.studentId, studentData.id),
        eq(notification.recipientType, "student")
      )
    );

    return NextResponse.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Student Notifications PATCH Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update notification" }, { status: 500 });
  }
}
