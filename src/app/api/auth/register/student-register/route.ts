export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/student";
import { hashPassword, generateVerificationToken, getresetTokenExpiry } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { verificationEmailTemplate } from "@/lib/email-templates";
import { NotificationService } from "@/lib/notification-service";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;

    const db = getDb();

    const validatedData = registrationSchema.parse(body);

    // Trim fields to remove extra spaces
    const trimmedData = {
      ...validatedData,
      enrollmentNumber: validatedData.enrollmentNumber.trim(),
      name: validatedData.name.trim().replace(/\s+/g, ' '),
      branch: validatedData.branch.trim(),
      course: validatedData.course.trim(),
      batch: validatedData.batch.trim(),
      email: validatedData.email.trim(),
      collegeName: validatedData.collegeName.trim(),
      phoneNumber: validatedData.phoneNumber.trim(),
      profileImageUrl: validatedData.profileImageUrl?.trim(),
      resumeUrl: (body.resumeUrl as string)?.trim(),
      cgpa: validatedData.cgpa,
      semester: validatedData.semester,
      gender: validatedData.gender.trim(),
    };
    const masterRecords = await db.query.studentMaster.findMany({
      where: eq(schema.studentMaster.batch, trimmedData.batch),
    });
    const masterRecord = masterRecords.find(
      (record: any) =>
        record.enrollmentNumber?.trim() === trimmedData.enrollmentNumber &&
        record.branch?.trim() === trimmedData.branch &&
        record.course?.trim() === trimmedData.course
    );
     console.log(" master data: ", masterRecord)
    if (!masterRecord) {
      return NextResponse.json(
        { success: false, message: "Information not found in college records" },
        { status: 400 }
      );
    }

    // 5. Check if already registered
    const existing = await db.query.student.findFirst({
      where: eq(schema.student.enrollmentNumber, trimmedData.enrollmentNumber),
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Account already exists, Please Login" },
        { status: 400 }
      );
    }

    const emailExists = await db.query.student.findFirst({
      where: eq(schema.student.email, trimmedData.email),
    });

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already registered, Please Login" },
        { status: 400 }
       );
    }

    // 6. Security & Verification Prep
    const passwordHash = await hashPassword(trimmedData.password);
    const verificationToken = generateVerificationToken();
    const expiry = getresetTokenExpiry();

    // 7. Create Student Record
    const result = await db.insert(schema.student).values({
      name: trimmedData.name,
      enrollmentNumber: trimmedData.enrollmentNumber,
      email: trimmedData.email,
      collegeName: trimmedData.collegeName,
      gender: trimmedData.gender,
      branch: trimmedData.branch,
      course: trimmedData.course,
      semester: trimmedData.semester,
      cgpa: trimmedData.cgpa,
      batch: trimmedData.batch,
      phoneNumber: trimmedData.phoneNumber,
      passwordHash: passwordHash,
      profileImageUrl: trimmedData.profileImageUrl || undefined,
      resumeUrl: trimmedData.resumeUrl || undefined,
      isVerified: false,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: expiry,
      tenthPercentage: 0,
      twelfthPercentage: 0,
    }).returning();
    const student = result[0];

    // 8. Send Verification Email
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}&email=${validatedData.email}&role=student`;

    const emailResult = await NotificationService.sendEmailWithLog({
      to: trimmedData.email,
      subject: "Verify Your Email - RGI TnP Portal",
      html: verificationEmailTemplate(trimmedData.name, verificationLink),
      template: "verificationEmailTemplate",
      triggeredBy: "System",
      recipientType: "student",
      approvalId: student.id,
      approvalType: "student_registration",
      actionType: "verification",
    });

    if (!emailResult.success) {
      console.error("[STUDENT-REGISTER] Email verification failed for:", trimmedData.email, emailResult.error);
      await db.update(schema.student).set({
        emailVerificationFailed: true,
        emailVerificationError: emailResult.error || "Unknown email service error"
      }).where(eq(schema.student.id, student.id));
      return NextResponse.json({
        success: false,
        message: "Email verification failed. Please contact support.",
        error: emailResult.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      userId: student.id
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === "ZodError") {
      // Extract the first error message for display
      const firstError = error.issues?.[0];
      const errorMessage = firstError?.message || "Validation failed";
      
      return NextResponse.json(
        { success: false, message: errorMessage, errors: error.issues },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server error" }, { status: 500 });
  }
}