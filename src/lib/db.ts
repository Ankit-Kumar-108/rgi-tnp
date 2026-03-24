import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | undefined;

export const getDb = () => {
  // In production on Cloudflare Pages, use D1 adapter
  if (process.env.NODE_ENV === "production") {
    const { PrismaD1 } = require("@prisma/adapter-d1");
    const { getRequestContext } = require("@cloudflare/next-on-pages");
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const adapter = new PrismaD1(env.DB);
    return new PrismaClient({ adapter });
  }

  // In local development, use standard Prisma with SQLite/file DB
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};
