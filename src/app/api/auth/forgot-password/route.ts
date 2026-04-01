export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { passwordResetEmailTemplate } from "@/lib/email-templates";
import { generateResetToken, getresetTokenExpiry } from "@/lib/auth-utils";

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
    const body = (await req.json()) as { email: string; role: string };
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ success: false, message: "Email and role are required" }, { status: 400 });
    }

    const db = getDb();
    const resetToken = generateResetToken();
    const resetTokenHash = await sha256(resetToken);
    const expiry = getresetTokenExpiry();

    let userName = "User";

    if (role === "student") {
      const student = await db.student.findUnique({ where: { email } });
      if (!student) {
        return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
      }
      userName = student.name;
      await db.student.update({
        where: { email },
        data: {
          resetPasswordToken: resetTokenHash,
          resetPasswordTokenExpiry: expiry,
        },
      });
    } else if (role === "external_student") {
      const externalStudent = await db.externalStudent.findUnique({ where: { email } });
      if (!externalStudent) {
        return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
      }
      userName = externalStudent.name;
      await db.externalStudent.update({
        where: { email },
        data: {
          resetPasswordToken: resetTokenHash,
          resetPasswordTokenExpiry: expiry,
        },
      });
    } else if (role === "alumni") {
      const alumni = await db.alumni.findUnique({ where: { personalEmail: email } });
      if (!alumni) {
        return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
      }
      userName = alumni.name;
      await db.alumni.update({
        where: { personalEmail: email },
        data: {
          resetPasswordToken: resetTokenHash,
          resetPasswordTokenExpiry: expiry,
        },
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid role specified." }, { status: 400 });
    }

    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const resetUrl = `${protocol}://${host}/reset-password?token=${resetToken}&role=${role}`;

    await sendEmail({
      to: email,
      subject: "Password Reset — RGI T&P Portal",
      html: passwordResetEmailTemplate(userName, resetUrl),
    });

    return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
