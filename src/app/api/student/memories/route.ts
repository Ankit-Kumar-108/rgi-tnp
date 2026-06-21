export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {deleteFromR2} from "@/lib/r2-delete"
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, memory } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { memories } = (await req.json()) as { memories: { imageUrl: string; title: string }[] };
    
    if (!memories || !Array.isArray(memories) || memories.length === 0) {
      return NextResponse.json({ success: false, message: "No memories provided" }, { status: 400 });
    }

    const db = getDb();

    // Find student ID first
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true, name: true }
    });

    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Create Memory records in batch
    const newRecords = await db.insert(memory).values(
      memories.map(m => ({
        imageUrl: m.imageUrl,
        title: m.title || "Untitled Memory",
        uploaderName: studentData.name,
        studentId: studentData.id,
        status: "pending_moderation"
      }))
    ).returning();

    return NextResponse.json({ 
      success: true, 
      message: `${newRecords.length} memories uploaded successfully and sent for moderation`, 
    });

  } catch (error: any) {
    console.error("Batch Memory Upload Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Failed to upload memories" 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const {id} = (await req.json()) as { id: string };
    if (!id) {
      return NextResponse.json({ success: false, message: "Memory ID is required" }, { status: 400 });
    }

    const db = getDb();
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true }
    });

    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    const imgUrl = await db.query.memory.findFirst({
      where: and(
        eq(memory.id, id),
        eq(memory.studentId, studentData.id)
      ),
      columns: {imageUrl: true}
    });

    if(!imgUrl){
      return NextResponse.json({success: false, message: "Memory not found or you don't have permission to delete it"})
    }

    await deleteFromR2(imgUrl.imageUrl)

    const deletedMemoryResult = await db.delete(memory).where(
      and(
        eq(memory.id, id),
        eq(memory.studentId, studentData.id)
      )
    ).returning();

    if (deletedMemoryResult.length === 0) {
      return NextResponse.json({ success: false, message: "Memory not found or you don't have permission to delete it" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Memory deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting memories:", error); 
    return NextResponse.json({ success: false, message: "Failed to delete memories" }, { status: 500 });
  }
}