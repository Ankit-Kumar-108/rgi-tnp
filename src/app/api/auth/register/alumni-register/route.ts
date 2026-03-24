import { NextRequest, NextResponse } from "next/server";
import { alumniRegistrationSchema } from "@/lib/validations/alumni";
import { hashPassword } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const validatedData = alumniRegistrationSchema.parse(body);

    // Verify Enrollment Number in Master Records
    const masterRecord = await db.alumniMaster.findFirst({
      where: {
        enrollmentNumber: validatedData.enrollmentNumber,
        name: validatedData.name,
      },
    });

    if (!masterRecord) {
      return NextResponse.json(
        { success: false, message: "Information not found in college alumni records" },
        { status: 400 }
      );
    }

    // Check if already registered
    const existing = await db.alumni.findUnique({
      where: { enrollmentNumber: validatedData.enrollmentNumber },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Account already exists" },
        { status: 400 }
      );
    }

    const emailExists = await db.alumni.findUnique({
      where: { personalEmail: validatedData.personalEmail },
    });

    if (emailExists) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 400 }
        );
      }

    const passwordHash = await hashPassword(validatedData.password);

    // Create Alumni Record
    const alumni = await db.alumni.create({
      data: {
        name: validatedData.name,
        enrollmentNumber: validatedData.enrollmentNumber,
        personalEmail: validatedData.personalEmail,
        passwordHash: passwordHash,
        isVerified: false, // Maybe manual admin verification is required
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        userId: alumni.id,
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
