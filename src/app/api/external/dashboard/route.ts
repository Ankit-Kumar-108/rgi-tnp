export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";
import { driveRegistrationTemplate } from "@/lib/email-templates";
import { sendEmail } from "@/lib/send-email";

async function getExternalFromToken(req: NextRequest) {
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
    const ext = await getExternalFromToken(req);
    if (!ext) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Pagination parameters
    const { searchParams } = new URL(req.url);
    const drivesLimit = Math.min(parseInt(searchParams.get("drivesLimit") || "50", 10), 100);
    const registrationsLimit = Math.min(parseInt(searchParams.get("registrationsLimit") || "50", 10), 100);
    const drivesPage = Math.max(1, parseInt(searchParams.get("drivesPage") || "1", 10));
    const registrationsPage = Math.max(1, parseInt(searchParams.get("registrationsPage") || "1", 10));

    const db = getDb();
    const student = await db.externalStudent.findUnique({ where: { id: ext.id } });
    if (!student) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    // Parallel fetches for better performance
    const [drives, archivedDrives, registrations, drivesCount, registrationsCount] = await Promise.all([
      // Get open & active drives with pagination
      db.placementDrive.findMany({
        where: {
          status: "active",
          driveType: { in: ["Open", "Pool"] },
        },
        take: drivesLimit,
        skip: (drivesPage - 1) * drivesLimit,
        orderBy: { driveDate: "asc" },
      }),
      // Get archived drives (limited)
      db.placementDrive.findMany({
        where: {
          status: "completed",
          driveType: { in: ["Open", "Pool"] }
        },
        take: 10,
        orderBy: { driveDate: "desc" }
      }),
      // Get registrations with pagination
      db.driveRegistration.findMany({
        where: { externalStudentId: student.id },
        include: {
          drive: { select: { companyName: true, roleName: true, driveDate: true, status: true } },
        },
        take: registrationsLimit,
        skip: (registrationsPage - 1) * registrationsLimit,
        orderBy: { createdAt: "desc" },
      }),
      // Count total open drives
      db.placementDrive.count({
        where: {
          status: "active",
          driveType: { in: ["Open", "Pool"] },
        }
      }),
      // Count total registrations
      db.driveRegistration.count({ where: { externalStudentId: student.id } }),
    ]);

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
    const ext = await getExternalFromToken(req);
    if (!ext) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { driveId: string };
    const db = getDb();

    const student = await db.externalStudent.findUnique({ where: { id: ext.id } });
    if (!student || !student.isVerified) {
      return NextResponse.json({ success: false, message: "You must verify your email before registering." }, { status: 403 });
    }

    const drive = await db.placementDrive.findUnique({ where: { id: body.driveId } });
    if (!drive || drive.status !== "active" || !["Open", "Pool"].includes(drive.driveType)) {
      return NextResponse.json({ success: false, message: "Drive not available" }, { status: 400 });
    }

    const existing = await db.driveRegistration.findFirst({
      where: { driveId: body.driveId, externalStudentId: ext.id },
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
    if (student.cgpa < drive.minCGPA) {
      return NextResponse.json({ success: false, message: "CGPA requirement not met" }, { status: 403 });
    }

    await db.driveRegistration.create({
      data: { driveId: body.driveId, externalStudentId: ext.id },
    });
    // Send Drive Registration Confirmation Email 
    try {
      const emailResult = await sendEmail({
        to: student.email,
        subject: `Registered for ${drive.companyName} Drive`,
        html: driveRegistrationTemplate(student.name, drive.companyName, drive.driveDate.toDateString(), drive.roleName),
      })

      if (!emailResult.success) {
        console.warn("Drive registration email failed to send:", emailResult.error);
        return NextResponse.json({ success: true, message: "Registered for the drive, but failed to send confirmation email" }, { status: 200 });

      }
    } catch (emailError) {
      console.error("Failed to send drive registration email:", emailError);
      return NextResponse.json({ success: false, message: "Registered for the drive, but failed to send confirmation email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.error("External Registration Error:", error);
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
