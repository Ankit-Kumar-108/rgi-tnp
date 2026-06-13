declare global {
  interface CloudflareEnv {
    ASSETS: Fetcher;
    DB: D1Database;
    BUCKET: R2Bucket;
    WORKER_SELF_REFERENCE: Fetcher;
  }
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {}
  }
}

export {};
