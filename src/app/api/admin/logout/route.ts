export const runtime = "edge";

import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-jwt";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin logout successful",
  });

  clearAuthCookie(response, "admin");

  return response;
}
