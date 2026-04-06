export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

async function getStudentFromToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const studentTokenData = await getStudentFromToken(req);
    if (!studentTokenData) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { memories } = (await req.json()) as { memories: { imageUrl: string; title: string }[] };
    
    if (!memories || !Array.isArray(memories) || memories.length === 0) {
      return NextResponse.json({ success: false, message: "No memories provided" }, { status: 400 });
    }

    const db = getDb();

    // Find student ID first
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true, name: true }
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Create Memory records in batch
    const newRecords = await db.memory.createMany({
      data: memories.map(m => ({
        imageUrl: m.imageUrl,
        title: m.title || "Untitled Memory",
        uploaderName: student.name,
        studentId: student.id,
        status: "pending_moderation"
      }))
    });

    return NextResponse.json({ 
      success: true, 
      message: `${newRecords.count} memories uploaded successfully and sent for moderation`, 
    });

  } catch (error: any) {
    console.error("Batch Memory Upload Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Failed to upload memories" 
    }, { status: 500 });
  }
}
