import { NextRequest, NextResponse } from "next/server";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

const ADMIN_BYPASS_PATHS = new Set([
  "/api/admin/login",
  "/api/admin/logout",
]);

export async function middleware(req: NextRequest) {
  if (ADMIN_BYPASS_PATHS.has(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const payload = await getVerifiedAuthPayloadFromRequest(req, ["admin"]);

  if (!payload?.email || payload.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admin-email", payload.email);

  if (payload.id) {
    requestHeaders.set("x-admin-id", payload.id);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
