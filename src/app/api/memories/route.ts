export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { memory } from "@/lib/schema";
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
        const [memories, totalCountResult] = await Promise.all([
            db.query.memory.findMany({
                where: eq(memory.status, "approved"),
                orderBy: (t, { desc }) => [desc(t.createdAt)],
                limit: limit,
                offset: skip,
            }),
            db.select({ count: count() }).from(memory).where(eq(memory.status, "approved"))
        ]);
        const totalCount = totalCountResult[0]?.count || 0;

        return NextResponse.json(
            { success: true, memories, totalCount },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
                },
            },
        );
    } catch (error: any) {
        console.error("Error fetching memories:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch memories" }, { status: 500 });
    }
}



