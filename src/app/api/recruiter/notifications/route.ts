export const dynamic = "force-dynamic"

import { NextResponse, NextRequest } from "next/server"
import { getDb } from "@/lib/db"
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { recruiter as recruiterTable, notification } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const recruiterTokenData = await getVerifiedAuthPayloadFromRequest(req, ["recruiter"])
        if (!recruiterTokenData || !recruiterTokenData.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
        const skip = (page - 1) * limit

        const db = getDb()
        const recruiterData = await db.query.recruiter.findFirst({
            where: eq(recruiterTable.email, recruiterTokenData.email),
            columns: { id: true },
        })

        if (!recruiterData) {
            return NextResponse.json({ success: false, message: "Recruiter not found" }, { status: 404 })
        }

        const [items, totalCountResult, unreadCountResult] = await Promise.all([
            db.query.notification.findMany({
                where: and(
                    eq(notification.recruiterId, recruiterData.id),
                    eq(notification.recipientType, "recruiter")
                ),
                orderBy: (t, { desc }) => [desc(t.createdAt)],
                limit: limit,
                offset: skip,
            }),
            db.select({ count: count() }).from(notification).where(
                and(
                    eq(notification.recruiterId, recruiterData.id),
                    eq(notification.recipientType, "recruiter")
                )
            ),
            db.select({ count: count() }).from(notification).where(
                and(
                    eq(notification.recruiterId, recruiterData.id),
                    eq(notification.recipientType, "recruiter"),
                    eq(notification.isRead, false)
                )
            )
        ])

        const totalCount = Number(totalCountResult[0]?.count || 0);
        const unreadCount = Number(unreadCountResult[0]?.count || 0);

        return NextResponse.json({
            success: true,
            items,
            totalCount,
            unreadCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error: any) {
        console.error("Recruiter Notifications GET Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const recruiterTokenData = await getVerifiedAuthPayloadFromRequest(req, ["recruiter"])
        if (!recruiterTokenData || !recruiterTokenData.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const body = await req.json() as { all?: boolean, notificationId?: string }
        const { all, notificationId } = body
        const db = getDb()

        const recruiterData = await db.query.recruiter.findFirst({
            where: eq(recruiterTable.email, recruiterTokenData.email),
            columns: { id: true }
        })

        if (!recruiterData) {
            return NextResponse.json({ success: false, message: "Recruiter not found" }, { status: 404 })
        }
        if (all) {
            await db.update(notification).set({
                isRead: true
            }).where(
                and(
                    eq(notification.recruiterId, recruiterData.id),
                    eq(notification.recipientType, "recruiter"),
                    eq(notification.isRead, false)
                )
            );
            return NextResponse.json({ success: true, message: "All notification marked read" })
        }

        if (!notificationId) {
            return NextResponse.json({success: false, message: "NotificationID is needed!"})
        }
        
        await db.update(notification).set({
            isRead: true
        }).where(
            and(
                eq(notification.id, notificationId),
                eq(notification.recruiterId, recruiterData.id),
                eq(notification.recipientType, "recruiter")
            )
        );
        return NextResponse.json({ success: true, message: "Notification marked as read" });
    } catch (error: any) {
        console.error("Recruiter Notifications PATCH Error:", error);
        return NextResponse.json({ success: false, message: "Failed to update notifications" }, { status: 500 });
    }
}