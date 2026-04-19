export const runtime = "edge";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  
  const testimonials = await db.$queryRaw`
    SELECT 
      af.id,
      af.content,
      af.rating,
      a.name,
      a."jobTitle",
      a."profileImageUrl",
      a."currentCompany"
    FROM "AlumniFeedback" af
    JOIN "Alumni" a ON af."alumniId" = a.id
    WHERE af."isApproved" = true AND af."rating" >= 4 AND a."isProfileComplete" = true
    ORDER BY RANDOM() 
    LIMIT 3
  `;

  return new Response(JSON.stringify(testimonials));
}