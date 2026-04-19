export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

async function getExternalStudentFromToken(req: NextRequest) {
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
    const studentTokenData = await getExternalStudentFromToken(req);
    if (!studentTokenData) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { profileImageUrl, resumeUrl, tenthPercentage, twelfthPercentage,
      activeBacklog, linkedinUrl, githubUrl, semester
    } = (await req.json()) as any;

    if (!profileImageUrl && !resumeUrl && tenthPercentage === undefined && 
        twelfthPercentage === undefined && activeBacklog === undefined &&
        linkedinUrl === undefined && githubUrl === undefined && semester === undefined) {
      return NextResponse.json({ success: false, message: "Missing update data" }, { status: 400 });
    }

    const db = getDb();

    const updatedStudent = await db.externalStudent.update({
      where: { id: studentTokenData.id },
      data: { 
        ...(profileImageUrl && { profileImageUrl }),
        ...(resumeUrl && { resumeUrl }),
        ...(tenthPercentage !== undefined && { tenthPercentage: parseFloat(tenthPercentage) }),
        ...(twelfthPercentage !== undefined && { twelfthPercentage: parseFloat(twelfthPercentage) }),
        ...(activeBacklog !== undefined && { activeBacklog: parseInt(activeBacklog) }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(semester !== undefined && { semester: parseInt(semester) }),
        ...(studentTokenData.isProfileComplete ? {} : { isProfileComplete: true }) // Mark profile complete if not already
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Profile image updated successfully", 
      student: {
        name: updatedStudent.name,
        profileImageUrl: updatedStudent.profileImageUrl
      }
    });

  } catch (error: any) {
    console.error("External Update Profile Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Failed to update profile" 
    }, { status: 500 });
  }
}
