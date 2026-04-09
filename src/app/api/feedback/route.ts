import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const parsedLimit = parseInt(searchParams.get("limit") || "200", 10)
        const parsedPage = parseInt(searchParams.get("page") || "1", 10)

        const limit = isNaN(parsedLimit) ? 200 : Math.min(200, Math.max(1, parsedLimit))
        const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
        const skip = (page - 1) * limit;

        const db = getDb();
        
        const [studentFeedback, alumniFeedback, corporateFeedback, studentFeedbackCount, alumniFeedbackCount, corporateFeedbackCount] = await Promise.all([
            db.studentFeedback.findMany({
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    student: {
                        select: {
                            name: true,
                            branch: true,
                            batch: true,
                            course: true,
                            profileImageUrl: true,
                        }
                    }
                }
            }),
            db.alumniFeedback.findMany({
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    alumni: {
                        select: {
                            name: true,
                            branch: true,
                            batch: true,
                            course: true,
                            profileImageUrl: true,
                        }
                    }
                }
            }),
            db.corporateFeedback.findMany({
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    recruiter: {
                        select: {
                            name: true,
                            company: true,
                            designation: true,
                        }
                    }
                }
            }),
            db.studentFeedback.count(),
            db.alumniFeedback.count(),
            db.corporateFeedback.count(),
        ])
        
        return NextResponse.json({ success: true, studentFeedback, alumniFeedback, corporateFeedback, studentFeedbackCount, alumniFeedbackCount, corporateFeedbackCount });
    } catch (error: any) {
        console.error("Error fetching feedback:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch feedback" }, { status: 500 });
    }
}