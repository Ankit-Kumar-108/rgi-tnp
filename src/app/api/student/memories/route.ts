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

    const { imageUrl } = (await req.json()) as any;
    if (!imageUrl) {
      return NextResponse.json({ success: false, message: "Missing image URL" }, { status: 400 });
    }

    const db = getDb();

    // Find student ID first
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true }
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Create Memory record
    const memory = await db.memory.create({
      data: {
        imageUrl,
        studentId: student.id,
        status: "pending_moderation"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Memory uploaded successfully and sent for moderation", 
      memory 
    });

  } catch (error: any) {
    console.error("Memory Upload Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Failed to upload memory" 
    }, { status: 500 });
  }
}
