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
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const studentData = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: {
        id: true, name: true, enrollmentNumber: true, email: true,
        branch: true, semester: true, cgpa: true, isEmailVerified: true, isVerified: true,
        profileImageUrl: true, phoneNumber: true, course: true, batch: true,
        resumeUrl: true, tenthPercentage: true, twelfthPercentage: true,
        activeBacklog: true, linkedinUrl: true, githubUrl: true,
      },
    });

    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Get all active drives (eligibility handled on frontend)
    const drives = await db.placementDrive.findMany({
      where: {
        status: "active",
      },
      orderBy: { driveDate: "asc" },
    });

    // Get archived/completed drives
    const archivedDrives = await db.placementDrive.findMany({
      where: { status: "completed" },
      orderBy: { driveDate: "desc" },
    });

    // Get student's registrations
    const registrations = await db.driveRegistration.findMany({
      where: { student: { enrollmentNumber: studentTokenData.enrollmentNumber } },
      include: {
        drive: { select: { companyName: true, roleName: true, driveDate: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get student's memories
    const memories = await db.memory.findMany({
      where: { studentId: studentData.id },
      orderBy: { createdAt: "desc" },
    });

    const registeredDriveIds = registrations.map((r: any) => r.driveId);

    return NextResponse.json({
      success: true,
      student: studentData,
      drives: drives.map((d: any) => ({
        ...d,
        isRegistered: registeredDriveIds.includes(d.id),
      })),
      archivedDrives: archivedDrives.map((d: any) => ({
        ...d,
        isRegistered: registeredDriveIds.includes(d.id),
      })),
      registrations,
      memories,
    });
  } catch (error) {
    console.error("Student Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load dashboard" }, { status: 500 });
  }
}
