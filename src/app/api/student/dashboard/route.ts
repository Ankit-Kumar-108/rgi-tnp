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

    // Pagination parameters
    const { searchParams } = new URL(req.url);
    const drivesLimit = Math.min(parseInt(searchParams.get("drivesLimit") || "50", 10), 100);
    const registrationsLimit = Math.min(parseInt(searchParams.get("registrationsLimit") || "50", 10), 100);
    const drivesPage = Math.max(1, parseInt(searchParams.get("drivesPage") || "1", 10));
    const registrationsPage = Math.max(1, parseInt(searchParams.get("registrationsPage") || "1", 10));

    const db = getDb();
    const studentData = await db.student.findUnique({
      where: { enrollmentNumber: studentTokenData.enrollmentNumber },
      select: {
        id: true, name: true, enrollmentNumber: true, email: true,
        branch: true, semester: true, cgpa: true, isEmailVerified: true, isVerified: true,
        profileImageUrl: true, phoneNumber: true, course: true, batch: true,
        resumeUrl: true, tenthPercentage: true, twelfthPercentage: true,
        activeBacklog: true, linkedinUrl: true, githubUrl: true,
        isProfileComplete: true,
      },
    });

    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Parallel fetch for better performance
    const [drives, archivedDrives, registrations, memories, drivesCount, registrationsCount] = await Promise.all([
      // Get active drives with pagination
      db.placementDrive.findMany({
        where: { status: "active" },
        take: drivesLimit,
        skip: (drivesPage - 1) * drivesLimit,
        orderBy: { driveDate: "asc" },
      }),
      // Get archived/completed drives
      db.placementDrive.findMany({
        where: { status: "completed" },
        take: 10, // Limit archived drives
        orderBy: { driveDate: "desc" },
      }),
      // Get student's registrations with pagination
      db.driveRegistration.findMany({
        where: { student: { enrollmentNumber: studentTokenData.enrollmentNumber } },
        include: {
          drive: { select: { companyName: true, roleName: true, driveDate: true, status: true } },
        },
        take: registrationsLimit,
        skip: (registrationsPage - 1) * registrationsLimit,
        orderBy: { createdAt: "desc" },
      }),
      // Get student's memories (limited)
      db.memory.findMany({
        where: { studentId: studentData.id },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
      // Count total active drives
      db.placementDrive.count({ where: { status: "active" } }),
      // Count total registrations
      db.driveRegistration.count({ where: { student: { enrollmentNumber: studentTokenData.enrollmentNumber } } }),
    ]);

    const registeredDriveIds = registrations.map((r: any) => r.driveId);

    return NextResponse.json({
      success: true,
      student: studentData,
      drives: drives.map((d: any) => ({
        ...d,
        isRegistered: registeredDriveIds.includes(d.id),
      })),
      drivesCount,
      drivesPage,
      drivesLimit,
      archivedDrives: archivedDrives.map((d: any) => ({
        ...d,
        isRegistered: registeredDriveIds.includes(d.id),
      })),
      registrations,
      registrationsCount,
      registrationsPage,
      registrationsLimit,
      memories,
    });
  } catch (error) {
    console.error("Student Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load dashboard" }, { status: 500 });
  }
}
