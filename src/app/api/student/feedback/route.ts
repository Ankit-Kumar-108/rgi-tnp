export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { studentFeedback } from "@/lib/schema";

export async function POST(req: NextRequest) {
    try {
        const student = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
        if (!student) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        if (!student.id) {
            return NextResponse.json({ success: false, message: "Invalid student token: missing id" }, { status: 400 });
        }
        const body = await req.json() as { content: string, rating: number };
        const db = getDb();

        const feedbackResult = await db.insert(studentFeedback).values({
            content: body.content,
            rating: body.rating,
            studentId: student.id,
            isApproved: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).returning();
        const feedback = feedbackResult[0];

        return NextResponse.json({ success: true, message: "Feedback submitted successfully", feedback }, { status: 201 });
    } catch (error) {
        console.error("Feedback Submission Error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit feedback" }, { status: 500 });
    }
}