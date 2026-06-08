import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Reuse PrismaClient within the same Cloudflare Worker isolate
// Each isolate gets its own instance via globalThis caching
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
