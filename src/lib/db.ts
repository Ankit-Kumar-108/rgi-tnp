import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export function getDb() {
    const { env } = getCloudflareContext();

    if (!env.DB) {
        throw new Error("Cloudflare D1 binding DB is not configured");
    }

    if (!(globalThis as any).__db) {
        (globalThis as any).__db = drizzle(env.DB, { schema });
    }

    return (globalThis as any).__db as ReturnType<typeof drizzle<typeof schema>>;
}
