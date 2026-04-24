export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth-jwt";
import * as jose from "jose";

// Read the student's login token from the request header
async function getStudentFromToken(req: NextRequest) {
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

export async function POST(req: NextRequest) {
  try {
    // PART A: Figure out WHO is scanning\
    const studentData = await getStudentFromToken(req);

    if (!studentData) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    // PART B: Figure out WHICH DRIVE from the QR token\
    const body = (await req.json()) as { attendanceToken: string };

    if (!body.attendanceToken) {
      return NextResponse.json(
        { success: false, message: "No attendance token provided" },
        { status: 400 }
      );
    }

    // Verify the QR token is real and not expired
    const qrPayload = await verifyAuthToken(body.attendanceToken);

    if (!qrPayload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired QR code" },
        { status: 400 }
      );
    }

    // Make sure this is actually an attendance token, not a login token
    if (qrPayload.purpose !== "attendance" || !qrPayload.driveId) {
      return NextResponse.json(
        { success: false, message: "This is not a valid attendance QR code" },
        { status: 400 }
      );
    }

    const driveId = qrPayload.driveId as string;

    // PART C: Find the student and their registration
    // Handles BOTH regular students and external students\
    const db = getDb();
    const role = studentData.role;

    let registration = null;

    if (role === "external_student") {
      // External student path
      const extStudent = await db.externalStudent.findUnique({
        where: { email: studentData.email },
        select: { id: true, name: true },
      });

      if (!extStudent) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      registration = await db.driveRegistration.findFirst({
        where: {
          driveId: driveId,
          externalStudentId: extStudent.id,
        },
      });

    } else {
      // Regular student path
      const student = await db.student.findUnique({
        where: { enrollmentNumber: studentData.enrollmentNumber },
        select: { id: true, name: true },
      });

      if (!student) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      registration = await db.driveRegistration.findFirst({
        where: {
          driveId: driveId,
          studentId: student.id,
        },
      });
    }

    // PART D: Mark attendance (same for both student types)

    // Not registered for this drive
    if (!registration) {
      return NextResponse.json(
        { success: false, message: "You haven't registered for this drive" },
        { status: 403 }
      );
    }

    // Already marked present (scanning twice is fine, no error)
    if (registration.attended) {
      const drive = await db.placementDrive.findUnique({
        where: { id: driveId },
        select: { companyName: true },
      });
      return NextResponse.json({
        success: true,
        message: "Attendance was already marked",
        alreadyMarked: true,
        driveName: drive?.companyName,
      });
    }

    // Mark them present!
    await db.driveRegistration.update({
      where: { id: registration.id },
      data: { attended: true },
    });

    const drive = await db.placementDrive.findUnique({
      where: { id: driveId },
      select: { companyName: true, roleName: true },
    });

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully!",
      driveName: drive?.companyName,
      roleName: drive?.roleName,
    });

  } catch (error) {
    console.error("Attendance Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to mark attendance" },
      { status: 500 }
    );
  }
}
