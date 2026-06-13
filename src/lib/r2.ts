import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface R2UploadResult {
  url: string;
  key: string;
}

export const getR2Bucket = async (): Promise<R2Bucket> => {
  if (process.env.NODE_ENV === "production") {
    const { env } = getCloudflareContext();

    if (!env.BUCKET) {
      throw new Error("Cloudflare R2 binding BUCKET is not configured");
    }

    return env.BUCKET;
  }
  
  // Local development mock for R2
  return {
    put: async (key: string, _file: Blob | string | ArrayBuffer | ReadableStream<Uint8Array> | null) => {
      console.log(`[R2 MOCK] Uploading file to local path/mock: ${key}`);
      return {
        key,
        version: "mock-version",
        size: 0,
        etag: "mock-etag",
        httpEtag: "mock-http-etag",
        uploaded: new Date(),
        checksums: {},
        storageClass: "Standard",
        customMetadata: {},
      } as R2Object;
    },
    get: async (key: string) => {
      console.log(`[R2 MOCK] Getting file: ${key}`);
      return null;
    },
    delete: async (key: string) => {
      console.log(`[R2 MOCK] Deleting file: ${key}`);
    }
  } as R2Bucket;
};

export const uploadToR2 = async (
  file: File | Blob,
  path: string
): Promise<R2UploadResult> => {
  const bucket = await getR2Bucket();
  const filename = (file as File).name || `upload-${Date.now()}`;
  const key = `${path}/${Date.now()}-${filename}`;

  await bucket.put(key, file);

  return {
    url: `/api/files/${key}`,
    key,
  };
};

export const getFileFromR2 = async (key: string) => {
  const bucket = await getR2Bucket();
  return await bucket.get(key);
};

export const deleteFromR2 = async (key: string) => {
  const bucket = await getR2Bucket();
  await bucket.delete(key);
};
