import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/student";
import { hashPassword, generateOTP, getOTPExpiry } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import nodemailer from "nodemailer";
import { otpEmailTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    // 6. Security & OTP Prep
    const passwordHash = await hashPassword(validatedData.password);
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
    // 7. Create Student Record with OTP
    const student = await db.student.create({
      data: {
        name: validatedData.name,
        enrollmentNumber: validatedData.enrollmentNumber,
        email: validatedData.email,
        branch: validatedData.branch,
        semester: validatedData.semester,
        cgpa: validatedData.cgpa,
        phoneNumber: validatedData.phoneNumber,
        passwordHash: passwordHash,
        isVerified: false,
        emailVerificationToken: otp,
        emailVerificationTokenExpiry: otpExpiry.toISOString(),
      },
    });

    // 8. Nodemailer Transport (SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RGI T&P" <${process.env.SMTP_USER}>`,
      to: validatedData.email,
      subject: "Your Verification OTP",
      html: otpEmailTemplate(otp, validatedData.name),
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
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