export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

async function getAdminFromToken(req: NextRequest) {
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminTokenData = await getAdminFromToken(req);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin is verified via JWT
    const db = getDb();

    const volunteer = await db.volunteer.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: {
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
  { params }: { params: { id: string } }
) {
  try {
    const adminTokenData = await getAdminFromToken(req);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin is verified via JWT
    const db = getDb();

    const volunteer = await db.volunteer.findUnique({
      where: { id: params.id },
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { designation, isVerified, verificationNotes, isActive } = body;

    const updatedVolunteer = await db.volunteer.update({
      where: { id: params.id },
      data: {
        designation: designation ?? volunteer.designation,
        isVerified: isVerified ?? volunteer.isVerified,
        verificationNotes: verificationNotes ?? volunteer.verificationNotes,
        isActive: isActive ?? volunteer.isActive,
        updatedAt: new Date(),
      },
      include: {
        student: {
          select: {
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
  { params }: { params: { id: string } }
) {
  try {
    const adminTokenData = await getAdminFromToken(req);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin is verified via JWT
    const db = getDb();

    const volunteer = await db.volunteer.findUnique({
      where: { id: params.id },
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    // Soft delete - mark as inactive
    const updatedVolunteer = await db.volunteer.update({
      where: { id: params.id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Volunteer deactivated successfully",
      data: updatedVolunteer,
    });
  } catch (error) {
    console.error("Error deactivating volunteer:", error);
    return NextResponse.json(
      { success: false, message: "Failed to deactivate volunteer" },
      { status: 500 }
    );
  }
}
