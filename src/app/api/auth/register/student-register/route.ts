export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/student";
import { hashPassword, generateVerificationToken, getresetTokenExpiry } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { verificationEmailTemplate } from "@/lib/email-templates";
import { sendEmail } from "@/lib/send-email";


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
    };

    // 3. Workflow Check: Email Domain 
    if (!trimmedData.email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { success: false, message: "Use your @gmail.com email" },
        { status: 400 }
      );
    }
    // 4. Verify Enrollment Number in Master Records
    const masterRecord = await db.studentMaster.findFirst({
      where: {
        enrollmentNumber: trimmedData.enrollmentNumber,
        name: trimmedData.name,
        branch: trimmedData.branch,
        course: trimmedData.course,
        batch: trimmedData.batch,
      },
    });

    if (!masterRecord) {
      return NextResponse.json(
        { success: false, message: "Information not found in college records" },
        { status: 400 }
      );
    }

    // 5. Check if already registered
    const existing = await db.student.findUnique({
      where: { enrollmentNumber: trimmedData.enrollmentNumber },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Account already exists" },
        { status: 400 }
      );
    }

    // 6. Security & Verification Prep
    const passwordHash = await hashPassword(validatedData.password);
    const verificationToken = generateVerificationToken();
    const expiry = getresetTokenExpiry();

    // 7. Create Student Record
    const student = await db.student.create({
      data: {
        name: validatedData.name,
        enrollmentNumber: validatedData.enrollmentNumber,
        email: validatedData.email,
        branch: validatedData.branch,
        course: validatedData.course,
        semester: validatedData.semester,
        cgpa: validatedData.cgpa,
        batch: validatedData.batch,
        phoneNumber: validatedData.phoneNumber,
        passwordHash: passwordHash,
        profileImageUrl: validatedData.profileImageUrl || undefined,
        resumeUrl: (body.resumeUrl as string) || undefined,
        isVerified: false,
        isEmailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: expiry,
        tenthPercentage: 0,
        twelfthPercentage: 0,
      },
    });

    // 8. Send Verification Email
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}&email=${validatedData.email}&role=student`;

    const emailResult = await sendEmail({
      to: trimmedData.email,
      subject: "Verify Your Email - RGI TnP Portal",
      html: verificationEmailTemplate(trimmedData.name, verificationLink),
    });

    if (!emailResult.success) {
      console.error("[STUDENT-REGISTER] Email verification failed for:", trimmedData.email, emailResult.error);
      // Mark registration as failed due to email issue
      await db.student.update({
        where: { id: student.id },
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
      userId: student.id
    }, { status: 201 });

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
    return NextResponse.json({ success: false, message: "Internal Server error" }, { status: 500 });
  }
}