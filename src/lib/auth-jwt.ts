import type { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export type UserRole =
  | "student"
  | "recruiter"
  | "alumni"
  | "admin"
  | "external_student";

export const AUTH_ROLES: UserRole[] = [
  "student",
  "recruiter",
  "alumni",
  "admin",
  "external_student",
];

export type AuthTokenPayload = jose.JWTPayload & {
  id?: string;
  email?: string;
  enrollmentNumber?: string;
  role?: UserRole;
  company?: string;
};

export const AUTH_COOKIE_KEYS: Record<UserRole, string> = {
  student: "student_token",
  recruiter: "recruiter_token",
  alumni: "alumni_token",
  admin: "admin_token",
  external_student: "external_student_token",
};

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function signAuthToken(
  payload: Record<string, unknown>,
  expiresIn = "7d",
) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, getJwtSecret());
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function getBearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim() || null;
}

export function getAuthCookieValue(req: NextRequest, role: UserRole) {
  return req.cookies.get(AUTH_COOKIE_KEYS[role])?.value ?? null;
}

export function getAuthTokenFromRequest(req: NextRequest, role?: UserRole) {
  return getBearerToken(req) ?? (role ? getAuthCookieValue(req, role) : null);
}

export async function getVerifiedAuthPayloadFromRequest(
  req: NextRequest,
  roles: UserRole[] = AUTH_ROLES,
) {
  const bearerToken = getBearerToken(req);

  if (bearerToken) {
    const payload = await verifyAuthToken(bearerToken);

    if (payload?.role && roles.includes(payload.role)) {
      return payload;
    }
  }

  for (const role of roles) {
    const cookieToken = getAuthCookieValue(req, role);

    if (!cookieToken) {
      continue;
    }

    const payload = await verifyAuthToken(cookieToken);

    if (payload?.role === role) {
      return payload;
    }
  }

  return null;
}

export function attachAuthCookie(
  response: NextResponse,
  role: UserRole,
  token: string,
) {
  response.cookies.set({
    name: AUTH_COOKIE_KEYS[role],
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });

  return response;
}

export function clearAuthCookie(response: NextResponse, role: UserRole) {
  response.cookies.set({
    name: AUTH_COOKIE_KEYS[role],
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
