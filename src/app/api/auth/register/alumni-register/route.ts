export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { alumniRegistrationSchema } from "@/lib/validations/alumni";
import { hashPassword, generateVerificationToken, getresetTokenExpiry } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { verificationEmailTemplate } from "@/lib/email-templates";

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
    const verificationToken = generateVerificationToken();
    const expiry = getresetTokenExpiry();

    // Create Alumni Record
    const alumni = await db.alumni.create({
      data: {
        name: validatedData.name,
        enrollmentNumber: validatedData.enrollmentNumber,
        personalEmail: validatedData.personalEmail,
        course: validatedData.course,
        batch: validatedData.batch,
        passwordHash: passwordHash,
        profileImageUrl: validatedData.profileImageUrl || "",
        isVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: expiry,
      },
    });

    // Send Verification Email
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}&email=${validatedData.personalEmail}&role=alumni`;

    await sendEmail({
      to: validatedData.personalEmail,
      subject: "Verify Your Email - RGI TnP Portal",
      html: verificationEmailTemplate(validatedData.name, verificationLink),
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      userId: alumni.id
    }, { status: 201 });
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
