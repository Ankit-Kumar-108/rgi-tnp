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

    // 3. Workflow Check: Email Domain 
    if (!validatedData.email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { success: false, message: "Use your @gmail.com email" },
        { status: 400 }
      );
    }
    // 4. Verify Enrollment Number in Master Records
    const masterRecord = await db.studentMaster.findFirst({
      where: {
        enrollmentNumber: validatedData.enrollmentNumber,
        name: validatedData.name,
        branch: validatedData.branch,
        course: validatedData.course,
        batch: validatedData.batch,
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
      where: { enrollmentNumber: validatedData.enrollmentNumber },
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
      },
    });

    // 8. Send Verification Email
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}&email=${validatedData.email}&role=student`;

    await sendEmail({
      to: validatedData.email,
      subject: "Verify Your Email - RGI TnP Portal",
      html: verificationEmailTemplate(validatedData.name, verificationLink),
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      userId: student.id
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server error" }, { status: 500 });
  }
}