export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

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
    } = (await req.json()) as {
      profileImageUrl?: string;
      resumeUrl?: string;
      tenthPercentage?: string | number;
      twelfthPercentage?: string | number;
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
      semester === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "Missing update data" },
        { status: 400 },
      );
    }

    const db = getDb();
    const existingStudent = await db.externalStudent.findUnique({
      where: { id: studentTokenData.id },
      select: {
        name: true,
        profileImageUrl: true,
        resumeUrl: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        activeBacklog: true,
        linkedinUrl: true,
        githubUrl: true,
        semester: true,
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    const normalizedTenth =
      tenthPercentage !== undefined ? Number.parseFloat(String(tenthPercentage)) : undefined;
    const normalizedTwelfth =
      twelfthPercentage !== undefined
        ? Number.parseFloat(String(twelfthPercentage))
        : undefined;
    const normalizedBacklog =
      activeBacklog !== undefined ? Number.parseInt(String(activeBacklog), 10) : undefined;
    const normalizedSemester =
      semester !== undefined ? Number.parseInt(String(semester), 10) : undefined;
    const nextProfileImageUrl = profileImageUrl ?? existingStudent.profileImageUrl;
    const nextResumeUrl = resumeUrl ?? existingStudent.resumeUrl;
    const nextTenthPercentage =
      tenthPercentage !== undefined ? normalizedTenth : existingStudent.tenthPercentage;
    const nextTwelfthPercentage =
      twelfthPercentage !== undefined
        ? normalizedTwelfth
        : existingStudent.twelfthPercentage;
    const nextActiveBacklog =
      activeBacklog !== undefined ? normalizedBacklog : existingStudent.activeBacklog;
    const isProfileComplete =
      [nextProfileImageUrl, nextResumeUrl].every(hasValue) &&
      hasValue(nextTenthPercentage) &&
      hasValue(nextTwelfthPercentage) &&
      Number.isFinite(nextActiveBacklog) &&
      Number(nextActiveBacklog) >= 0;

    const updatedStudent = await db.externalStudent.update({
      where: { id: studentTokenData.id },
      data: {
        ...(profileImageUrl !== undefined && { profileImageUrl }),
        ...(resumeUrl !== undefined && { resumeUrl }),
        ...(tenthPercentage !== undefined && { tenthPercentage: normalizedTenth }),
        ...(twelfthPercentage !== undefined && {
          twelfthPercentage: normalizedTwelfth,
        }),
        ...(activeBacklog !== undefined && { activeBacklog: normalizedBacklog }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(semester !== undefined && { semester: normalizedSemester }),
        isProfileComplete,
      },
    });

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
