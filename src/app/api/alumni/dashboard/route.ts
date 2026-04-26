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

export async function GET(req: NextRequest) {
  try {
    const alumni = await getAlumniFromToken(req);
    if (!alumni) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const alumniData = await db.alumni.findUnique({
      where: { id: alumni.id },
      select: {
        id: true, name: true, enrollmentNumber: true, personalEmail: true,
        currentCompany: true, jobTitle: true, city: true, country: true,
        linkedInUrl: true, phoneNumber: true, isProfileComplete: true,
        isVerified: true, about: true, branch: true, batch: true,
        course: true, profileImageUrl: true, privacyJson: true,
      },
    });

    if (!alumniData) {
      return NextResponse.json({ success: false, message: "Alumni not found" }, { status: 404 });
    }

    // Get referrals with counts at database level (avoid filtering in-memory)
    const [referrals, feedbacks, memories, referralCounts] = await Promise.all([
      db.referral.findMany({
        where: { alumniId: alumni.id },
        orderBy: { id: "desc" },
        take: 50, // Limit to prevent large payload
      }),
      db.alumniFeedback.findMany({
        where: { alumniId: alumni.id },
      }),
      db.memory.findMany({
        where: { alumniId: alumni.id },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
      Promise.all([
        db.referral.count({ where: { alumniId: alumni.id } }),
        db.referral.count({ where: { alumniId: alumni.id, status: "published" } }),
        db.referral.count({ where: { alumniId: alumni.id, status: "pending" } }),
      ])
    ]);

    const [totalReferrals, approvedReferrals, pendingReferrals] = referralCounts;

    return NextResponse.json({
      success: true,
      alumni: alumniData,
      referrals,
      memories,
      stats: {
        totalReferrals,
        approvedReferrals,
        pendingReferrals,
        totalFeedbacks: feedbacks.length,
      },
    });
  } catch (error) {
    console.error("Alumni Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load dashboard" }, { status: 500 });
  }
}
