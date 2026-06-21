export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt"
import { externalStudent, notification } from "@/lib/schema"
import { eq, and, count } from "drizzle-orm"

export async function GET(req: NextRequest) {
    try {
        const getExternalStudentData = await getVerifiedAuthPayloadFromRequest(req, ["external_student"])
        if (!getExternalStudentData || !getExternalStudentData.enrollmentNumber) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const { searchParams } = new URL(req.url)
        const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
        const skip = (page - 1) * limit
        const db = getDb()

        const externalStudentData = await db.query.externalStudent.findFirst({
            where: eq(externalStudent.enrollmentNumber, getExternalStudentData.enrollmentNumber),
            columns: { id: true }
        })

        if (!externalStudentData) {
            return NextResponse.json({ success: false, message: "External Student not found!" }, { status: 404 })
        }

        const [items, totalCountResult, unreadCountResult] = await Promise.all([
            db.query.notification.findMany({
                where: and(
                    eq(notification.externalStudentId, externalStudentData.id),
                    eq(notification.recipientType, "external_student")
                ),
                orderBy: (t, { desc }) => [desc(t.createdAt)],
                limit: limit,
                offset: skip,
            }),
            db.select({ count: count() }).from(notification).where(
                and(
                    eq(notification.externalStudentId, externalStudentData.id),
                    eq(notification.recipientType, "external_student")
                )
            ),
            db.select({ count: count() }).from(notification).where(
                and(
                    eq(notification.externalStudentId, externalStudentData.id),
                    eq(notification.recipientType, "external_student"),
                    eq(notification.isRead, false)
                )
            )
        ])

        const totalCount = totalCountResult[0]?.count || 0;
        const unreadCount = unreadCountResult[0]?.count || 0;

        return NextResponse.json({
            success: true,
            items,
            totalCount,
            unreadCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        })
    } catch (error: any) {
        console.error("Error fetching External Student Notification:", error)
        return NextResponse.json({ success: false, message: "Error fetching External Student Notification" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const getExternalStudentData = await getVerifiedAuthPayloadFromRequest(req, ["external_student"])
        if (!getExternalStudentData || !getExternalStudentData.enrollmentNumber){
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const body = await req.json() as {notificationId?: string, all?: boolean}
        const {all, notificationId} = body
        const db = getDb()

        const externalStudentData = await db.query.externalStudent.findFirst({
            where: eq(externalStudent.enrollmentNumber, getExternalStudentData.enrollmentNumber),
            columns: {id: true}
        })

        if (!externalStudentData) {
            return NextResponse.json({ success: false, message: "External Student not found" }, { status: 404 })
        }

        if(all){
            await db.update(notification).set({
                isRead: true
            }).where(
                and(
                    eq(notification.externalStudentId, externalStudentData.id),
                    eq(notification.recipientType, "external_student"),
                    eq(notification.isRead, false)
                )
            );
            return NextResponse.json({ success: true, message: "All notifications marked as read" })
        }
        if(! notificationId){
            return NextResponse.json({success: false, message: "notificationId is needed!"})
        }
        await db.update(notification).set({
            isRead: true
        }).where(
            and(
                eq(notification.id, notificationId),
                eq(notification.externalStudentId, externalStudentData.id),
                eq(notification.recipientType, "external_student"),
                eq(notification.isRead, false)
            )
        );
        return NextResponse.json({ success: true, message: "Notification marked as read" })
    } catch (error: any) {
        return NextResponse.json({success: false, message: "Error updating notification"})
    }
}