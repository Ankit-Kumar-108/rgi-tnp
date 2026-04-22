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

export async function GET(req: NextRequest) {
  try {
    const adminTokenData = await getAdminFromToken(req);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin is verified via JWT, no need to check database
    // The token was already verified by getAdminFromToken

    const db = getDb();

    // Get all volunteers with student details
    const volunteers = await db.volunteer.findMany({
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: volunteers,
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const body = await req.json() as any
    const { studentId, designation, verificationNotes, isVerified } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    // Check if student exists (by ID or enrollmentNumber)
    let student = null;
    
    // First try to find by ID if it looks like a UUID
    if (studentId.length > 10) {
      student = await db.student.findUnique({
        where: { id: studentId },
        select: { id: true, name: true, email: true },
      });
    }
    
    // If not found by ID, try by enrollmentNumber
    if (!student) {
      student = await db.student.findUnique({
        where: { enrollmentNumber: studentId },
        select: { id: true, name: true, email: true },
      });
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check if already a volunteer
    const existingVolunteer = await db.volunteer.findUnique({
      where: { studentId: student.id },
    });

    if (existingVolunteer) {
      return NextResponse.json(
        { success: false, message: "Student is already a volunteer" },
        { status: 400 }
      );
    }

    // Create volunteer record
    const newVolunteer = await db.volunteer.create({
      data: {
        studentId: student.id,
        designation: designation || "Volunteer",
        isVerified: isVerified || false,
        verificationNotes: verificationNotes || null,
        assignedBy: adminTokenData.email,
        assignedAt: new Date(),
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
      message: "Volunteer assigned successfully",
      data: newVolunteer,
    });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign volunteer" },
      { status: 500 }
    );
  }
}
