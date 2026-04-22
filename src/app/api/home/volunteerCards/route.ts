export const runtime = "edge";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "4";
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
        take: limit === 'all' ? undefined : (parseInt(limit) || 4),
    });
    return Response.json({ success: true, volunteers });
}