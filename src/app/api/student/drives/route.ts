export const runtime = 'edge';
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

// POST: Register for a drive
export async function POST(req: NextRequest) {
  try {
    const student = await getStudentFromToken(req);
    if (!student) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { driveId: string };
    const { driveId } = body;
    const db = getDb();

    const studentData = await db.student.findUnique({ where: { enrollmentNumber: student.enrollmentNumber } });
    if (!studentData) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    const drive = await db.placementDrive.findUnique({ where: { id: driveId } });
    if (!drive || drive.status !== "active") {
      return NextResponse.json({ success: false, message: "Drive not available" }, { status: 400 });
    }

    // Check: already registered?
    const existing = await db.driveRegistration.findFirst({
      where: { driveId, student: { enrollmentNumber: student.enrollmentNumber } },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: "Already registered for this drive" }, { status: 409 });
    }

    // Check: batch eligible?
    const studentBatchNum = parseInt(studentData.batch.split('-').pop() || "0", 10);
    const minBatchNum = parseInt(drive.minBatch.split('-').pop() || "0", 10);
    const maxBatchNum = parseInt(drive.maxBatch.split('-').pop() || "0", 10);
    if (!isNaN(studentBatchNum) && !isNaN(minBatchNum) && !isNaN(maxBatchNum) && (studentBatchNum < minBatchNum || studentBatchNum > maxBatchNum)) {
      return NextResponse.json({ success: false, message: `Your batch is not eligible. Eligible range: ${drive.minBatch} to ${drive.maxBatch}` }, { status: 403 });
    }

    // Check: branch eligible?
    if (!drive.eligibleBranches.includes(studentData.branch)) {
      return NextResponse.json({ success: false, message: "Your branch is not eligible for this drive" }, { status: 403 });
    }

    // Check: CGPA eligible?
    if (studentData.cgpa < drive.minCGPA) {
      return NextResponse.json({ success: false, message: `Minimum CGPA ${drive.minCGPA} required` }, { status: 403 });
    }

    // Register
    await db.driveRegistration.create({
      data: { driveId, studentId: studentData.id },
    });

    return NextResponse.json({ success: true, message: "Successfully registered for the drive" });
  } catch (error) {
    console.error("Drive Registration Error:", error);
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
