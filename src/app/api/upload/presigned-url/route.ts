export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, folder } = await req.json() as any
    
    if (!filename || !contentType) {
      return NextResponse.json({ success: false, message: "Missing file information" }, { status: 400 });
    }

    // Construct a unique key (folder/timestamp-filename.ext)
    // Sanitize filename to remove spaces or weird characters
    const sanitizedFilename = filename.replace(/\s+/g, "-").toLowerCase();
    const key = `${folder || "uploads"}/${Date.now()}-${sanitizedFilename}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    // URL valid for 5 minutes (300 seconds)
    const presignedUrl = await getSignedUrl(s3Client as any, command as any, { expiresIn: 300 });
    
    // Construct the public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ 
      success: true, 
      presignedUrl, 
      publicUrl, 
      key 
    });
  } catch (error: any) {
    console.error("Presigned URL error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Failed to generate upload URL" 
    }, { status: 500 });
  }
}
