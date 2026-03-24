import { NextRequest, NextResponse } from "next/server";
import { recruiterRegistrationSchema } from "@/lib/validations/recruiter";
import { hashPassword } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const validatedData = recruiterRegistrationSchema.parse(body);

    const emailExists = await db.recruiter.findUnique({
      where: { email: validatedData.email },
    });

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(validatedData.password);

    const recruiter = await db.recruiter.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        designation: validatedData.designation,
        company: validatedData.company,
        passwordHash: passwordHash,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. You can now login.",
        userId: recruiter.id,
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
