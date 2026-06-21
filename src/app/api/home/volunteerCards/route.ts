export const dynamic = 'force-dynamic';
import { getDb } from "@/lib/db";

import { and, eq, desc } from "drizzle-orm";
import { volunteer } from "@/lib/schema";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const rawLimit = searchParams.get("limit") || "4";
    const isAll = rawLimit === 'all';
    const parsedLimit = isAll ? undefined : Math.max(1, Math.min(parseInt(rawLimit) || 4, 50));
    const db = getDb();
    const volunteers = await db.query.volunteer.findMany({
        where: and(
            eq(volunteer.isActive, true),
            eq(volunteer.isVerified, true)
        ),
        columns: {
            id: true,
            designation: true,
            createdAt: true,
        },
        with: {
            student: {
                columns: {
                    name: true,
                    profileImageUrl: true,
                    linkedinUrl: true,
                },
            },
        },
        orderBy: [desc(volunteer.createdAt)],
        limit: parsedLimit,
    });
    return Response.json(
      { success: true, volunteers },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
}