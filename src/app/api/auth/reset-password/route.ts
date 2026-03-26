export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
      const student = await db.student.findFirst({
        where: {
          emailVerificationToken: tokenHash,
          emailVerificationTokenExpiry: { gt: new Date() },
        },
      });

      if (!student) {
        return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      await db.student.update({
        where: { id: student.id },
        data: {
          passwordHash,
          emailVerificationToken: null,
          emailVerificationTokenExpiry: null,
        },
      });
    } else {
      return NextResponse.json({ success: false, message: "Password reset not supported for this role yet" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
