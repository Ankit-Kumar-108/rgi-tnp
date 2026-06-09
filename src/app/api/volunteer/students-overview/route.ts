export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    
    if (!studentTokenData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    
    // Verify this user is a volunteer
    const student = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: { id: true }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const volunteer = await db.volunteer.findUnique({
      where: { studentId: student.id },
      select: { id: true, isActive: true }
    });

    if (!volunteer || !volunteer.isActive) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found or inactive" },
        { status: 403 }
      );
    }

    // Get all active drives
    const activeDrives = await db.placementDrive.findMany({
      where: { status: "active" },
      select: {
        id: true,
        companyName: true,
        roleName: true,
        ctc: true,
        minCGPA: true,
        driveDate: true,
        jobType: true
      }
    });

    // For each drive, get all registered students with their status
    const allStudents = [];

    for (const drive of activeDrives) {
      const registrations = await db.driveRegistration.findMany({
        where: { driveId: drive.id },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              enrollmentNumber: true,
              email: true,
              branch: true,
              semester: true,
              cgpa: true,
              profileImageUrl: true,
              batch: true
            }
          },
          externalStudent: {
            select: {
              id: true,
              name: true,
              enrollmentNumber: true,
              email: true,
              branch: true,
              semester: true,
              cgpa: true,
              profileImageUrl: true,
              collegeName: true
            }
          },
          alumni: {
            select: {
              id: true,
              name: true,
              enrollmentNumber: true,
              personalEmail: true,
              branch: true,
              batch: true,
              profileImageUrl: true,
              cgpa: true
            }
          }
        }
      });

      for (const reg of registrations) {
        const studentData = reg.student || reg.externalStudent || reg.alumni;
        if (!studentData) continue; // Skip if malformed

        const studentType = reg.student ? "internal" : reg.externalStudent ? "external" : "alumni";
        const email = reg.student?.email || reg.externalStudent?.email || reg.alumni?.personalEmail || "";
        const batch = reg.student?.batch || reg.alumni?.batch || "";
        const cgpa = reg.student?.cgpa ?? reg.externalStudent?.cgpa ?? reg.alumni?.cgpa ?? 0;
        const semester = reg.student?.semester ?? reg.externalStudent?.semester ?? 0;
        const profileImageUrl = reg.student?.profileImageUrl ?? reg.externalStudent?.profileImageUrl ?? reg.alumni?.profileImageUrl ?? undefined;
        const collegeName = reg.externalStudent?.collegeName ?? (reg.alumni ? "Alumni" : "RGI");

        allStudents.push({
          registrationId: reg.id,
          driveId: drive.id,
          studentId: studentData.id,
          studentType,
          name: studentData.name,
          enrollmentNumber: studentData.enrollmentNumber,
          email,
          branch: studentData.branch,
          cgpa,
          semester,
          batch,
          collegeName,
          profileImageUrl,
          companyName: drive.companyName,
          roleName: drive.roleName,
          ctc: drive.ctc,
          minCGPA: drive.minCGPA,
          jobType: drive.jobType,
          driveDate: drive.driveDate,
          status: reg.status,
          appliedAt: reg.createdAt
        });
      }
    }

    return NextResponse.json({
      success: true,
      students: allStudents
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in students-overview:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
