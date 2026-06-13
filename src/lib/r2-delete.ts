import { S3Client, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

// Lazy-initialized S3 client — process.env is NOT available at module
// load time on Cloudflare Workers, so we must defer reading env vars
// until the first request comes in.
let _s3Client: S3Client | null = null;
function getS3Client(): S3Client {
  if (!_s3Client) {
    _s3Client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_END_POINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _s3Client;
}

function getBucket(): string {
  return process.env.R2_BUCKET_NAME!;
}

function getPublicUrl(): string {
  return process.env.R2_PUBLIC_URL!;
}
function extractKeyFromUrl(publicUrl: string): string | null {
  const publicUrlBase = getPublicUrl();
  if (!publicUrl || !publicUrlBase) return null;
  try {
    // Remove the public URL prefix to get just the key
    if (publicUrl.startsWith(publicUrlBase)) {
      return publicUrl.slice(publicUrlBase.length + 1);
    }
    // Fallback: try parsing as URL and use the pathname
    const url = new URL(publicUrl);
    return url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
  } catch {
    return null;
  }
}

export async function deleteFromR2(publicUrl: string): Promise<void> {
  const key = extractKeyFromUrl(publicUrl);
  if (!key) return;

  try {
    await getS3Client().send(
      new DeleteObjectCommand({ Bucket: getBucket(), Key: key })
    );
  } catch (err) {
    console.error(`[R2 Delete] Failed to delete ${key}:`, err);
  }
}

export async function deleteMultipleFromR2(publicUrls: string[]): Promise<void> {
  const keys = publicUrls
    .map(extractKeyFromUrl)
    .filter((k): k is string => k !== null);

  if (keys.length === 0) return;

  try {
    await getS3Client().send(
      new DeleteObjectsCommand({
        Bucket: getBucket(),
        Delete: {
          Objects: keys.map((Key) => ({ Key })),
          Quiet: true,
        },
      })
    );
  } catch (err) {
    console.error(`[R2 Delete] Batch delete failed for ${keys.length} keys:`, err);
  }
}