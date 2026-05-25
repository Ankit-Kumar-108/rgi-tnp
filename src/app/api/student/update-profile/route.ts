export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { deleteFromR2 } from "@/lib/r2-delete";

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

export async function PATCH(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, [
      "student",
    ]);

    if (!studentTokenData?.enrollmentNumber || studentTokenData.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      profileImageUrl,
      phoneNumber,
      resumeUrl,
      tenthPercentage,
      twelfthPercentage,
      activeBacklog,
      linkedinUrl,
      githubUrl,
      cgpa,
    } = (await req.json()) as {
      profileImageUrl?: string;
      phoneNumber?: string;
      resumeUrl?: string;
      tenthPercentage?: string | number;
      twelfthPercentage?: string | number;
      activeBacklog?: string | number;
      linkedinUrl?: string;
      githubUrl?: string;
      cgpa?: string | number
    };

    if (
      profileImageUrl === undefined &&
      phoneNumber === undefined &&
      resumeUrl === undefined &&
      tenthPercentage === undefined &&
      twelfthPercentage === undefined &&
      activeBacklog === undefined &&
      linkedinUrl === undefined &&
      githubUrl === undefined && 
      cgpa === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "Missing update data" },
        { status: 400 },
      );
    }

    const db = getDb();
    const existingStudent = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: {
        name: true,
        profileImageUrl: true,
        phoneNumber: true,
        resumeUrl: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        activeBacklog: true,
        linkedinUrl: true,
        githubUrl: true,
        cgpa: true,
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
    const normalizedCgpa =
      cgpa !== undefined ? Number.parseFloat(String(cgpa)) : undefined;
    const nextProfileImageUrl = profileImageUrl ?? existingStudent.profileImageUrl;
    const nextPhoneNumber = phoneNumber ?? existingStudent.phoneNumber;
    const nextResumeUrl = resumeUrl ?? existingStudent.resumeUrl;
    const nextTenthPercentage =
      tenthPercentage !== undefined ? normalizedTenth : existingStudent.tenthPercentage;
    const nextTwelfthPercentage =
      twelfthPercentage !== undefined
        ? normalizedTwelfth
        : existingStudent.twelfthPercentage;
    const nextActiveBacklog =
      activeBacklog !== undefined ? normalizedBacklog : existingStudent.activeBacklog;
    const nextCGPA = normalizedCgpa ?? existingStudent.cgpa;
    const isProfileComplete =
      [nextProfileImageUrl, nextPhoneNumber, nextResumeUrl, nextCGPA].every(hasValue) &&
      hasValue(nextTenthPercentage) &&
      hasValue(nextTwelfthPercentage) &&
      Number.isFinite(nextActiveBacklog) &&
      Number(nextActiveBacklog) >= 0;

    const updatedStudent = await db.student.update({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      data: {
        ...(profileImageUrl !== undefined && { profileImageUrl }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(resumeUrl !== undefined && { resumeUrl }),
        ...(tenthPercentage !== undefined && { tenthPercentage: normalizedTenth }),
        ...(twelfthPercentage !== undefined && {
          twelfthPercentage: normalizedTwelfth,
        }),
        ...(cgpa !== undefined && { cgpa: normalizedCgpa }),
        ...(activeBacklog !== undefined && { activeBacklog: normalizedBacklog }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        isProfileComplete,
      },
    });

    // Clean up old R2 files if replaced
    if (profileImageUrl && existingStudent.profileImageUrl &&
        profileImageUrl !== existingStudent.profileImageUrl) {
      deleteFromR2(existingStudent.profileImageUrl);
    }
    if (resumeUrl && existingStudent.resumeUrl &&
        resumeUrl !== existingStudent.resumeUrl) {
      deleteFromR2(existingStudent.resumeUrl);
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
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
