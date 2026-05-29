export const runtime = "edge"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import * as jose from "jose"

async function getExternalStudentToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return null
    const token = authHeader.replace("Bearer ", "")
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)
        return payload as any
    } catch (error: any) {
        console.error("Error authorizing external student")
        return null
    }
}

export async function GET(req: NextRequest) {
    try {
        const getExternalStudentData = await getExternalStudentToken(req)
        if (!getExternalStudentData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const { searchParams } = new URL(req.url)
        const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
        const skip = (page - 1) * limit
        const db = getDb()

        const ExternalStudent = await db.externalStudent.findUnique({
            where: { enrollmentNumber: getExternalStudentData.enrollmentNumber },
            select: { id: true }
        })

        if (!ExternalStudent) {
            return NextResponse.json({ success: false, message: "External Student not found!" }, { status: 404 })
        }

        const [items, totalCount, unreadCount] = await Promise.all([
            db.notification.findMany({
                where: {
                    externalStudentId: ExternalStudent.id,
                    recipientType: "external_student",
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            db.notification.count({
                where: {
                    externalStudentId: ExternalStudent.id,
                    recipientType: "external_student"
                }
            }),
            db.notification.count({
                where: {
                    externalStudentId: ExternalStudent.id,
                    recipientType: "external_student"
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
        console.error("Error Fertching External Student Notification")
        return NextResponse.json({ success: false, message: "Error fetching External Student Notification" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const getExternalStudentData = await getExternalStudentToken(req)
        if (!getExternalStudentData){
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const body = await req.json() as {notificationId: string, all: string}
        const {all, notificationId} = body
        const db = getDb()

        const ExternalStudent = await db.externalStudent.findUnique({
            where: {enrollmentNumber: getExternalStudentData.enrollmentNumber},
            select: {id: true}
        })

        if(all){
            await db.notification.updateMany({
                where: {
                    externalStudentId: ExternalStudent?.id,
                    recipientType: "external_student",
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
                externalStudentId: ExternalStudent?.id,
                recipientType: "external_student",
                isRead: false
            },
            data: {isRead: true}
        })
        return NextResponse.json({ success: true, message: "Notification marked as read" })
    } catch (error: any) {
        return NextResponse.json({success: false, message: "Error updating notification"})
    }
}