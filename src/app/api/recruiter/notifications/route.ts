export const runtime = 'edge'
export const dynamic = "force-dynamic"

import { NextResponse, NextRequest } from "next/server"
import { getDb } from "@/lib/db"
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

export async function GET(req: NextRequest) {
    try {
        const recruiterTokenData = await getVerifiedAuthPayloadFromRequest(req, ["recruiter"])
        if (!recruiterTokenData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
        const skip = (page - 1) * limit

        const db = getDb()
        const recruiter = await db.recruiter.findUnique({
            where: { email: recruiterTokenData.email },
            select: { id: true },
        })

        if (!recruiter) {
            return NextResponse.json({ success: false, message: "Recruiter not found" }, { status: 404 })
        }

        const [items, totalCount, unreadCount] = await Promise.all([
            db.notification.findMany({
                where: {
                    recruiterId: recruiter.id,
                    recipientType: "recruiter"
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            db.notification.count({
                where: {
                    recruiterId: recruiter.id,
                    recipientType: "recruiter",
                }
            }),
            db.notification.count({
                where: {
                    recruiterId: recruiter.id,
                    recipientType: "recruiter",
                    isRead: false,
                }
            })
        ])

        return NextResponse.json({
            success: true,
            items,
            totalCount,
            unreadCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error: any) {
        console.error("Student Notifications GET Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const recruiterTokenData = await getVerifiedAuthPayloadFromRequest(req, ["recruiter"])
        if (!recruiterTokenData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const body = await req.json() as { all?: string, notificationId?: string }
        const { all, notificationId } = body
        const db = getDb()

        const recruiter = await db.recruiter.findUnique({
            where: { email: recruiterTokenData.email },
            select: { id: true }
        })

        if (!recruiter) {
            return NextResponse.json({ success: false, message: "Recruiter not found" }, { status: 404 })
        }
        if (all) {
            await db.notification.updateMany({
                where: {
                    recruiterId: recruiter.id,
                    recipientType: "recruiter",
                    isRead: false
                },
                data: {
                    isRead: true
                }
            })
            return NextResponse.json({ success: true, message: "All notification marked read" })
        }

        if (!notificationId) {
            return NextResponse.json({success: false, message: "NotificationID is needed!"})
        }
        
        await db.notification.updateMany({
            where: {
                id: notificationId,
                recruiterId: recruiter.id,
                recipientType: "recruiter"
            },
            data: {
                isRead: true
            }
        })
        return NextResponse.json({ success: true, message: "Notification marked as read" });
    } catch (error: any) {
        console.error("Student Notifications GET Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
    }
}