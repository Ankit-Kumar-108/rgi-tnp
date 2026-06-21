export const dynamic = 'force-dynamic'; // Required for Cloudflare D1

import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { and, eq, or, like, desc, count } from "drizzle-orm";
import { alumni } from "@/lib/schema";

export async function GET(req: NextRequest) {
    try {
        const db = getDb();
        
        const {searchParams} = new URL(req.url)
        const batch = searchParams.get("batch")
        const branch = searchParams.get("branch")
        const search = searchParams.get("search")
        const course = searchParams.get("course")
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "12", 10);
        
        const skipOffset = (page - 1) * limit;

        const conditions = [eq(alumni.isVerified, true)];

        if (batch && batch !== "All Batches") {
            conditions.push(eq(alumni.batch, batch));
        }
        
        if (branch && branch !== "All Branches") {
            conditions.push(eq(alumni.branch, branch));
        }

        if (course && course !== "All Courses") {
            conditions.push(eq(alumni.course, course));
        }

        if (search && search !== "") {
            const searchPattern = `%${search}%`;
            conditions.push(or(
                like(alumni.name, searchPattern),
                like(alumni.currentCompany, searchPattern),
                like(alumni.jobTitle, searchPattern),
                like(alumni.city, searchPattern)
            )!);
        }

        const whereExpr = and(...conditions);

        const alumniData = await db.query.alumni.findMany({
            where: whereExpr,
            columns: {
                id: true,
                name: true,
                enrollmentNumber: true,
                currentCompany: true,
                jobTitle: true,
                city: true,
                batch: true,
                course: true,
                profileImageUrl: true,
                about: true,
                country: true,
                branch: true,
                linkedInUrl: true,
                privacyJson: true,
                isVerified: true,
            },
            offset: skipOffset,
            limit: limit,
            orderBy: [desc(alumni.id)],
        });

        const totalRecordsResult = await db.select({ count: count() }).from(alumni).where(whereExpr);
        const totalRecords = totalRecordsResult[0]?.count || 0;

        const hasMore = (skipOffset + limit) < totalRecords;

        return NextResponse.json({ 
            success: true, 
            alumniData,
            hasMore 
        });
        
    } catch (error: any) {
        console.error("Alumni API Fetch Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to load network data" }, 
            { status: 500 }
        );
    }
}