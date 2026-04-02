export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

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

    const db = getDb();
    const student = await db.externalStudent.findUnique({ where: { id: ext.id } });
    if (!student) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    // Show all open & active drives regardless of verification status
    const drives = await db.placementDrive.findMany({
      where: {
        status: "active",
        driveType: { in: ["Open", "Pool"] },
      },
      orderBy: { driveDate: "asc" },
    });

    const archivedDrives = await db.placementDrive.findMany({
      where: {
        status: "completed",
        driveType: { in: ["Open", "Pool"] }
      },
      orderBy: { driveDate: "desc" }
    });

    const registrations = await db.driveRegistration.findMany({
      where: { externalStudentId: student.id },
      include: {
        drive: { select: { companyName: true, roleName: true, driveDate: true, status: true } },
      },
    });

    const registeredDriveIds = registrations.map((r: any) => r.driveId);

    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, collegeName: student.collegeName,
        branch: student.branch, cgpa: student.cgpa, email: student.email,
        isVerified: student.isVerified, resumeUrl: student.resumeUrl,
        profileImageUrl: student.profileImageUrl,
        course: student.course, batch: student.batch,
      },
      drives: drives.map((d: any) => ({ ...d, isRegistered: registeredDriveIds.includes(d.id) })),
      archivedDrives: archivedDrives.map((d: any) => ({ ...d, isRegistered: registeredDriveIds.includes(d.id) })),
      registrations,
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

    if (!drive.eligibleBranches.includes(student.branch)) {
      return NextResponse.json({ success: false, message: "Branch not eligible" }, { status: 403 });
    }
    if (student.cgpa < drive.minCGPA) {
      return NextResponse.json({ success: false, message: "CGPA requirement not met" }, { status: 403 });
    }

    await db.driveRegistration.create({
      data: { driveId: body.driveId, externalStudentId: ext.id },
    });

    return NextResponse.json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.error("External Registration Error:", error);
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
