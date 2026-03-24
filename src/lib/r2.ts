import { getRequestContext } from "@cloudflare/next-on-pages";

export interface R2UploadResult {
  url: string;
  key: string;
}

export const getR2Bucket = (): R2Bucket | any => {
  if (process.env.NODE_ENV === "production") {
    const { getRequestContext } = require("@cloudflare/next-on-pages");
    const { env } = getRequestContext() as { env: CloudflareEnv };
    return env.BUCKET;
  }
  
  // Local development mock for R2
  return {
    put: async (key: string, file: any) => {
      console.log(`[R2 MOCK] Uploading file to local path/mock: ${key}`);
      return { key };
    },
    get: async (key: string) => {
      console.log(`[R2 MOCK] Getting file: ${key}`);
      return null;
    },
    delete: async (key: string) => {
      console.log(`[R2 MOCK] Deleting file: ${key}`);
    }
  };
};

export const uploadToR2 = async (
  file: File | Blob,
  path: string
): Promise<R2UploadResult> => {
  const bucket = getR2Bucket();
  const filename = (file as File).name || `upload-${Date.now()}`;
  const key = `${path}/${Date.now()}-${filename}`;

  await bucket.put(key, file as any);

  return {
    url: `/api/files/${key}`,
    key,
  };
};

export const getFileFromR2 = async (key: string) => {
  const bucket = getR2Bucket();
  return await bucket.get(key);
};

export const deleteFromR2 = async (key: string) => {
  const bucket = getR2Bucket();
  await bucket.delete(key);
};
