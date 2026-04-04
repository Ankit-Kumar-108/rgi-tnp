export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

async function getAlumniFromToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const alumni = await getAlumniFromToken(req);
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
    };

    const db = getDb();

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
        isProfileComplete: true,
      },
    });

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
