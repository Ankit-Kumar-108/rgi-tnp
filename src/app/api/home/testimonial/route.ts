export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { alumniFeedback, alumni } from "@/lib/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export async function GET() {
  const db = getDb();
  
  const testimonials = await db
    .select({
      id: alumniFeedback.id,
      content: alumniFeedback.content,
      rating: alumniFeedback.rating,
      name: alumni.name,
      jobTitle: alumni.jobTitle,
      profileImageUrl: alumni.profileImageUrl,
      currentCompany: alumni.currentCompany,
    })
    .from(alumniFeedback)
    .innerJoin(alumni, eq(alumniFeedback.alumniId, alumni.id))
    .where(
      and(
        eq(alumniFeedback.isApproved, true),
        gte(alumniFeedback.rating, 4),
        eq(alumni.isProfileComplete, true)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(3);

  return NextResponse.json(testimonials, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    },
  });
}