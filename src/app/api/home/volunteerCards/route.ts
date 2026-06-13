export const dynamic = 'force-dynamic';
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const rawLimit = searchParams.get("limit") || "4";
    const isAll = rawLimit === 'all';
    const parsedLimit = isAll ? undefined : Math.max(1, Math.min(parseInt(rawLimit) || 4, 50));
  const db = getDb();
    const volunteers = await db.volunteer.findMany({
        where: {
            isActive: true,
            isVerified: true,
        },
        select: {
            id: true,
            designation: true,
            createdAt: true,
            student: {
                select: {
                    name: true,
                    profileImageUrl: true,
                    linkedinUrl: true,
                },
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        take: parsedLimit,
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