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

// POST: Submit a new referral
export async function POST(req: NextRequest) {
  try {
    const alumni = await getAlumniFromToken(req);
    if (!alumni) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      companyName: string;
      position: string;
      description: string;
      applyLink: string;
    };

    const db = getDb();

    const referral = await db.referral.create({
      data: {
        companyName: body.companyName,
        position: body.position,
        description: body.description,
        applyLink: body.applyLink,
        status: "pending",
        alumniId: alumni.id,
      },
    });

    return NextResponse.json({ success: true, message: "Referral submitted for admin approval", referral });
  } catch (error) {
    console.error("Referral Submit Error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit referral" }, { status: 500 });
  }
}
