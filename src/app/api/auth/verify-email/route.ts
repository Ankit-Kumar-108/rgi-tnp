export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isTokenExpired } from "@/lib/auth-utils";
import { sendEmail } from "@/lib/send-email";
import { verificationSuccessTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { token: string; email: string; role?: string };
    const { token, email, role } = body;

    if (!token || !email) {
      return NextResponse.json({ success: false, message: "Missing token or email" }, { status: 400 });
    }

    const db = getDb();

    // Helper to verify and update
    const verifyUser = async (user: any, model: any, targetEmailField: string, flagField: string) => {
      if (user[flagField]) {
        return { success: true, message: "Email already verified" };
      }

      if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
        return { success: false, message: "Invalid verification token" };
      }

      if (user.emailVerificationTokenExpiry && isTokenExpired(user.emailVerificationTokenExpiry)) {
        return { success: false, message: "Verification token expired" };
      }

      const updateData: any = {
        [flagField]: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      };
      
      // Special case for Student: set both isEmailVerified and isVerified
      if (model === db.student) {
        updateData.isVerified = true;
      }

      await model.update({
        where: { [targetEmailField]: email },
        data: updateData,
      });

      return { success: true, message: "Email verified successfully! You can now log in.", userName: user.name };
    };

    const sendWelcomeEmail = async (toEmail: string, name: string) => {
      try {
        await sendEmail({
          to: toEmail,
          subject: "Welcome to RGI TnP Portal!",
          html: verificationSuccessTemplate(name),
        });
      } catch (e) {
        console.warn("[EMAIL] Welcome email failed (non-critical):", e);
      }
    };

    // 1. Try if role is provided
    if (role === "student") {
      const u = await db.student.findUnique({ where: { email } });
      if (u) {
        const res = await verifyUser(u, db.student, "email", "isEmailVerified");
        if (res.success) await sendWelcomeEmail(email, res.userName || u.name);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    } else if (role === "external_student") {
      const u = await db.externalStudent.findUnique({ where: { email } });
      if (u) {
        const res = await verifyUser(u, db.externalStudent, "email", "isVerified");
        if (res.success) await sendWelcomeEmail(email, res.userName || u.name);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    } else if (role === "alumni") {
      const u = await db.alumni.findUnique({ where: { personalEmail: email } });
      if (u) {
        const res = await verifyUser(u, db.alumni, "personalEmail", "isVerified");
        if (res.success) await sendWelcomeEmail(email, res.userName || u.name);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    }

    // 2. Fallback: Search all if role is missing or user not found with role
    const student = await db.student.findUnique({ where: { email } });
    if (student) {
      const res = await verifyUser(student, db.student, "email", "isEmailVerified");
      if (res.success) await sendWelcomeEmail(email, res.userName || student.name);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
    }

    const external = await db.externalStudent.findUnique({ where: { email } });
    if (external) {
      const res = await verifyUser(external, db.externalStudent, "email", "isVerified");
      if (res.success) await sendWelcomeEmail(email, res.userName || external.name);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
    }

    const alumni = await db.alumni.findUnique({ where: { personalEmail: email } });
    if (alumni) {
      const res = await verifyUser(alumni, db.alumni, "personalEmail", "isVerified");
      if (res.success) await sendWelcomeEmail(email, res.userName || alumni.name);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
    }

    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  } catch (error) {
    console.error("Email Verification Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
