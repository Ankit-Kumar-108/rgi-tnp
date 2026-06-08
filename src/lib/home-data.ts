import { getDb } from "@/lib/db";

export async function fetchHomeDrives(limit = 10) {
  try {
    const db = getDb();
    const drives = await db.placementDrive.findMany({
      where: {
        status: { in: ["active", "completed"] },
        driveImages: { some: {} },
      },
      select: {
        id: true,
        companyName: true,
        driveDate: true,
        driveImages: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            driveId: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 4,
        },
      },
      orderBy: { driveDate: "desc" },
      take: limit,
    });
    return drives.map((d: any) => ({ ...d, title: d.companyName }));
  } catch (error) {
    console.error("Home drive images error:", error);
    return [];
  }
}

export async function fetchTestimonials() {
  try {
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
    return testimonials as any[];
  } catch (error) {
    console.error("Home testimonials error:", error);
    return [];
  }
}

export async function fetchHomeMemories(limit = 6) {
  try {
    const db = getDb();
    const memories = await db.memory.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        imageUrl: true,
        title: true,
        createdAt: true,
        student: {
          select: { name: true },
        },
        alumni: {
          select: { name: true },
        },
      },
    });

    return memories.map((m: any) => ({
      id: m.id,
      imageUrl: m.imageUrl,
      title: m.title,
      uploaderName: m.student?.name || m.alumni?.name || "Anonymous",
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Home memories error:", error);
    return [];
  }
}

export async function fetchHomeVolunteers(limit?: number) {
  try {
    const db = getDb();
    const volunteers = await db.volunteer.findMany({
      where: { isActive: true },
      select: {
        id: true,
        designation: true,
        student: {
          select: {
            name: true,
            profileImageUrl: true,
            linkedinUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
    
    return volunteers
      .filter((v: any) => v.student !== null)
      .map((v: any) => ({
        id: v.id,
        designation: v.designation,
        student: {
          name: v.student.name,
          profileImageUrl: v.student.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuD-4qpQG9rSHLujKoHhrbgWRAg81sFBu41MDA54QQ14Y6yYxoww19N7Hs6lybLRgvZCg5yNw-06wJ8p2GwAuZrN9ytupLwK1aRZSm47WIYXx5ld9vONPYIsuhD5KGlStRJhFuJTFHl_Hc-t-2CxveYwpsep0lUKrYPz6ghsEv9_r2NE8H2tzkba6XLY91OoOHMGHGA4iF6n7TtSxX_Dr3zeJ206-8b6lxuPWVgO5R0mihIiXboKj1OEPXe_2qH9vxxFdK4gE9e5YQ",
          linkedinUrl: v.student.linkedinUrl,
        }
      }));
  } catch (error) {
    console.error("Home volunteers error:", error);
    return [];
  }
}
