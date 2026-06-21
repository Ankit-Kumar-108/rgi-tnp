export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { corporateFeedback } from "@/lib/schema";

export async function POST(req: NextRequest) {
    try {
        const recruiter = await getVerifiedAuthPayloadFromRequest(req, ["recruiter"]);
        if (!recruiter) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        if (!recruiter.id) {
            return NextResponse.json({ success: false, message: "Invalid recruiter token: missing id" }, { status: 400 });
        }
        const body = await req.json() as { content: string, rating: number };
        const db = getDb();
        const feedbackResult = await db.insert(corporateFeedback).values({
            content: body.content,
            rating: body.rating,
            recruiterId: recruiter.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).returning();
        const feedback = feedbackResult[0];
        return NextResponse.json({ success: true, message: "Feedback submitted successfully", feedback }, { status: 201 });
    }
        catch (error) {
        console.error("Feedback Submission Error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit feedback" }, { status: 500 });
    }
}



