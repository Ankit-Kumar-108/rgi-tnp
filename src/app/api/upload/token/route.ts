export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import {
  createUploadPermissionToken,
  type RegistrationUploadFlow,
} from "@/lib/upload-auth";

const REGISTRATION_FLOWS: RegistrationUploadFlow[] = [
  "student_registration",
  "alumni_registration",
  "external_student_registration",
];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { flow?: string };
    const flow = body.flow;

    if (!flow || !REGISTRATION_FLOWS.includes(flow as RegistrationUploadFlow)) {
      return NextResponse.json(
        { success: false, message: "Invalid upload flow" },
        { status: 400 },
      );
    }

    const token = await createUploadPermissionToken(
      flow as RegistrationUploadFlow,
    );

    return NextResponse.json({
      success: true,
      token,
      expiresInSeconds: 600,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create upload token";
    console.error("Upload token error:", error);
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
