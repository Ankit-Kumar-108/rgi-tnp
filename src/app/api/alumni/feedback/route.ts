export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
// POST: Submit curriculum feedback
export async function POST(req: NextRequest) {
  try {
    const alumni = await getVerifiedAuthPayloadFromRequest(req, ["alumni"]);
    if (!alumni || !alumni.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { content: string; rating: number };
    const db = getDb();

    const feedback = await db.alumniFeedback.create({
      data: {
        content: body.content,
        rating: body.rating,
        alumniId: alumni.id,
        isApproved: false,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Feedback submitted — thank you!", feedback });
  } catch (error) {
    console.error("Feedback Submit Error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit feedback" }, { status: 500 });
  }
}
