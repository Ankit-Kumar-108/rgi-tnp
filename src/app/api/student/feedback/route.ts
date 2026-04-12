export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

const getStudentFromToken = async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return null
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jose.jwtVerify(token, secret);
        return payload as any;
    } catch (error: any) {
        console.error("Token Verification Error:", error)
        return null
    }
}

export async function POST(req: NextRequest) {
    try {
        const student = await getStudentFromToken(req);
        if (!student) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        if (!student.id) {
            return NextResponse.json({ success: false, message: "Invalid student token: missing id" }, { status: 400 });
        }
        const body = await req.json() as { content: string, rating: number };
        const db = getDb();

        const feedback = await db.studentFeedback.create({
            data: {
                content: body.content,
                rating: body.rating,
                studentId: student.id,
                isApproved: false,
                createdAt: new Date()
            }
        });

        return NextResponse.json({ success: true, message: "Feedback submitted successfully", feedback }, { status: 201 });
    } catch (error) {
        console.error("Feedback Submission Error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit feedback" }, { status: 500 });
    }
}