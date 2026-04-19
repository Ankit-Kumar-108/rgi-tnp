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

    const { searchParams } = new URL(req.url);
    const applicantsLimit = Math.min(parseInt(searchParams.get("applicantsLimit") || "50", 10), 100);
    const applicantsPage = Math.max(1, parseInt(searchParams.get("applicantsPage") || "1", 10));

    const db = getDb();

    // Get recruiter's drives WITHOUT nested registrations (avoid N+1)
    const drives = await db.placementDrive.findMany({
      where: { 
        recruiterId: recruiter.id,
        status: { not: "archived" }
      },
      select: {
        id: true,
        companyName: true,
        roleName: true,
        jobDescription: true,
        ctc: true,
        driveDate: true,
        driveType: true,
        status: true,
        eligibleBranches: true,
        minCGPA: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { driveDate: "desc" },
    });

    // Parallel fetch: count applicants for each drive efficiently
    const registrationCounts = await Promise.all(
      drives.map(drive =>
        db.driveRegistration.count({
          where: { driveId: drive.id }
        })
      )
    );

    // Get detailed registrations only for first drive (paginated)
    let applicants: any[] = [];
    let applicantsCount = 0;

    if (drives.length > 0) {
      const firstDriveId = drives[0].id;
      [applicants, applicantsCount] = await Promise.all([
        db.driveRegistration.findMany({
          where: { driveId: firstDriveId },
          select: {
            id: true,
            attended: true,
            createdAt: true,
            status: true,
            studentId: true,
            externalStudentId: true,
          },
          take: applicantsLimit,
          skip: (applicantsPage - 1) * applicantsLimit,
          orderBy: { createdAt: "desc" },
        }),
        db.driveRegistration.count({
          where: { driveId: firstDriveId }
        })
      ]);

      // Fetch student/external data separately (not nested)
      const studentIds = applicants.filter(a => a.studentId).map(a => a.studentId);
      const externalIds = applicants.filter(a => a.externalStudentId).map(a => a.externalStudentId);

      const [students, externalStudents] = await Promise.all([
        studentIds.length > 0
          ? db.student.findMany({
              where: { id: { in: studentIds } },
              select: { id: true, name: true, enrollmentNumber: true, branch: true, cgpa: true, email: true }
            })
          : Promise.resolve([]),
        externalIds.length > 0
          ? db.externalStudent.findMany({
              where: { id: { in: externalIds } },
              select: { id: true, name: true, collegeName: true, branch: true, cgpa: true, email: true }
            })
          : Promise.resolve([]),
      ]);

      const studentMap = new Map(students.map(s => [s.id, s]));
      const externalMap = new Map(externalStudents.map(e => [e.id, e]));

      applicants = applicants.map((a: any) => {
        const student = a.studentId ? studentMap.get(a.studentId) : null;
        const external = a.externalStudentId ? externalMap.get(a.externalStudentId) : null;
        const data = student || external;

        return {
          id: a.id,
          attended: a.attended,
          status: a.status,
          createdAt: a.createdAt,
          name: data?.name || "Unknown",
          college: data && 'collegeName' in data ? data.collegeName : "RGI",
          branch: data?.branch || "",
          cgpa: data?.cgpa || 0,
          email: data?.email || "",
          type: student ? "internal" : "external",
        };
      });
    }

    const formatted = drives.map((d: any, idx: number) => ({
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
      registrationCount: registrationCounts[idx],
    }));

    const totalApplicants = registrationCounts.reduce((sum, count) => sum + count, 0);

    return NextResponse.json({
      success: true,
      drives: formatted,
      firstDriveApplicants: applicants,
      applicantsPagination: {
        page: applicantsPage,
        limit: applicantsLimit,
        total: applicantsCount,
        totalPages: Math.ceil(applicantsCount / applicantsLimit),
      },
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
