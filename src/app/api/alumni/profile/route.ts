export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2-delete";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";



export async function POST(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni) {
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
    };

    const db = getDb();

    // Fetch existing alumni to check for old profileImageUrl
    const existingAlumni = await db.alumni.findUnique({
      where: { id: alumni.id },
      select: { profileImageUrl: true }
    });

    const updatedAlumni = await db.alumni.update({
      where: { id: alumni.id },
      data: {
        currentCompany: body.currentCompany,
        jobTitle: body.jobTitle,
        city: body.city,
        country: body.country,
        linkedInUrl: body.linkedInUrl,
        phoneNumber: body.phoneNumber,
        about: body.about,
        ...(body.profileImageUrl !== undefined && { profileImageUrl: body.profileImageUrl }),
        isProfileComplete: true,
      },
    });

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

