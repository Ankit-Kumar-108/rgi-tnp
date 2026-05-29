export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

async function getStudentFromToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

/**
 * GET /api/student/notifications
 * Returns paginated notifications for the student and the total unread count.
 */
export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getStudentFromToken(req);
    if (!studentTokenData) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const skip = (page - 1) * limit;

    const db = getDb();

    // First fetch the student id
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Fetch unread count and paginated list in parallel
    const [items, totalCount, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: {
          studentId: student.id,
          recipientType: "student",
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      db.notification.count({
        where: {
          studentId: student.id,
          recipientType: "student",
        },
      }),
      db.notification.count({
        where: {
          studentId: student.id,
          recipientType: "student",
          isRead: false,
        },
      }),
    ]);

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
    const studentTokenData = await getStudentFromToken(req);
    if (!studentTokenData) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as { notificationId?: string; all?: boolean };
    const { notificationId, all } = body;

    const db = getDb();

    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (all) {
      // Mark all as read
      await db.notification.updateMany({
        where: {
          studentId: student.id,
          recipientType: "student",
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (!notificationId) {
      return NextResponse.json({ success: false, message: "notificationId is required" }, { status: 400 });
    }

    // Mark single notification as read
    await db.notification.updateMany({
      where: {
        id: notificationId,
        studentId: student.id,
        recipientType: "student",
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Student Notifications PATCH Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update notification" }, { status: 500 });
  }
}
