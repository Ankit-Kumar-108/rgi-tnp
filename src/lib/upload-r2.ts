/**
 * Reusable utility to upload a file directly to Cloudflare R2 via presigned URLs.
 * 
 * @param file The file object from an input element
 * @param folder The target folder in R2 bucket (e.g. 'profiles' or 'memories')
 * @returns The public URL of the uploaded image
 */
export async function uploadFileToR2(file: File, folder: "profiles" | "memories" | "resumes"): Promise<string> {
  // 1. Get Presigned URL from our API
  const res = await fetch("/api/upload/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder: folder
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
