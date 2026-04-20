export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import {
  AUTHENTICATED_UPLOAD_PERMISSIONS,
  UPLOAD_RULES,
  isMimeTypeAllowed,
  isUploadFolder,
  type UploadFolder,
  verifyUploadPermissionToken,
} from "@/lib/upload-auth";

// Check for required environment variables
const requiredEnv = ["R2_END_POINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_URL"];
const missingEnv = requiredEnv.filter(name => !process.env[name]);

if (missingEnv.length > 0) {
    console.warn(`Missing R2 Environment Variables: ${missingEnv.join(", ")}`);
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_END_POINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

function sanitizeFilename(filename: string) {
  const rawName = filename.split(/[\\/]/).pop() || "file";
  const sanitized = rawName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .slice(0, 80);

  return sanitized || "file";
}

async function verifyVolunteerUploadAccess(enrollmentNumber?: string) {
  if (!enrollmentNumber) {
    return false;
  }

  const db = getDb();
  const student = await db.student.findUnique({
    where: { enrollmentNumber },
    select: { id: true },
  });

  if (!student) {
    return false;
  }

  const volunteer = await db.volunteer.findUnique({
    where: { studentId: student.id },
    select: { isActive: true, isVerified: true },
  });

  return Boolean(volunteer?.isActive && volunteer.isVerified);
}

export async function POST(req: NextRequest) {
  try {
    const {
      filename,
      contentType,
      folder,
      fileSize,
      uploadToken,
    } = (await req.json()) as {
      filename?: string;
      contentType?: string;
      folder?: string;
      fileSize?: number;
      uploadToken?: string;
    };

    if (!filename || !contentType || !folder || fileSize === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing file information" },
        { status: 400 },
      );
    }

    if (!isUploadFolder(folder)) {
      return NextResponse.json(
        { success: false, message: "Invalid upload folder" },
        { status: 400 },
      );
    }

    const uploadFolder = folder as UploadFolder;
    const numericFileSize = Number(fileSize);
    const uploadRule = UPLOAD_RULES[uploadFolder];

    if (!Number.isFinite(numericFileSize) || numericFileSize <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid file size" },
        { status: 400 },
      );
    }

    if (!isMimeTypeAllowed(uploadFolder, contentType)) {
      return NextResponse.json(
        { success: false, message: "File type is not allowed for this upload" },
        { status: 400 },
      );
    }

    if (numericFileSize > uploadRule.maxFileSize) {
      return NextResponse.json(
        { success: false, message: "File is too large for this upload" },
        { status: 400 },
      );
    }

    if (uploadToken) {
      const permission = await verifyUploadPermissionToken(uploadToken);

      if (!permission || !permission.allowedFolders.includes(uploadFolder)) {
        return NextResponse.json(
          { success: false, message: "Upload token is invalid or expired" },
          { status: 403 },
        );
      }
    } else {
      const payload = await getVerifiedAuthPayloadFromRequest(req);

      if (!payload?.role) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 },
        );
      }

      const allowedFolders = AUTHENTICATED_UPLOAD_PERMISSIONS[payload.role] || [];
      const canUploadToFolder =
        allowedFolders.includes(uploadFolder) ||
        (uploadFolder === "drive-images" && payload.role === "student");

      if (!canUploadToFolder) {
        return NextResponse.json(
          { success: false, message: "You are not allowed to upload this file" },
          { status: 403 },
        );
      }

      if (uploadFolder === "drive-images" && payload.role === "student") {
        const hasVolunteerAccess = await verifyVolunteerUploadAccess(
          payload.enrollmentNumber,
        );

        if (!hasVolunteerAccess) {
          return NextResponse.json(
            {
              success: false,
              message: "Only active verified volunteers can upload drive images",
            },
            { status: 403 },
          );
        }
      }
    }

    const sanitizedFilename = sanitizeFilename(filename);
    const key = `${uploadFolder}/${Date.now()}-${crypto.randomUUID()}-${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ 
      success: true, 
      presignedUrl, 
      publicUrl, 
      key 
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate upload URL";
    console.error("Presigned URL error:", error);
    return NextResponse.json({ 
      success: false, 
      message 
    }, { status: 500 });
  }
}
