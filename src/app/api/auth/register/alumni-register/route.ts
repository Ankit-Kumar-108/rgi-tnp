export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { alumniRegistrationSchema } from "@/lib/validations/alumni";
import { hashPassword, generateVerificationToken, getresetTokenExpiry } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { verificationEmailTemplate } from "@/lib/email-templates";
import { NotificationService } from "@/lib/notification-service";

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
    // Fetch all master records for this batch and compare with trimmed values
    // This handles any existing data with extra whitespace
    const masterRecords = await db.alumniMaster.findMany({
      where: {
        batch: trimmedData.batch,
      },
    });

    const masterRecord = masterRecords.find(
      (record) =>
        record.enrollmentNumber?.trim() === trimmedData.enrollmentNumber &&
        record.branch?.trim() === trimmedData.branch &&
        record.course?.trim() === trimmedData.course
    );
   
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

    const emailResult = await NotificationService.sendEmailWithLog({
      to: trimmedData.personalEmail,
      subject: "Verify Your Email - RGI TnP Portal",
      html: verificationEmailTemplate(trimmedData.name, verificationLink),
      template: "verificationEmailTemplate",
      triggeredBy: "System",
      recipientType: "alumni",
      approvalId: alumni.id,
      approvalType: "alumni_registration",
      actionType: "verification",
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
      const firstError = error.issues?.[0];
      const errorMessage = firstError?.message || "Validation failed";

      return NextResponse.json(
        { success: false, message: errorMessage, errors: error.issues },
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
