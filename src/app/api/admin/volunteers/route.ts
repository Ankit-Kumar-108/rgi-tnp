/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

export async function GET(req: NextRequest) {
  try {
    const adminTokenData = await getVerifiedAuthPayloadFromRequest(req, ["admin"]);
    
    if (!adminTokenData || !adminTokenData.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();

    // Get all volunteers with student details
    const volunteers = await db.query.volunteer.findMany({
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
      orderBy: (t, { desc }) => [desc(t.createdAt)],
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
    const adminTokenData = await getVerifiedAuthPayloadFromRequest(req, ["admin"]);
    
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
      student = await db.query.student.findFirst({
        where: eq(schema.student.id, studentId),
        columns: { id: true, name: true, email: true },
      });
    }
    
    // If not found by ID, try by enrollmentNumber
    if (!student) {
      student = await db.query.student.findFirst({
        where: eq(schema.student.enrollmentNumber, studentId),
        columns: { id: true, name: true, email: true },
      });
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check if already a volunteer
    const existingVolunteer = await db.query.volunteer.findFirst({
      where: eq(schema.volunteer.studentId, student.id),
    });

    if (existingVolunteer) {
      return NextResponse.json(
        { success: false, message: "Student is already a volunteer" },
        { status: 400 }
      );
    }

    // Create volunteer record
    const insertResult = await db.insert(schema.volunteer)
      .values({
        studentId: student.id,
        designation: designation || "Volunteer",
        isVerified: isVerified || false,
        verificationNotes: verificationNotes || null,
        assignedBy: adminTokenData.email,
        assignedAt: new Date().toISOString(),
      })
      .returning();

    const newVolunteer = await db.query.volunteer.findFirst({
      where: eq(schema.volunteer.id, insertResult[0].id),
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
