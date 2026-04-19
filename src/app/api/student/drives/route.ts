export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";
import { sendEmail } from "@/lib/send-email";
import { driveRegistrationTemplate } from "@/lib/email-templates";
import { email } from "zod";

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

// Helper function to extract batch number from batch string (e.g., "2023-1" -> 1)
function extractBatchNumber(batchStr: string): number {
  return parseInt(batchStr.split('-').pop() || "0", 10);
}

// Helper function to parse eligible branches as Set for O(1) lookup
function parseBranches(branchesStr: string): Set<string> {
  // Assuming branches are comma-separated or already a single value
  return new Set(
    branchesStr
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0)
  );
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
      where: { driveId, studentId: studentData.id }, // Optimized: use studentId directly
    });
    if (existing) {
      return NextResponse.json({ success: false, message: "Already registered for this drive" }, { status: 409 });
    }

    // Parse batch numbers ONCE (optimization)
    const studentBatchNum = extractBatchNumber(studentData.batch);
    const minBatchNum = extractBatchNumber(drive.minBatch);
    const maxBatchNum = extractBatchNumber(drive.maxBatch);

    // Check: batch eligible?
    if (!isNaN(studentBatchNum) && !isNaN(minBatchNum) && !isNaN(maxBatchNum) && 
        (studentBatchNum < minBatchNum || studentBatchNum > maxBatchNum)) {
      return NextResponse.json(
        { success: false, message: `Your batch is not eligible. Eligible range: ${drive.minBatch} to ${drive.maxBatch}` },
        { status: 403 }
      );
    }

    // Check: course eligible?
    if (drive.course !== "All" && !drive.course.includes(studentData.course)) {
      return NextResponse.json(
        { success: false, message: `Your course (${studentData.course}) is not eligible for this drive.` },
        { status: 403 }
      );
    }

    // Check: branch eligible? (Using Set for O(1) lookup instead of String.includes which is O(n))
    const eligibleBranchesSet = parseBranches(drive.eligibleBranches);
    if (!eligibleBranchesSet.has(studentData.branch)) {
      return NextResponse.json(
        { success: false, message: "Your branch is not eligible for this drive" },
        { status: 403 }
      );
    }

    // Check: CGPA eligible?
    if (studentData.cgpa < drive.minCGPA) {
      return NextResponse.json(
        { success: false, message: `Minimum CGPA ${drive.minCGPA} required` },
        { status: 403 }
      );
    }

    // Register
    await db.driveRegistration.create({
      data: { driveId, studentId: studentData.id },
    });

    // Send Drive Registration Confirmation Email 
    try {
      const emailResult = await sendEmail({
        to: studentData.email,
        subject: `Registered for ${drive.companyName} Drive`,
        html: driveRegistrationTemplate(studentData.name, drive.companyName, drive.driveDate.toDateString(), drive.roleName),
      })

      if(!emailResult.success) {
        console.warn("Drive registration email failed to send:", emailResult.error);
        return NextResponse.json({ success: true, message: "Registered for the drive, but failed to send confirmation email" }, { status: 200 });

      }
    } catch (emailError) {
      console.error("Failed to send drive registration email:", emailError);
      return NextResponse.json({ success: false, message: "Registered for the drive, but failed to send confirmation email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Successfully registered for the drive" });
  } catch (error) {
    console.error("Drive Registration Error:", error);
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
