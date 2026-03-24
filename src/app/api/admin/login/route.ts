
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

// Hardcoded admin credentials change later
const ADMIN_EMAIL = "admin@rgi.ac.in";
const ADMIN_PASSWORD = "Admin@123";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new jose.SignJWT({
      email: ADMIN_EMAIL,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    return NextResponse.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: "admin",
        name: "Admin",
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
