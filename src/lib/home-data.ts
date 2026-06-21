import { getDb } from "@/lib/db";
import { sql, eq, desc, asc, inArray } from "drizzle-orm";
import * as schema from "./schema";

export async function fetchHomeDrives(limit = 10) {
  try {
    const db = getDb();
    // Fetch drives that are active or completed, with their images
    const drives = await db.query.placementDrive.findMany({
      where: (t: any, { or, eq: eqOp }: any) => or(eqOp(t.status, "active"), eqOp(t.status, "completed")),
      columns: {
        id: true,
        companyName: true,
        driveDate: true,
      },
      with: {
        driveImages: {
          columns: {
            id: true,
            title: true,
            imageUrl: true,
            driveId: true,
            createdAt: true,
          },
          orderBy: (t: any, { desc: descOp }: any) => [descOp(t.createdAt)],
          limit: 4,
        },
      },
      orderBy: (t: any, { desc: descOp }: any) => [descOp(t.driveDate)],
      limit,
    });
    // Only return drives that have images
    return drives
      .filter((d: any) => d.driveImages && d.driveImages.length > 0)
      .map((d: any) => ({ ...d, title: d.companyName }));
  } catch (error) {
    console.error("Home drive images error:", error);
    return [];
  }
}

export async function fetchTestimonials() {
  try {
    const db = getDb();
    const testimonials = await db.all(sql`
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
    `);
    return testimonials as any[];
  } catch (error) {
    console.error("Home testimonials error:", error);
    return [];
  }
}

export async function fetchHomeMemories(limit = 6) {
  try {
    const db = getDb();
    const memories = await db.query.memory.findMany({
      where: (t: any, { eq: eqOp }: any) => eqOp(t.status, "approved"),
      orderBy: (t: any, { desc: descOp }: any) => [descOp(t.createdAt)],
      limit,
      columns: {
        id: true,
        imageUrl: true,
        title: true,
        createdAt: true,
      },
      with: {
        student: {
          columns: { name: true },
        },
        alumni: {
          columns: { name: true },
        },
      },
    });

    return memories.map((m: any) => ({
      id: m.id,
      imageUrl: m.imageUrl,
      title: m.title,
      uploaderName: m.student?.name || m.alumni?.name || "Anonymous",
      createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : new Date(m.createdAt).toISOString(),
    }));
  } catch (error) {
    console.error("Home memories error:", error);
    return [];
  }
}

export async function fetchHomeVolunteers(limit?: number) {
  try {
    const db = getDb();
    const volunteers = await db.query.volunteer.findMany({
      where: (t: any, { eq: eqOp }: any) => eqOp(t.isActive, true),
      columns: {
        id: true,
        designation: true,
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
      orderBy: (t: any, { asc: ascOp }: any) => [ascOp(t.createdAt)],
      ...(limit ? { limit } : {}),
    });
    
    return volunteers
      .filter((v: any) => !!v.student)
      .map((v: any) => ({
        id: v.id,
        designation: v.designation,
        student: {
          name: v.student?.name || "Unknown",
          profileImageUrl: v.student?.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuD-4qpQG9rSHLujKoHhrbgWRAg81sFBu41MDA54QQ14Y6yYxoww19N7Hs6lybLRgvZCg5yNw-06wJ8p2GwAuZrN9ytupLwK1aRZSm47WIYXx5ld9vONPYIsuhD5KGlStRJhFuJTFHl_Hc-t-2CxveYwpsep0lUKrYPz6ghsEv9_r2NE8H2tzkba6XLY91OoOHMGHGA4iF6n7TtSxX_Dr3zeJ206-8b6lxuPWVgO5R0mihIiXboKj1OEPXe_2qH9vxxFdK4gE9e5YQ",
          linkedinUrl: v.student?.linkedinUrl,
        }
      }));
  } catch (error) {
    console.error("Home volunteers error:", error);
    return [];
  }
}
