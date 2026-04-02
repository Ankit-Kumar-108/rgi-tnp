import { NextRequest } from "next/server";
import * as jose from "jose";

export interface JWTPayload {
  id?: string;
  email?: string;
  enrollmentNumber?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Verifies the JWT token from the Authorization header and returns the payload.
 * Shared utility to avoid duplicating token verification logic across API routes.
 */
export async function verifyAuthToken(req: NextRequest): Promise<JWTPayload | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  
  const token = authHeader.replace("Bearer ", "");
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}
