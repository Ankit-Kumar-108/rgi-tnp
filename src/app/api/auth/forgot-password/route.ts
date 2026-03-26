export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
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

    if (role === "student") {
      const student = await db.student.findUnique({ where: { email } });
      if (!student) {
        return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
      }
      await db.student.update({
        where: { email },
        data: {
          emailVerificationToken: resetTokenHash,
          emailVerificationTokenExpiry: expiry,
        },
      });
    } else {
      return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&role=${role}`;

    await sendEmail({
      to: email,
      subject: "Password Reset — RGI T&P Portal",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #9213ec;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below within 30 minutes:</p>
          <a href="${resetUrl}" style="display:inline-block;background:#9213ec;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
            Reset Password
          </a>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
