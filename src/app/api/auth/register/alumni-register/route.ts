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

    // Trim fields to remove extra spaces
    const trimmedData = {
      ...validatedData,
      enrollmentNumber: validatedData.enrollmentNumber.trim(),
      name: validatedData.name.trim().replace(/\s+/g, ' '),
      personalEmail: validatedData.personalEmail.trim(),
    };

    // Verify Enrollment Number in Master Records
    // Using select to fetch only ID (more efficient)
    const masterRecord = await db.alumniMaster.findFirst({
      where: {
        enrollmentNumber: trimmedData.enrollmentNumber,
        branch: trimmedData.branch, 
        batch: trimmedData.batch,
        course: trimmedData.course,
      },
      select: { id: true }, // Only fetch ID
    });

    if (!masterRecord) {
      return NextResponse.json(
        { success: false, message: "Information not found in college alumni records" },
        { status: 400 }
      );
    }

    // Check if already registered
    const existing = await db.alumni.findUnique({
      where: { enrollmentNumber: trimmedData.enrollmentNumber },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Account already exists" },
        { status: 400 }
      );
    }

    const emailExists = await db.alumni.findUnique({
      where: { personalEmail: trimmedData.personalEmail },
    });

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already registered, Please Login" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(trimmedData.password);
    const verificationToken = generateVerificationToken();
    const expiry = getresetTokenExpiry();

    // Create Alumni Record
    const alumni = await db.alumni.create({
      data: {
        name: trimmedData.name,
        enrollmentNumber: trimmedData.enrollmentNumber,
        personalEmail: trimmedData.personalEmail,
        branch: trimmedData.branch,
        course: trimmedData.course,
        batch: trimmedData.batch,
        passwordHash: passwordHash,
        profileImageUrl: trimmedData.profileImageUrl || "",
        isVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: expiry,
      },
    });

    // Send Verification Email
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}&email=${trimmedData.personalEmail}&role=alumni`;

    const emailResult = await sendEmail({
      to: trimmedData.personalEmail,
      subject: "Verify Your Email - RGI TnP Portal",
      html: verificationEmailTemplate(trimmedData.name, verificationLink),
    });

    if (!emailResult.success) {
      console.error("[ALUMNI-REGISTER] Email verification failed for:", trimmedData.personalEmail, emailResult.error);
      await db.alumni.update({
        where: { id: alumni.id },
        data: {
          emailVerificationFailed: true,
          emailVerificationError: emailResult.error || "Unknown email service error"
        }
      });
      return NextResponse.json({
        success: false,
        message: "Email verification failed. Please contact support.",
        error: emailResult.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      userId: alumni.id
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
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
