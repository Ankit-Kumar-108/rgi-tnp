import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Singleton pattern to prevent connection pool exhaustion
// With Cloudflare Workers, each isolate gets its own instance
let prismaClientInstance: PrismaClient | null = null;

export const getDb = () => {
  // Reuse existing instance within the same request context
  if (prismaClientInstance) {
    return prismaClientInstance;
  }

  const { env } = getRequestContext() as any;
  const adapter = new PrismaD1(env.DB);
  
  prismaClientInstance = new PrismaClient({ 
    adapter,
    // Optimize connection pool for edge runtime
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  } as any);

  return prismaClientInstance;
};
