export const runtime = "edge"; // Required for Cloudflare D1

import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const db = getDb();
        
        const {searchParams} = new URL(req.url)
        const batch = searchParams.get("batch")
        const search = searchParams.get("search")
        const course = searchParams.get("course")
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "12", 10);
        
        const skipOffset = (page - 1) * limit;

        const whereClause: any = {
            isVerified: true,
        };

        if (batch && batch !== "All Batches") {
            whereClause.batch = batch;
        }

        // FIXED: Removed mode: "insensitive" as SQLite doesn't support/need it
        if (search && search !== "") {
            whereClause.OR = [
                { name: { contains: search } },
                { currentCompany: { contains: search } },
                { jobTitle: { contains: search } },
                { city: { contains: search } },
            ];
        }

        if (course && course !== "All Courses") {
            whereClause.course = course;
        }

        const alumniData = await db.alumni.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                enrollmentNumber: true,
                currentCompany: true,
                jobTitle: true,
                city: true,
                batch: true,
                course: true,
                profileImageUrl: true,
            },
            skip: skipOffset,
            take: limit,
            orderBy: {
                id: 'desc' 
            }
        });

        // FIXED: Replaced { isVerified: true } with the dynamic whereClause
        const totalRecords = await db.alumni.count({
            where: whereClause 
        });

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