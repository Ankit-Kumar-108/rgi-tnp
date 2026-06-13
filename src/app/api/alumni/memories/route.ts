export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { deleteMultipleFromR2 } from "@/lib/r2-delete";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";




export async function POST(req: NextRequest) {
    try {
        const alumniTokenData = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
        if (!alumniTokenData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { memories } = (await req.json()) as { memories: { imageUrl: string; title: string }[] };
        if (!memories || !Array.isArray(memories) || memories.length === 0) {
            return NextResponse.json({ success: false, message: "No memories provided" }, { status: 400 });
        }
        const db = getDb();
        // Find alumni ID first
        const alumni = await db.alumni.findUnique({
            where: { enrollmentNumber: alumniTokenData.enrollmentNumber },
        });
        if (!alumni) {
            return NextResponse.json({ success: false, message: "Alumni not found" }, { status: 404 });
        }
        // Create Memory records in batch
        const newRecords = await db.memory.createMany({
            data: memories.map(m => ({
                imageUrl: m.imageUrl,
                title: m.title || "Untitled Memory",
                uploaderName: alumni.name,
                alumniId: alumni.id,
                status: "pending_moderation"
            }))
        });
        return NextResponse.json({
            success: true,
            message: `${newRecords.count} memories uploaded successfully and sent for moderation`,
        },
            { status: 201 });

    } catch (error: any) {
        console.error("Error in POST /api/alumni/memories:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const alumniTokenData = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
        if (!alumniTokenData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { memoryIds } = (await req.json()) as { memoryIds: string};
        if (!memoryIds || !Array.isArray(memoryIds) || memoryIds.length === 0) {
            return NextResponse.json({ success: false, message: "No memory IDs provided" }, { status: 400 });
        }
        const db = getDb();
        // Find alumni ID first
        const alumni = await db.alumni.findUnique({
            where: { enrollmentNumber: alumniTokenData.enrollmentNumber },
            select: {id: true}
        });
        if (!alumni) {
            return NextResponse.json({ success: false, message: "Alumni not found" }, { status: 404 });
        }

        // Fetch ALL memories to get their imageUrls (not just the first one)
        const memoriesToDelete = await db.memory.findMany({
            where: { id: { in: memoryIds }, alumniId: alumni.id },
            select: { imageUrl: true },
        });

        if (memoriesToDelete.length === 0) {
            return NextResponse.json({ success: false, message: "No matching memories found" }, { status: 404 });
        }

        // Batch-delete from R2
        const urls = memoriesToDelete.map((m) => m.imageUrl).filter(Boolean);
        if (urls.length > 0) {
            await deleteMultipleFromR2(urls);
        }

        // Delete memories that belong to the alumni and match the provided IDs
        const deleteResult = await db.memory.deleteMany({
            where: {
                id: { in: memoryIds },
                alumniId: alumni.id
            }
        });
        return NextResponse.json({
            success: true,
            message: `${deleteResult.count} memories deleted successfully`,
        });
    } catch (error: any) {
        console.error("Error in DELETE /api/alumni/memories:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
