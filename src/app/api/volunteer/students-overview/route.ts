export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

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

export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getStudentFromToken(req);
    
    if (!studentTokenData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    
    // Verify this user is a volunteer
    const volunteer = await db.volunteer.findUnique({
      where: { studentId: studentTokenData.id },
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
          }
        }
      });

      for (const reg of registrations) {
        const studentData = reg.student || reg.externalStudent;
        
        allStudents.push({
          registrationId: reg.id,
          driveId: drive.id,
          studentId: reg.student?.id || reg.externalStudent?.id,
          studentType: reg.student ? "internal" : "external",
          name: studentData?.name,
          enrollmentNumber: studentData?.enrollmentNumber,
          email: studentData?.email,
          branch: studentData?.branch,
          cgpa: studentData?.cgpa,
          semester: studentData?.semester,
          batch: reg.student?.batch,
          collegeName: reg.externalStudent?.collegeName,
          profileImageUrl: studentData?.profileImageUrl,
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
