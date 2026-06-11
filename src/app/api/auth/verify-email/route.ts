export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isTokenExpired } from "@/lib/auth-utils";
import { NotificationService } from "@/lib/notification-service";
import { verificationSuccessStudentTemplate, verificationSuccessExternalStudentTemplate, verificationSuccessAlumniTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { token: string; email: string; role?: string };
    const { token, email, role } = body;

    if (!token || !email) {
      return NextResponse.json({ success: false, message: "Missing token or email" }, { status: 400 });
    }

    const db = getDb();

    // Helper to verify and update — returns `newlyVerified` flag to prevent duplicate welcome emails
    const verifyUser = async (user: any, model: any, targetEmailField: string, flagField: string, isStudent: boolean = false) => {
      if (user[flagField]) {
        return { success: true, newlyVerified: false, message: "Email already verified" };
      }

      if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
        return { success: false, newlyVerified: false, message: "Invalid verification token" };
      }

      if (user.emailVerificationTokenExpiry && isTokenExpired(user.emailVerificationTokenExpiry)) {
        return { success: false, newlyVerified: false, message: "Verification token expired" };
      }

      const updateData: any = {
        [flagField]: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      };
      
      if (isStudent) {
        updateData.isVerified = true;
      }

      await model.update({
        where: { [targetEmailField]: email },
        data: updateData,
      });

      return { success: true, newlyVerified: true, message: "Email verified successfully! You can now log in.", userName: user.name };
    };

    const sendWelcomeEmail = async (toEmail: string, verificationSuccessTemplate: string) => {
      try {
        await NotificationService.sendEmailWithLog({
          to: toEmail,
          subject: "Welcome to RGI Training and Placement Portal!",
          html: verificationSuccessTemplate,
          template: "welcome_email",
          triggeredBy: "System",
          actionType: "welcome",
        });
      } catch (e) {
        console.warn("[EMAIL] Welcome email failed (non-critical):", e);
      }
    };

    // 1. Try if role is provided
    if (role === "student") {
      const u = await db.student.findUnique({ where: { email } });
      if (u) {
        const res = await verifyUser(u, db.student, "email", "isEmailVerified", true);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessStudentTemplate( res.userName || u.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    } else if (role === "external_student") {
      const u = await db.externalStudent.findUnique({ where: { email } });
      if (u) {
        const res = await verifyUser(u, db.externalStudent, "email", "isVerified");
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessExternalStudentTemplate(res.userName || u.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    } else if (role === "alumni") {
      const u = await db.alumni.findUnique({ where: { personalEmail: email } });
      if (u) {
        const res = await verifyUser(u, db.alumni, "personalEmail", "isVerified");
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessAlumniTemplate(res.userName || u.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    }

    // 2. Fallback: Search all in PARALLEL if role is missing or user not found with role
    if (!role) {
      // Use Promise.all for parallel queries instead of sequential
      const [student, external, alumni] = await Promise.all([
        db.student.findUnique({ where: { email } }),
        db.externalStudent.findUnique({ where: { email } }),
        db.alumni.findUnique({ where: { personalEmail: email } }),
      ]);

      if (student) {
        const res = await verifyUser(student, db.student, "email", "isEmailVerified", true);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessStudentTemplate(res.userName || student.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      if (external) {
        const res = await verifyUser(external, db.externalStudent, "email", "isVerified");
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessExternalStudentTemplate(res.userName || external.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      if (alumni) {
        const res = await verifyUser(alumni, db.alumni, "personalEmail", "isVerified");
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessAlumniTemplate(res.userName || alumni.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    }

    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  } catch (error) {
    console.error("Email Verification Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
