export const runtime = 'edge';  

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
    try {
        const db = getDb();
        const memories = await db.memory.findMany({
            where: { status: "approved" },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, memories });
    } catch (error: any) {
        console.error("Error fetching memories:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch memories" }, { status: 500 });
    }
}



