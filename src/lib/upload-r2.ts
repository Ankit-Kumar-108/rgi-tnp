import { getToken, type UserRole } from "@/lib/auth-client";

export type UploadFolder =
  | "profiles"
  | "memories"
  | "resumes"
  | "drive-images";

export type RegistrationUploadFlow =
  | "student_registration"
  | "alumni_registration"
  | "external_student_registration";

type UploadOptions = {
  role?: UserRole;
  uploadToken?: string;
};

export async function getRegistrationUploadToken(
  flow: RegistrationUploadFlow,
): Promise<string> {
  const res = await fetch("/api/upload/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flow }),
  });

  const data = (await res.json()) as {
    success?: boolean;
    token?: string;
    message?: string;
  };

  if (!res.ok || !data.success || !data.token) {
    throw new Error(data.message || "Failed to create upload token");
  }

  return data.token;
}

/**
 * Reusable utility to upload a file directly to Cloudflare R2 via presigned URLs.
 */
export async function uploadFileToR2(
  file: File,
  folder: UploadFolder,
  options: UploadOptions = {},
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.role) {
    const token = getToken(options.role);

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch("/api/upload/presigned-url", {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder,
      fileSize: file.size,
      uploadToken: options.uploadToken,
    }),
  });

  if (!res.ok) {
    const errData = await res.json() as { message?: string };
    throw new Error(errData.message || "Failed to get upload URL");
  }

  const data = await res.json() as { presignedUrl?: string; publicUrl?: string; success?: boolean; message?: string };

  if (!data.success || !data.presignedUrl || !data.publicUrl) {
    throw new Error(data.message || "Failed to get upload URL");
  }

  const { presignedUrl, publicUrl } = data as { presignedUrl: string; publicUrl: string };

  // 2. Direct Upload to Cloudflare R2 using the signed URL
  // We use direct binary upload (PUT)
  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { 
      "Content-Type": file.type 
    },
  });

  if (!uploadRes.ok) {
    throw new Error(`R2 Storage upload failed (${uploadRes.status})`);
  }

  return publicUrl;
}
