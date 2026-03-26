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

// POST: Submit curriculum feedback
export async function POST(req: NextRequest) {
  try {
    const alumni = await getAlumniFromToken(req);
    if (!alumni) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { content: string; rating: number };
    const db = getDb();

    const feedback = await db.alumniFeedback.create({
      data: {
        content: body.content,
        rating: body.rating,
        alumniId: alumni.id,
      },
    });

    return NextResponse.json({ success: true, message: "Feedback submitted — thank you!", feedback });
  } catch (error) {
    console.error("Feedback Submit Error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit feedback" }, { status: 500 });
  }
}
