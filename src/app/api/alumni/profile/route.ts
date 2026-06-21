export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2-delete";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { alumni as alumniTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni || !alumni.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      currentCompany?: string;
      jobTitle?: string;
      city?: string;
      country?: string;
      linkedInUrl?: string;
      phoneNumber?: string;
      about?: string;
      profileImageUrl?: string;
      cgpa?: string | number;
      batch?: string;
    };

    const db = getDb();

    // Fetch existing alumni to check for old profileImageUrl
    const existingAlumni = await db.query.alumni.findFirst({
      where: eq(alumniTable.id, alumni.id),
      columns: { profileImageUrl: true }
    });

    const updatedAlumniResult = await db.update(alumniTable).set({
      currentCompany: body.currentCompany,
      jobTitle: body.jobTitle,
      city: body.city,
      country: body.country,
      linkedInUrl: body.linkedInUrl,
      phoneNumber: body.phoneNumber,
      about: body.about,
      ...(body.cgpa !== undefined && { cgpa: body.cgpa !== "" ? Number(body.cgpa) : null }),
      ...(body.batch !== undefined && { batch: body.batch }),
      ...(body.profileImageUrl !== undefined && { profileImageUrl: body.profileImageUrl }),
      isProfileComplete: true,
      updatedAt: new Date().toISOString(),
    }).where(eq(alumniTable.id, alumni.id)).returning();
    const updatedAlumni = updatedAlumniResult[0];

    // Clean up old R2 files if replaced
    if (body.profileImageUrl && existingAlumni?.profileImageUrl &&
        body.profileImageUrl !== existingAlumni.profileImageUrl) {
      await deleteFromR2(existingAlumni.profileImageUrl);
    }

    return NextResponse.json({ 
        success: true, 
        message: "Profile updated successfully", 
        alumni: updatedAlumni 
    });
  } catch (error) {
    console.error("Alumni Profile Update Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}

