export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { externalStudentRegistrationSchema } from "@/lib/validations/external-student";
import { hashPassword, generateVerificationToken, getresetTokenExpiry } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { verificationEmailTemplate } from "@/lib/email-templates";
import { NotificationService } from "@/lib/notification-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const validatedData = externalStudentRegistrationSchema.parse(body);

    // Trim fields to remove extra spaces
    const trimmedData = {
      ...validatedData,
      name: validatedData.name.trim().replace(/\s+/g, ' '),
      collegeName: validatedData.collegeName.trim(),
      enrollmentNumber: validatedData.enrollmentNumber.trim(),
      email: validatedData.email.trim(),
      branch: validatedData.branch.trim(),
      course: validatedData.course.trim(),
      gender: validatedData.gender.trim(),
      batch: validatedData.batch.trim(),
      phoneNumber: validatedData.phoneNumber.trim(),
    };

    const emailExists = await db.externalStudent.findUnique({
      where: { email: trimmedData.email },
    });

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }


    const passwordHash = await hashPassword(trimmedData.password);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = getresetTokenExpiry();

    const externalStudent = await db.externalStudent.create({
      data: {
        name: trimmedData.name,
        collegeName: trimmedData.collegeName,
        enrollmentNumber: trimmedData.enrollmentNumber,
        email: trimmedData.email,
        gender: trimmedData.gender,
        branch: trimmedData.branch,
        course: trimmedData.course,
        batch: trimmedData.batch,
        semester: trimmedData.semester,
        cgpa: trimmedData.cgpa,
        resumeUrl: trimmedData.resumeUrl,
        phoneNumber: trimmedData.phoneNumber,
        passwordHash: passwordHash,
        profileImageUrl: trimmedData.profileImageUrl || "",
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: verificationTokenExpiry,
        tenthPercentage: 0,
        twelfthPercentage: 0,
      },
    });

    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}&email=${trimmedData.email}&role=external_student`;

    const emailResult = await NotificationService.sendEmailWithLog({
      to: trimmedData.email,
      subject: "Verify Your Email - RGI TnP Portal",
      html: verificationEmailTemplate(trimmedData.name, verificationLink),
      template: "verificationEmailTemplate",
      triggeredBy: "System",
      recipientType: "external_student",
      approvalId: externalStudent.id,
      approvalType: "external_student_registration",
      actionType: "verification",
    });

    if (!emailResult.success) {
      console.error("[EXTERNAL-STUDENT-REGISTER] Email verification failed for:", trimmedData.email, emailResult.error);
      await db.externalStudent.update({
        where: { id: externalStudent.id },
        data: {
          emailVerificationFailed: true,
          emailVerificationError: emailResult.error || "Unknown email service error"
        }
      });
      return NextResponse.json(
        {
          success: false,
          message: "Email verification failed. Please contact support.",
          error: emailResult.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
        userId: externalStudent.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      const firstError = error.issues?.[0];
      const errorMessage = firstError?.message || "Validation failed";
      
      return NextResponse.json(
        { success: false, message: errorMessage, errors: error.issues},
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
