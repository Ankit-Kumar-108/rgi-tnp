import * as jose from "jose";
import type { UserRole } from "@/lib/auth-jwt";

export type UploadFolder =
  | "profiles"
  | "memories"
  | "resumes"
  | "drive-images";

export type RegistrationUploadFlow =
  | "student_registration"
  | "alumni_registration"
  | "external_student_registration";

type UploadPermissionToken = jose.JWTPayload & {
  tokenType: "upload_permission";
  flow: RegistrationUploadFlow;
  allowedFolders: UploadFolder[];
  maxFileSize: number;
};

const MB = 1024 * 1024;

export const UPLOAD_RULES: Record<
  UploadFolder,
  { maxFileSize: number; mimeTypes: string[] }
> = {
  profiles: {
    maxFileSize: 5 * MB,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  memories: {
    maxFileSize: 10 * MB,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  resumes: {
    maxFileSize: 5 * MB,
    mimeTypes: ["application/pdf"],
  },
  "drive-images": {
    maxFileSize: 5 * MB,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
};

export const REGISTRATION_UPLOAD_PERMISSIONS: Record<
  RegistrationUploadFlow,
  UploadFolder[]
> = {
  student_registration: ["profiles", "resumes"],
  alumni_registration: ["profiles"],
  external_student_registration: ["profiles", "resumes"],
};

export const AUTHENTICATED_UPLOAD_PERMISSIONS: Record<UserRole, UploadFolder[]> =
  {
    student: ["profiles", "memories", "resumes"],
    recruiter: [],
    alumni: ["profiles"],
    admin: ["drive-images"],
    external_student: ["profiles", "resumes"],
  };

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function createUploadPermissionToken(
  flow: RegistrationUploadFlow,
  expiresIn = "10m",
) {
  const allowedFolders = REGISTRATION_UPLOAD_PERMISSIONS[flow];
  const maxFileSize = Math.max(
    ...allowedFolders.map((folder) => UPLOAD_RULES[folder].maxFileSize),
  );

  return new jose.SignJWT({
    tokenType: "upload_permission",
    flow,
    allowedFolders,
    maxFileSize,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

export async function verifyUploadPermissionToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, getJwtSecret());
    const typedPayload = payload as UploadPermissionToken;

    if (typedPayload.tokenType !== "upload_permission") {
      return null;
    }

    return typedPayload;
  } catch {
    return null;
  }
}

export function isUploadFolder(value: string): value is UploadFolder {
  return value in UPLOAD_RULES;
}

export function isMimeTypeAllowed(folder: UploadFolder, mimeType: string) {
  return UPLOAD_RULES[folder].mimeTypes.includes(mimeType);
}
