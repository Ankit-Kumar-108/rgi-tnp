import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    // Gmail sends 'List-Unsubscribe=One-Click' in the body for automated unsubscriptions (RFC 8058)
    const bodyText = await req.text();
    
    console.log(`[UNSUBSCRIBE] One-click request received for: ${email || "unknown"}`);
    console.log(`[UNSUBSCRIBE] Body: ${bodyText}`);

    // Return 200 OK to satisfy Gmail's background validation
    return new NextResponse("Unsubscribe request received", { status: 200 });
  } catch (error) {
    console.error("[UNSUBSCRIBE] Error handling POST request:", error);
    return new NextResponse("Error processing request", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // If a human clicks the link, redirect them to the instruction page
  return NextResponse.redirect(new URL("/unsubscribe", req.url));
}
