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

export async function GET(req: NextRequest) {
  try {
    const recruiter = await getRecruiterFromToken(req);
    if (!recruiter) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // Get recruiter's drives with registration counts
    const drives = await db.placementDrive.findMany({
      where: { recruiterId: recruiter.id },
      include: {
        _count: { select: { registrations: true } },
        registrations: {
          include: {
            student: { select: { name: true, enrollmentNumber: true, branch: true, cgpa: true, email: true } },
            externalStudent: { select: { name: true, collegeName: true, branch: true, cgpa: true, email: true } },
          },
        },
      },
      orderBy: { driveDate: "desc" },
    });

    const formatted = drives.map((d: any) => ({
      id: d.id,
      companyName: d.companyName,
      roleName: d.roleName,
      jobDescription: d.jobDescription,
      ctc: d.ctc,
      driveDate: d.driveDate,
      driveType: d.driveType,
      status: d.status,
      eligibleBranches: d.eligibleBranches,
      minCGPA: d.minCGPA,
      registrationCount: d._count.registrations,
      applicants: d.registrations.map((r: any) => ({
        id: r.id,
        attended: r.attended,
        createdAt: r.createdAt,
        name: r.student?.name || r.externalStudent?.name || "Unknown",
        college: r.externalStudent?.collegeName || "RGI",
        branch: r.student?.branch || r.externalStudent?.branch || "",
        cgpa: r.student?.cgpa || r.externalStudent?.cgpa || 0,
        email: r.student?.email || r.externalStudent?.email || "",
        type: r.student ? "internal" : "external",
      })),
    }));

    const totalApplicants = formatted.reduce((sum: number, d: any) => sum + d.registrationCount, 0);

    return NextResponse.json({
      success: true,
      drives: formatted,
      stats: {
        totalDrives: drives.length,
        activeDrives: drives.filter((d: any) => d.status === "active").length,
        pendingDrives: drives.filter((d: any) => d.status === "pending").length,
        totalApplicants,
      },
    });
  } catch (error) {
    console.error("Recruiter Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load dashboard" }, { status: 500 });
  }
}
