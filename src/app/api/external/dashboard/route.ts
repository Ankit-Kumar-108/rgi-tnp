export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { driveRegistrationTemplate } from "@/lib/email-templates";
import { NotificationService } from "@/lib/notification-service";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { formatCgpaCriteria, meetsCgpaCriteria } from "@/lib/cgpa-utils";
import { runInBackground } from "@/lib/background";
import { externalStudent, placementDrive, driveRegistration } from "@/lib/schema";
import { eq, and, inArray, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const ext = await getVerifiedAuthPayloadFromRequest(req, ["external_student"]);
    if (!ext || !ext.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Pagination parameters
    const { searchParams } = new URL(req.url);
    const drivesLimit = Math.min(parseInt(searchParams.get("drivesLimit") || "50", 10), 100);
    const registrationsLimit = Math.min(parseInt(searchParams.get("registrationsLimit") || "50", 10), 100);
    const drivesPage = Math.max(1, parseInt(searchParams.get("drivesPage") || "1", 10));
    const registrationsPage = Math.max(1, parseInt(searchParams.get("registrationsPage") || "1", 10));

    const db = getDb();
    const student = await db.query.externalStudent.findFirst({ where: eq(externalStudent.id, ext.id) });
    if (!student) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    // Parallel fetches for better performance
    const [drives, archivedDrives, registrations, drivesCountResult, registrationsCountResult] = await Promise.all([
      // Get open & active drives with pagination
      db.query.placementDrive.findMany({
        where: and(
          eq(placementDrive.status, "active"),
          inArray(placementDrive.driveType, ["Open", "Pool"])
        ),
        limit: drivesLimit,
        offset: (drivesPage - 1) * drivesLimit,
        orderBy: (t, { asc }) => [asc(t.driveDate)],
      }),
      // Get archived drives (limited)
      db.query.placementDrive.findMany({
        where: and(
          eq(placementDrive.status, "completed"),
          inArray(placementDrive.driveType, ["Open", "Pool"])
        ),
        limit: 10,
        orderBy: (t, { desc }) => [desc(t.driveDate)]
      }),
      // Get registrations with pagination
      db.query.driveRegistration.findMany({
        where: eq(driveRegistration.externalStudentId, student.id),
        with: {
          drive: { columns: { companyName: true, roleName: true, driveDate: true, status: true } },
        },
        limit: registrationsLimit,
        offset: (registrationsPage - 1) * registrationsLimit,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
      // Count total open drives
      db.select({ count: count() }).from(placementDrive).where(
        and(
          eq(placementDrive.status, "active"),
          inArray(placementDrive.driveType, ["Open", "Pool"])
        )
      ),
      // Count total registrations
      db.select({ count: count() }).from(driveRegistration).where(eq(driveRegistration.externalStudentId, student.id)),
    ]);

    const drivesCount = drivesCountResult[0]?.count || 0;
    const registrationsCount = registrationsCountResult[0]?.count || 0;

    const registeredDriveIds = registrations.map((r: any) => r.driveId);

    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, collegeName: student.collegeName,
        branch: student.branch, cgpa: student.cgpa, email: student.email,
        isVerified: student.isVerified, resumeUrl: student.resumeUrl,
        profileImageUrl: student.profileImageUrl,
        course: student.course, batch: student.batch, semester: student.semester,
        tenthPercentage: student.tenthPercentage,
        twelfthPercentage: student.twelfthPercentage,
        activeBacklog: student.activeBacklog,
        linkedinUrl: student.linkedinUrl, githubUrl: student.githubUrl,
      },
      drives: drives.map((d: any) => ({ ...d, isRegistered: registeredDriveIds.includes(d.id) })),
      drivesCount,
      drivesPage,
      drivesLimit,
      archivedDrives: archivedDrives.map((d: any) => ({ ...d, isRegistered: registeredDriveIds.includes(d.id) })),
      registrations,
      registrationsCount,
      registrationsPage,
      registrationsLimit,
    });
  } catch (error) {
    console.error("External Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

// POST: Register for an open drive
export async function POST(req: NextRequest) {
  try {
    const ext = await getVerifiedAuthPayloadFromRequest(req, ["external_student"]);
    if (!ext || !ext.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { driveId: string };
    const db = getDb();

    const student = await db.query.externalStudent.findFirst({ where: eq(externalStudent.id, ext.id) });
    if (!student || !student.isVerified) {
      return NextResponse.json({ success: false, message: "You must verify your email before registering." }, { status: 403 });
    }

    const drive = await db.query.placementDrive.findFirst({ where: eq(placementDrive.id, body.driveId) });
    if (!drive || drive.status !== "active" || !["Open", "Pool"].includes(drive.driveType)) {
      return NextResponse.json({ success: false, message: "Drive not available" }, { status: 400 });
    }

    const existing = await db.query.driveRegistration.findFirst({
      where: and(
        eq(driveRegistration.driveId, body.driveId),
        eq(driveRegistration.externalStudentId, ext.id)
      ),
    });
    if (existing) {
      return NextResponse.json({ success: false, message: "Already registered" }, { status: 409 });
    }

    // Batch eligibility check
    const studentBatchNum = parseInt(student.batch.split('-').pop() || "0", 10);
    const minBatchNum = parseInt(drive.minBatch.split('-').pop() || "0", 10);
    const maxBatchNum = parseInt(drive.maxBatch.split('-').pop() || "0", 10);
    if (!isNaN(studentBatchNum) && !isNaN(minBatchNum) && !isNaN(maxBatchNum) && (studentBatchNum < minBatchNum || studentBatchNum > maxBatchNum)) {
      return NextResponse.json({ success: false, message: `Your batch is not eligible. Eligible range: ${drive.minBatch} to ${drive.maxBatch}` }, { status: 403 });
    }

    // Course eligibility check
    if (drive.course !== "All" && !drive.course.includes(student.course)) {
      return NextResponse.json({ success: false, message: "Course not eligible" }, { status: 403 });
    }
    if (!drive.eligibleBranches.includes(student.branch)) {
      return NextResponse.json({ success: false, message: "Branch not eligible" }, { status: 403 });
    }
    if (!meetsCgpaCriteria(student.cgpa, drive.minCGPA)) {
      return NextResponse.json(
        { success: false, message: `Minimum CGPA ${formatCgpaCriteria(drive.minCGPA)} required` },
        { status: 403 }
      );
    }

    // Gender eligibility check
    if (drive.genderPreference !== "Both" && student.gender !== drive.genderPreference) {
      return NextResponse.json({ success: false, message: `This drive is open to ${drive.genderPreference} candidates only` }, { status: 403 });
    }

    await db.insert(driveRegistration).values({
      driveId: body.driveId,
      externalStudentId: ext.id,
      createdAt: new Date().toISOString(),
    });

    // Fire-and-forget: send email + in-app notification in background
    runInBackground(
      NotificationService.notifyUser({
        email: {
          to: student.email,
          subject: `Registered for ${drive.companyName} Drive`,
          html: driveRegistrationTemplate(student.name, drive.companyName, drive.driveDate.toDateString(), drive.roleName),
          template: "drive_registration",
          approvalId: student.id,
          approvalType: "external_student",
          actionType: "drive_registration",
        },
        inApp: {
          type: "external_student",
          title: "Drive Registration",
          message: `Registered for ${drive.companyName} Drive`,
        },
        triggeredBy: "System",
        recipient: {
          id: student.id,
          type: "external_student",
        }
      }),
      "external-student-drive-registration-email"
    );

    return NextResponse.json({ success: true, message: "Registered for the drive" }, { status: 200 });
  } catch (error) {
    console.error("External Registration Error:", error);
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
