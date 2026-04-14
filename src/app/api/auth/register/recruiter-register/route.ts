export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { recruiterRegistrationSchema } from "@/lib/validations/recruiter";
import { hashPassword } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const validatedData = recruiterRegistrationSchema.parse(body);

    // Trim fields to remove extra spaces
    const trimmedData = {
      ...validatedData,
      email: validatedData.email.trim(),
      name: validatedData.name.trim().replace(/\s+/g, ' '),
      phoneNumber: validatedData.phoneNumber.trim(),
    };

    const emailExists = await db.recruiter.findUnique({
      where: { email: trimmedData.email },
    });

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(trimmedData.password);

    const recruiter = await db.recruiter.create({
      data: {
        name: trimmedData.name,
        email: trimmedData.email,
        phoneNumber: trimmedData.phoneNumber,
        designation: trimmedData.designation,
        company: trimmedData.company,
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
      // Extract the first error message for display
      const firstError = error.errors[0];
      const errorMessage = firstError?.message || "Validation failed";
      
      return NextResponse.json(
        { success: false, message: errorMessage, errors: error.errors },
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
