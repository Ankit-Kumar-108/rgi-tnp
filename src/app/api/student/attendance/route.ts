/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export const dynamic = 'force-dynamic';
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth-jwt";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, externalStudent, placementDrive, driveRegistration } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
// Read the student's login token from the request header


export async function POST(req: NextRequest) {
  try {
    // PART A: Figure out WHO is scanning\
    const studentData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);

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
      const extStudent = await db.query.externalStudent.findFirst({
        where: eq(externalStudent.email, studentData.email),
        columns: { id: true, name: true },
      });

      if (!extStudent) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      registration = await db.query.driveRegistration.findFirst({
        where: and(
          eq(driveRegistration.driveId, driveId),
          eq(driveRegistration.externalStudentId, extStudent.id)
        ),
      });

    } else {
      // Regular student path
      const studentInfo = await db.query.student.findFirst({
        where: eq(studentTable.enrollmentNumber, studentData.enrollmentNumber),
        columns: { id: true, name: true },
      });

      if (!studentInfo) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      registration = await db.query.driveRegistration.findFirst({
        where: and(
          eq(driveRegistration.driveId, driveId),
          eq(driveRegistration.studentId, studentInfo.id)
        ),
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
      const drive = await db.query.placementDrive.findFirst({
        where: eq(placementDrive.id, driveId),
        columns: { companyName: true },
      });
      return NextResponse.json({
        success: true,
        message: "Attendance was already marked",
        alreadyMarked: true,
        driveName: drive?.companyName,
      });
    }

    // Mark them present!
    await db.update(driveRegistration).set({
      attended: true,
    }).where(eq(driveRegistration.id, registration.id));

    const drive = await db.query.placementDrive.findFirst({
      where: eq(placementDrive.id, driveId),
      columns: { companyName: true, roleName: true },
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
