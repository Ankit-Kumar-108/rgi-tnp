export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";

export async function GET(req: NextRequest) {
  try {
    const recruiter = await getVerifiedAuthPayloadFromRequest(req, ["recruiter"]);
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
        genderPreference: true,
        duration: true,
        interviewProcess: true,
        minBatch: true,
        maxBatch: true,
        course: true,
        jobType: true,
        allowAlumni: true,
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

    
    const driveParams = searchParams.get("driveId")
    const targetDriveId = driveParams || drives[0]?.id

    if (drives.length > 0) {
      [applicants, applicantsCount] = await Promise.all([
        db.driveRegistration.findMany({
          where: { driveId: targetDriveId },
          select: {
            id: true,
            attended: true,
            createdAt: true,
            status: true,
            studentId: true,
            externalStudentId: true,
            drive: {
              select :{
                roleName: true,
                companyName: true
              }
            },
            student: {
              select: {
                    profileImageUrl: true
              }
            },
            externalStudent: {
              select : {
                profileImageUrl: true
              }
            }
          },
          take: applicantsLimit,
          skip: (applicantsPage - 1) * applicantsLimit,
          orderBy: { createdAt: "desc" },
        }),
        db.driveRegistration.count({
          where: { driveId: targetDriveId }
        })
      ]);

      // Fetch student/external data separately (not nested)
      const studentIds = applicants.filter(a => a.studentId).map(a => a.studentId);
      const externalIds = applicants.filter(a => a.externalStudentId).map(a => a.externalStudentId);

      const [students, externalStudents] = await Promise.all([
        studentIds.length > 0
          ? db.student.findMany({
              where: { id: { in: studentIds } },
              select: { id: true, name: true, enrollmentNumber: true, branch: true, cgpa: true, email: true, profileImageUrl: true }
            })
          : Promise.resolve([]),
        externalIds.length > 0
          ? db.externalStudent.findMany({
              where: { id: { in: externalIds } },
              select: { id: true, name: true, collegeName: true, branch: true, cgpa: true, email: true, profileImageUrl: true }
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
          profileImageUrl: data?.profileImageUrl || a.student?.profileImageUrl || a.externalStudent?.profileImageUrl || null,
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
      genderPreference: d.genderPreference,
      duration: d.duration,
      interviewProcess: d.interviewProcess,
      minBatch: d.minBatch,
      maxBatch: d.maxBatch,
      course: d.course,
      jobType: d.jobType,
      allowAlumni: d.allowAlumni,
      registrationCount: registrationCounts[idx],
      applicants: d.applicants
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
