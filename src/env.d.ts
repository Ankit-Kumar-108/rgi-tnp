declare global {
  interface CloudflareEnv {
    DB: D1Database;
    BUCKET: R2Bucket;
  }
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {}
  }
}

export {};
