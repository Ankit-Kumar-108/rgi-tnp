export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/schema";
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

    // Helper to verify token validity on a user record
    const checkToken = (user: any, flagField: string) => {
      if (user[flagField]) {
        return { success: true, newlyVerified: false, message: "Email already verified" };
      }
      if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
        return { success: false, newlyVerified: false, message: "Invalid verification token" };
      }
      if (user.emailVerificationTokenExpiry && isTokenExpired(user.emailVerificationTokenExpiry)) {
        return { success: false, newlyVerified: false, message: "Verification token expired" };
      }
      return null; // Token is valid, proceed with update
    };

    // Verify Student
    const verifyStudent = async (u: any) => {
      const check = checkToken(u, "isEmailVerified");
      if (check) return check;
      await db.update(schema.student).set({
        isEmailVerified: true,
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      }).where(eq(schema.student.email, email));
      return { success: true, newlyVerified: true, message: "Email verified successfully! You can now log in.", userName: u.name };
    };

    // Verify External Student
    const verifyExternal = async (u: any) => {
      const check = checkToken(u, "isVerified");
      if (check) return check;
      await db.update(schema.externalStudent).set({
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      }).where(eq(schema.externalStudent.email, email));
      return { success: true, newlyVerified: true, message: "Email verified successfully! You can now log in.", userName: u.name };
    };

    // Verify Alumni
    const verifyAlumni = async (u: any) => {
      const check = checkToken(u, "isVerified");
      if (check) return check;
      await db.update(schema.alumni).set({
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      }).where(eq(schema.alumni.personalEmail, email));
      return { success: true, newlyVerified: true, message: "Email verified successfully! You can now log in.", userName: u.name };
    };

    // 1. Try if role is provided
    if (role === "student") {
      const u = await db.query.student.findFirst({ where: eq(schema.student.email, email) });
      if (u) {
        const res = await verifyStudent(u);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessStudentTemplate(u.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    } else if (role === "external_student") {
      const u = await db.query.externalStudent.findFirst({ where: eq(schema.externalStudent.email, email) });
      if (u) {
        const res = await verifyExternal(u);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessExternalStudentTemplate(u.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    } else if (role === "alumni") {
      const u = await db.query.alumni.findFirst({ where: eq(schema.alumni.personalEmail, email) });
      if (u) {
        const res = await verifyAlumni(u);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessAlumniTemplate(u.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    }

    // 2. Fallback: Search all in PARALLEL if role is missing or user not found with role
    if (!role) {
      const [studentUser, externalUser, alumniUser] = await Promise.all([
        db.query.student.findFirst({ where: eq(schema.student.email, email) }),
        db.query.externalStudent.findFirst({ where: eq(schema.externalStudent.email, email) }),
        db.query.alumni.findFirst({ where: eq(schema.alumni.personalEmail, email) }),
      ]);

      if (studentUser) {
        const res = await verifyStudent(studentUser);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessStudentTemplate(studentUser.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      if (externalUser) {
        const res = await verifyExternal(externalUser);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessExternalStudentTemplate(externalUser.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      if (alumniUser) {
        const res = await verifyAlumni(alumniUser);
        if (res.newlyVerified) await sendWelcomeEmail(email, verificationSuccessAlumniTemplate(alumniUser.name));
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }
    }

    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  } catch (error) {
    console.error("Email Verification Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
