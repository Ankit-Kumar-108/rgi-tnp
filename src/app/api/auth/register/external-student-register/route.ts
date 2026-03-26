export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { externalStudentRegistrationSchema } from "@/lib/validations/external-student";
import { hashPassword } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const validatedData = externalStudentRegistrationSchema.parse(body);

    const emailExists = await db.externalStudent.findUnique({
      where: { email: validatedData.email },
    });

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(validatedData.password);

    const externalStudent = await db.externalStudent.create({
      data: {
        name: validatedData.name,
        collegeName: validatedData.collegeName,
        enrollmentNumber: validatedData.enrollmentNumber,
        email: validatedData.email,
        branch: validatedData.branch,
        course: validatedData.course,
        batch: validatedData.batch,
        cgpa: validatedData.cgpa,
        resumeUrl: validatedData.resumeUrl,
        phoneNumber: validatedData.phoneNumber,
        passwordHash: passwordHash,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Pending screening by admin.",
        userId: externalStudent.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server error" },
      { status: 500 }
    );
  }
}
