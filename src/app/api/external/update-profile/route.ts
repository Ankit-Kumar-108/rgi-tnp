export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { deleteFromR2 } from "@/lib/r2-delete";
import { externalStudent } from "@/lib/schema";
import { eq } from "drizzle-orm";

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

export async function PATCH(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, [
      "external_student",
    ]);

    if (!studentTokenData?.id || studentTokenData.role !== "external_student") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      profileImageUrl,
      resumeUrl,
      tenthPercentage,
      twelfthPercentage,
      activeBacklog,
      linkedinUrl,
      githubUrl,
      semester,
      cgpa,
    } = (await req.json()) as {
      profileImageUrl?: string;
      resumeUrl?: string;
      tenthPercentage?: string | number;
      twelfthPercentage?: string | number;
      cgpa?: string | number
      activeBacklog?: string | number;
      linkedinUrl?: string;
      githubUrl?: string;
      semester?: string | number;
    };

    if (
      profileImageUrl === undefined &&
      resumeUrl === undefined &&
      tenthPercentage === undefined &&
      twelfthPercentage === undefined &&
      activeBacklog === undefined &&
      linkedinUrl === undefined &&
      githubUrl === undefined &&
      semester === undefined &&
      cgpa === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "Missing update data" },
        { status: 400 },
      );
    }

    const db = getDb();
    const existingStudent = await db.query.externalStudent.findFirst({
      where: eq(externalStudent.id, studentTokenData.id),
      columns: {
        name: true,
        profileImageUrl: true,
        resumeUrl: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        activeBacklog: true,
        linkedinUrl: true,
        githubUrl: true,
        semester: true,
        cgpa: true,
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    const parseFloatSafe = (val: any) => {
      if (val === undefined || val === null || val === "") return undefined;
      const parsed = Number.parseFloat(String(val));
      return Number.isNaN(parsed) ? undefined : parsed;
    };
    const parseIntSafe = (val: any) => {
      if (val === undefined || val === null || val === "") return undefined;
      const parsed = Number.parseInt(String(val), 10);
      return Number.isNaN(parsed) ? undefined : parsed;
    };

    const normalizedTenth = parseFloatSafe(tenthPercentage);
    const normalizedTwelfth = parseFloatSafe(twelfthPercentage);
    const normalizedCGPA = parseFloatSafe(cgpa);
    const normalizedBacklog = parseIntSafe(activeBacklog);
    const normalizedSemester = parseIntSafe(semester);

    const nextProfileImageUrl = profileImageUrl ?? existingStudent.profileImageUrl;
    const nextResumeUrl = resumeUrl ?? existingStudent.resumeUrl;
    const nextTenthPercentage = normalizedTenth !== undefined ? normalizedTenth : existingStudent.tenthPercentage;
    const nextTwelfthPercentage = normalizedTwelfth !== undefined ? normalizedTwelfth : existingStudent.twelfthPercentage;
    const nextCGPA = normalizedCGPA !== undefined ? normalizedCGPA : existingStudent.cgpa;
    const nextActiveBacklog = normalizedBacklog !== undefined ? normalizedBacklog : existingStudent.activeBacklog;

    const isProfileComplete =
      [nextProfileImageUrl, nextResumeUrl, nextCGPA].every((v) => hasValue(v) && !Number.isNaN(v)) &&
      hasValue(nextTenthPercentage) && !Number.isNaN(nextTenthPercentage) &&
      hasValue(nextTwelfthPercentage) && !Number.isNaN(nextTwelfthPercentage) &&
      Number.isFinite(nextActiveBacklog) &&
      Number(nextActiveBacklog) >= 0;

    const updatedStudentResult = await db.update(externalStudent).set({
      ...(profileImageUrl !== undefined && { profileImageUrl }),
      ...(resumeUrl !== undefined && { resumeUrl }),
      ...(normalizedTenth !== undefined && { tenthPercentage: normalizedTenth }),
      ...(normalizedTwelfth !== undefined && { twelfthPercentage: normalizedTwelfth }),
      ...(normalizedCGPA !== undefined && { cgpa: normalizedCGPA }),
      ...(normalizedBacklog !== undefined && { activeBacklog: normalizedBacklog }),
      ...(linkedinUrl !== undefined && { linkedinUrl }),
      ...(githubUrl !== undefined && { githubUrl }),
      ...(normalizedSemester !== undefined && { semester: normalizedSemester }),
      isProfileComplete,
      updatedAt: new Date().toISOString(),
    }).where(eq(externalStudent.id, studentTokenData.id)).returning();
    const updatedStudent = updatedStudentResult[0];

    // Clean up old R2 files if replaced
    if (profileImageUrl && existingStudent.profileImageUrl &&
        profileImageUrl !== existingStudent.profileImageUrl) {
      await deleteFromR2(existingStudent.profileImageUrl);
    }
    if (resumeUrl && existingStudent.resumeUrl &&
        resumeUrl !== existingStudent.resumeUrl) {
      await deleteFromR2(existingStudent.resumeUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      student: {
        name: updatedStudent.name,
        profileImageUrl: updatedStudent.profileImageUrl,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    console.error("External Update Profile Error:", error);
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
