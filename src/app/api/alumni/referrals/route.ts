export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { referralSchema } from "@/lib/validations/alumni";
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

    const body = await req.json();

    // Validate request body
    const validationResult = referralSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation failed", 
        errors: validationResult.error.flatten()
      }, { status: 400 });
    }

    const db = getDb();

    const referral = await db.referral.create({
      data: {
        companyName: validationResult.data.companyName,
        jobType: validationResult.data.jobType ?? null,
        position: validationResult.data.position,
        description: validationResult.data.description,
        location: validationResult.data.location ?? null,
        minCGPA: validationResult.data.minCGPA ? parseFloat(validationResult.data.minCGPA) : null,
        experience: validationResult.data.experience ?? null,
        batchEligible: validationResult.data.batchEligible ?? null,
        refrerralLink: validationResult.data.refrerralLink ?? null,
        referralCode: validationResult.data.referralCode ?? null,
        deadline: validationResult.data.deadline ? new Date(validationResult.data.deadline) : null,
        applyLink: validationResult.data.applyLink,
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
