export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import { attachAuthCookie, signAuthToken } from "@/lib/auth-jwt";

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

    const normalizedEmail = email.trim().toLowerCase();
    const db = getDb();

    let admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    });

    let passwordMatch = false;

    if (admin) {
      passwordMatch = await verifyPassword(password, admin.passwordHash);
    } else {
      const bootstrapEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const bootstrapPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

      if (
        bootstrapEmail &&
        bootstrapPasswordHash &&
        normalizedEmail === bootstrapEmail
      ) {
        passwordMatch = await verifyPassword(password, bootstrapPasswordHash);

        if (passwordMatch) {
          admin = await db.admin.upsert({
            where: { email: bootstrapEmail },
            update: {
              passwordHash: bootstrapPasswordHash,
              role: "admin",
            },
            create: {
              email: bootstrapEmail,
              passwordHash: bootstrapPasswordHash,
              role: "admin",
            },
            select: {
              id: true,
              email: true,
              passwordHash: true,
              role: true,
            },
          });
        }
      }
    }

    if (!admin || !passwordMatch || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const token = await signAuthToken({
      id: admin.id,
      email: admin.email,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: "admin",
        name: "Admin",
      },
    }, { status: 200 });

    attachAuthCookie(response, "admin", token);

    return response;

  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
