import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Cache PrismaClient on globalThis to avoid re-initialization on every
// request — PrismaClient construction is expensive and will exceed
// Cloudflare's CPU time limit if done per-request.
// The D1 binding (env.DB) is stable within a single worker isolate,
// so reusing the client across requests is safe.
export const getDb = (): PrismaClient => {
  if ((globalThis as any).__prisma) {
    return (globalThis as any).__prisma as PrismaClient;
  }

  const { env } = getRequestContext() as any;
  const adapter = new PrismaD1(env.DB);

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  } as any);

  (globalThis as any).__prisma = client;
  return client;
};
