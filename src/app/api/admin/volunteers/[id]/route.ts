export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminTokenData = await getVerifiedAuthPayloadFromRequest(req, ["admin"]);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin is verified via JWT
    const db = getDb();
    const { id } = await params;

    const volunteer = await db.query.volunteer.findFirst({
      where: eq(schema.volunteer.id, id),
      with: {
        student: {
          columns: {
            id: true,
            name: true,
            email: true,
            enrollmentNumber: true,
            branch: true,
            semester: true,
            cgpa: true,
            batch: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch volunteer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminTokenData = await getVerifiedAuthPayloadFromRequest(req, ["admin"]);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin is verified via JWT
    const db = getDb();
    const { id } = await params;

    const volunteer = await db.query.volunteer.findFirst({
      where: eq(schema.volunteer.id, id),
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    const body = await req.json() as any
    const { designation, isVerified, verificationNotes } = body;

    await db.update(schema.volunteer)
      .set({
        designation: designation ?? volunteer.designation,
        isVerified: isVerified ?? volunteer.isVerified,
        verificationNotes: verificationNotes ?? volunteer.verificationNotes,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.volunteer.id, id));

    const updatedVolunteer = await db.query.volunteer.findFirst({
      where: eq(schema.volunteer.id, id),
      with: {
        student: {
          columns: {
            id: true,
            name: true,
            email: true,
            enrollmentNumber: true,
            branch: true,
            semester: true,
            cgpa: true,
            batch: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Volunteer updated successfully",
      data: updatedVolunteer,
    });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update volunteer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminTokenData = await getVerifiedAuthPayloadFromRequest(req, ["admin"]);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin is verified via JWT
    const db = getDb();
    const { id } = await params;

    const volunteer = await db.query.volunteer.findFirst({
      where: eq(schema.volunteer.id, id),
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    // Hard delete
    await db.delete(schema.volunteer).where(eq(schema.volunteer.id, id));

    return NextResponse.json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    console.error("Error deactivating volunteer:", error);
    return NextResponse.json(
      { success: false, message: "Failed to deactivate volunteer" },
      { status: 500 }
    );
  }
}

