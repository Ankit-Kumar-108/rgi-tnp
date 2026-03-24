import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

let prisma: PrismaClient | undefined;

export const getDb = () => {
  // In production on Cloudflare Pages, use D1 adapter
  if (process.env.NODE_ENV === "production") {
    const { env } = getRequestContext() as any;
    const adapter = new PrismaD1(env.DB);
    return new PrismaClient({ adapter });
  }

  // In local development, use standard Prisma with SQLite/file DB
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};
