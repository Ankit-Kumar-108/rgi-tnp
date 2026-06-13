import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Cache PrismaClient on globalThis to avoid re-initialization on every
// request — PrismaClient construction is expensive and will exceed
// Cloudflare's CPU time limit if done per-request.
// The D1 binding (env.DB) is stable within a single worker isolate,
// so reusing the client across requests is safe.
export const getDb = (): PrismaClient => {
  if ((globalThis as any).__prisma) {
    return (globalThis as any).__prisma as PrismaClient;
  }

  const { env } = getCloudflareContext();

  if (!env.DB) {
    throw new Error("Cloudflare D1 binding DB is not configured");
  }

  const adapter = new PrismaD1(env.DB);

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  } as any);

  (globalThis as any).__prisma = client;
  return client;
};
