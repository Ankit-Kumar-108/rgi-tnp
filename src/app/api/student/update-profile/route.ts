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

export async function PATCH(req: NextRequest) {
  try {
    const studentTokenData = await getStudentFromToken(req);
    if (!studentTokenData) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { profileImageUrl, phoneNumber, branch, course, resumeUrl } = (await req.json()) as any;
    const db = getDb();

    // Update the student record
    // We use findUnique with the enrollmentNumber from token to be safe
    const updatedStudent = await db.student.update({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      data: {
        ...(profileImageUrl && { profileImageUrl }),
        ...(phoneNumber && { phoneNumber }),
        ...(branch && { branch }),
        ...(course && { course }),
        ...(resumeUrl && { resumeUrl })
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully", 
      student: {
        name: updatedStudent.name,
        profileImageUrl: updatedStudent.profileImageUrl
      }
    });

  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Failed to update profile" 
    }, { status: 500 });
  }
}
