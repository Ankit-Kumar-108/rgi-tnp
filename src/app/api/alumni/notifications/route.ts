export const runtime = "edge"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import * as jose from "jose"

async function getAlumniToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return null
    const token = authHeader.replace("Bearer ", "")
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)
        return payload as any
    } catch (error: any) {
        console.error("Error authorizing external-student")
        return null
    }
}

export async function GET(req: NextRequest) {
    try {
        const getAlumniData = await getAlumniToken(req)
        if (!getAlumniData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const { searchParams } = new URL(req.url)
        const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
        const skip = (page - 1) * limit
        const db = getDb()

        const Alumni = await db.alumni.findUnique({
            where: { enrollmentNumber: getAlumniData.enrollmentNumber },
            select: { id: true }
        })

        if (!Alumni) {
            return NextResponse.json({ success: false, message: "Alumni not found!" }, { status: 404 })
        }

        const [items, totalCount, unreadCount] = await Promise.all([
            db.notification.findMany({
                where: {
                    alumniId: Alumni.id,
                    recipientType: "alumni",
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            db.notification.count({
                where: {
                    alumniId: Alumni.id,
                    recipientType: "alumni"
                }
            }),
            db.notification.count({
                where: {
                    alumniId: Alumni.id,
                    recipientType: "alumni"
                }
            })
        ])
        return NextResponse.json({
            success: true,
            items,
            totalCount,
            unreadCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        })
    } catch (error: any) {
        console.error("Error fetching Alumni Notification")
        return NextResponse.json({ success: false, message: "Error fetching Alumni Notification" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const getAlumniData = await getAlumniToken(req)
        if (!getAlumniData){
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const body = await req.json() as {notificationId: string, all: string}
        const {all, notificationId} = body
        const db = getDb()

        const Alumni = await db.alumni.findUnique({
            where: {enrollmentNumber: getAlumniData.enrollmentNumber},
            select: {id: true}
        })

        if(all){
            await db.notification.updateMany({
                where: {
                    alumniId: Alumni?.id,
                    recipientType: "alumni",
                    isRead: false
                },
                data: {isRead: true}
            })
            return NextResponse.json({ success: true, message: "All notifications marked as read" })
        }
        if(! notificationId){
            return NextResponse.json({success: false, message: "notificationId is needed!"})
        }
        await db.notification.updateMany({
            where: {
                id: notificationId,
                alumniId: Alumni?.id,
                recipientType: "alumni",
                isRead: false
            },
            data: {isRead: true}
        })
        return NextResponse.json({ success: true, message: "Notification marked as read" })
    } catch (error: any) {
        return NextResponse.json({success: false, message: "Error updating notification"})
    }
}