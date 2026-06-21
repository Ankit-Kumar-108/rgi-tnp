export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { studentFeedback, alumniFeedback, corporateFeedback } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const parsedLimit = parseInt(searchParams.get("limit") || "200", 10)
        const parsedPage = parseInt(searchParams.get("page") || "1", 10)

        const limit = isNaN(parsedLimit) ? 200 : Math.min(200, Math.max(1, parsedLimit))
        const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
        const skip = (page - 1) * limit;

        const db = getDb();
        
        const [
            studentFeedbackList,
            alumniFeedbackList,
            corporateFeedbackList,
            studentFeedbackCountResult,
            alumniFeedbackCountResult,
            corporateFeedbackCountResult
        ] = await Promise.all([
            db.query.studentFeedback.findMany({
                limit: limit,
                offset: skip,
                where: eq(studentFeedback.isApproved, true),
                orderBy: (t, { desc }) => [desc(t.createdAt)],
                with: {
                    student: {
                        columns: {
                            name: true,
                            branch: true,
                            batch: true,
                            course: true,
                            profileImageUrl: true,
                        }
                    }
                }
            }),
            db.query.alumniFeedback.findMany({
                limit: limit,
                offset: skip,
                where: eq(alumniFeedback.isApproved, true),
                orderBy: (t, { desc }) => [desc(t.createdAt)],
                with: {
                    alumni: {
                        columns: {
                            name: true,
                            branch: true,
                            batch: true,
                            course: true,
                            profileImageUrl: true,
                        }
                    }
                }
            }),
            db.query.corporateFeedback.findMany({
                limit: limit,
                offset: skip,
                where: eq(corporateFeedback.isApproved, true),
                orderBy: (t, { desc }) => [desc(t.createdAt)],
                with: {
                    recruiter: {
                        columns: {
                            name: true,
                            company: true,
                            designation: true,
                        }
                    }
                }
            }),
            db.select({ count: count() }).from(studentFeedback).where(eq(studentFeedback.isApproved, true)),
            db.select({ count: count() }).from(alumniFeedback).where(eq(alumniFeedback.isApproved, true)),
            db.select({ count: count() }).from(corporateFeedback).where(eq(corporateFeedback.isApproved, true)),
        ])

        const studentFeedbackCount = studentFeedbackCountResult[0]?.count || 0;
        const alumniFeedbackCount = alumniFeedbackCountResult[0]?.count || 0;
        const corporateFeedbackCount = corporateFeedbackCountResult[0]?.count || 0;
        
        return NextResponse.json({
            success: true,
            studentFeedback: studentFeedbackList,
            alumniFeedback: alumniFeedbackList,
            corporateFeedback: corporateFeedbackList,
            studentFeedbackCount,
            alumniFeedbackCount,
            corporateFeedbackCount
        });
    } catch (error: any) {
        console.error("Error fetching feedback:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch feedback" }, { status: 500 });
    }
}