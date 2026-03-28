export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as jose from "jose";

async function getRecruiterFromToken(req: NextRequest) {
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

// POST: Create a new drive request
export async function POST(req: NextRequest) {
  try {
    const recruiter = await getRecruiterFromToken(req);
    if (!recruiter) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      companyName: string;
      roleName: string;
      jobDescription: string;
      ctc: string;
      eligibleBranches: string;
      minCGPA: number;
      minBatch: string;
      maxBatch: string;
      course: string;
      driveDate: string;
      driveType: string;
      jobType: string;
      isRegistered?: boolean;
    };

    const db = getDb();

    const drive = await db.placementDrive.create({
      data: {
        companyName: body.companyName,
        roleName: body.roleName,
        jobDescription: body.jobDescription,
        ctc: body.ctc,
        eligibleBranches: body.eligibleBranches,
        minCGPA: body.minCGPA,
        minBatch: body.minBatch,
        maxBatch: body.maxBatch,
        course: body.course,
        driveDate: new Date(body.driveDate),
        driveType: body.driveType || "Closed",
        jobType: body.jobType || "Full-Time",
        status: "pending",
        recruiter: { connect: { id: recruiter.id } },
      },
    });

    return NextResponse.json({ success: true, message: "Drive request submitted for admin approval", drive });
  } catch (error) {
    console.error("Create Drive Error:", error);
    return NextResponse.json({ success: false, message: "Failed to create drive" }, { status: 500 });
  }
}

// PUT: Update an existing drive request
export async function PUT(req: NextRequest) {
  try {
    const recruiter = await getRecruiterFromToken(req);
    if (!recruiter) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      id: string;
      companyName: string;
      roleName: string;
      jobDescription: string;
      ctc: string;
      eligibleBranches: string;
      minCGPA: number;
      minBatch: string;
      maxBatch: string;
      course: string;
      driveDate: string;
      driveType: string;
      jobType: string;
    };

    const db = getDb();

    // Ensure the drive actually belongs to this recruiter
    const existingDrive = await db.placementDrive.findUnique({
      where: { id: body.id },
    });

    if (!existingDrive || existingDrive.recruiterId !== recruiter.id) {
      return NextResponse.json({ success: false, message: "Unauthorized to edit this drive" }, { status: 403 });
    }

    const updatedDrive = await db.placementDrive.update({
      where: { id: body.id },
      data: {
        companyName: body.companyName,
        roleName: body.roleName,
        jobDescription: body.jobDescription,
        ctc: body.ctc,
        eligibleBranches: body.eligibleBranches,
        minCGPA: body.minCGPA,
        minBatch: body.minBatch,
        maxBatch: body.maxBatch,
        course: body.course,
        driveDate: new Date(body.driveDate),
        driveType: body.driveType || existingDrive.driveType,
        jobType: body.jobType || existingDrive.jobType,
      },
    });

    return NextResponse.json({ success: true, message: "Drive updated successfully", drive: updatedDrive });
  } catch (error) {
    console.error("Update Drive Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update drive" }, { status: 500 });
  }
}
