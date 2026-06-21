export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, and, gt } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { hashPassword } from "@/lib/auth-utils";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hash);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { token: string; password: string; role: string };
    const { token, password, role } = body;

    if (!token || !password || !role) {
      return NextResponse.json({ success: false, message: "Token, password and role are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });
    }

    const db = getDb();
    const tokenHash = await sha256(token);

    if (role === "student") {
      const student = await db.query.student.findFirst({
        where: and(
          eq(schema.student.resetPasswordToken, tokenHash),
          gt(schema.student.resetPasswordTokenExpiry, new Date())
        ),
      });

      if (!student) {
        return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 });
      }

      const passwordHashVal = await hashPassword(password);
      await db.update(schema.student).set({
        passwordHash: passwordHashVal,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      }).where(eq(schema.student.id, student.id));
    } else if (role === "external_student") {
      const externalStudent = await db.query.externalStudent.findFirst({
        where: and(
          eq(schema.externalStudent.resetPasswordToken, tokenHash),
          gt(schema.externalStudent.resetPasswordTokenExpiry, new Date())
        ),
      });

      if (!externalStudent) {
        return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 });
      }

      const passwordHashVal = await hashPassword(password);
      await db.update(schema.externalStudent).set({
        passwordHash: passwordHashVal,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      }).where(eq(schema.externalStudent.id, externalStudent.id));
    } else if (role === "alumni") {
      const alumni = await db.query.alumni.findFirst({
        where: and(
          eq(schema.alumni.resetPasswordToken, tokenHash),
          gt(schema.alumni.resetPasswordTokenExpiry, new Date())
        ),
      });

      if (!alumni) {
        return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 });
      }

      const passwordHashVal = await hashPassword(password);
      await db.update(schema.alumni).set({
        passwordHash: passwordHashVal,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      }).where(eq(schema.alumni.id, alumni.id));
    } else if (role === "recruiter") {
      const recruiter = await db.query.recruiter.findFirst({
        where: and(
          eq(schema.recruiter.resetPasswordToken, tokenHash),
          gt(schema.recruiter.resetPasswordTokenExpiry, new Date())
        ),
      });

      if (!recruiter) {
        return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 });
      }

      const passwordHashVal = await hashPassword(password);
      await db.update(schema.recruiter).set({
        passwordHash: passwordHashVal,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      }).where(eq(schema.recruiter.id, recruiter.id));
    } else {
      return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
