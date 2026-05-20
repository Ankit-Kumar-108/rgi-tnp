export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getVerifiedAuthPayloadFromRequest, signAuthToken, attachAuthCookie } from "@/lib/auth-jwt";

export async function POST(req: NextRequest) {
  try {
    const payload = await getVerifiedAuthPayloadFromRequest(req);
    
    if (!payload?.role || !payload?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Generate new access token with same payload
    const newAccessToken = await signAuthToken(
      {
        id: payload.id,
        email: payload.email,
        enrollmentNumber: payload.enrollmentNumber,
        role: payload.role,
        company: payload.company,
      },
      "7d"
    );

    const response = NextResponse.json({ 
      success: true,
      token: newAccessToken,
      message: "Token refreshed successfully"
    });
    
    // Also attach to cookie for server-side validation
    attachAuthCookie(response, payload.role as any, newAccessToken);

    return response;
  } catch (error: any) {
    console.error("Error in token refresh:", error);
    return NextResponse.json(
      { success: false, message: "Token refresh failed" },
      { status: 500 }
    );
  }
}
