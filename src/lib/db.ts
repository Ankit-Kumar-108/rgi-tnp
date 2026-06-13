import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Create a fresh PrismaClient for each request.
//
// On Cloudflare Workers, getRequestContext() returns the D1 binding
// from the current request's AsyncLocalStorage scope. Caching a
// PrismaClient on globalThis with one request's D1 binding and then
// reusing it for a later request causes stale-binding errors because
// the D1 reference is tied to the original request context.
//
// Unlike traditional databases, D1 has no TCP connection pool to
// manage, so creating a new PrismaClient per request is cheap.
export const getDb = (): PrismaClient => {
  const { env } = getRequestContext() as any;
  const adapter = new PrismaD1(env.DB);

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  } as any);

  return client;
};
