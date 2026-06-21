export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { referralSchema } from "@/lib/validations/alumni";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { referral as referralTable } from "@/lib/schema";

// POST: Submit a new referral
export async function POST(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni || !alumni.id) {
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

    const referralResult = await db.insert(referralTable).values({
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
      applyLink: validationResult.data.applyLink ?? null,
      status: "pending",
      alumniId: alumni.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    const referralData = referralResult[0];

    return NextResponse.json({ success: true, message: "Referral submitted for admin approval", referral: referralData });
  } catch (error) {
    console.error("Referral Submit Error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit referral" }, { status: 500 });
  }
}
