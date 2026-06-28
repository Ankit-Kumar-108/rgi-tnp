export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student, placementDrive, driveRegistration, memory } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);
    
    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Pagination parameters
    const { searchParams } = new URL(req.url);
    const drivesLimit = Math.min(parseInt(searchParams.get("drivesLimit") || "50", 10), 100);
    const registrationsLimit = Math.min(parseInt(searchParams.get("registrationsLimit") || "50", 10), 100);
    const drivesPage = Math.max(1, parseInt(searchParams.get("drivesPage") || "1", 10));
    const registrationsPage = Math.max(1, parseInt(searchParams.get("registrationsPage") || "1", 10));

    const db = getDb();
    const studentData = await db.query.student.findFirst({
      where: eq(student.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: {
        id: true, name: true, enrollmentNumber: true, email: true,
        branch: true, semester: true, cgpa: true, isEmailVerified: true, isVerified: true,
        profileImageUrl: true, phoneNumber: true, course: true, batch: true,
        collegeName: true,
        resumeUrl: true, tenthPercentage: true, twelfthPercentage: true,
        activeBacklog: true, linkedinUrl: true, githubUrl: true,
        isProfileComplete: true, gender: true,
      },
    });

    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Parallel fetch for better performance
    const [drives, archivedDrives, registrations, memories, drivesCountResult, registrationsCountResult] = await Promise.all([
      // Get active drives with pagination
      db.query.placementDrive.findMany({
        where: eq(placementDrive.status, "active"),
        limit: drivesLimit,
        offset: (drivesPage - 1) * drivesLimit,
        orderBy: (t, { asc }) => [asc(t.driveDate)],
      }),
      // Get archived/completed drives
      db.query.placementDrive.findMany({
        where: eq(placementDrive.status, "completed"),
        limit: 10, // Limit archived drives
        orderBy: (t, { desc }) => [desc(t.driveDate)],
      }),
      // Get student's registrations with pagination
      db.query.driveRegistration.findMany({
        where: eq(driveRegistration.studentId, studentData.id),
        with: {
          drive: {
            columns: { companyName: true, roleName: true, driveDate: true, status: true }
          },
        },
        limit: registrationsLimit,
        offset: (registrationsPage - 1) * registrationsLimit,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
      // Get student's memories (limited)
      db.query.memory.findMany({
        where: eq(memory.studentId, studentData.id),
        limit: 20,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
      // Count total active drives
      db.select({ count: count() }).from(placementDrive).where(eq(placementDrive.status, "active")),
      // Count total registrations
      db.select({ count: count() }).from(driveRegistration).where(eq(driveRegistration.studentId, studentData.id)),
    ]);

    const drivesCount = drivesCountResult[0]?.count || 0;
    const registrationsCount = registrationsCountResult[0]?.count || 0;

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
