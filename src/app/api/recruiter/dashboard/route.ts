export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { placementDrive, driveRegistration, student, externalStudent } from "@/lib/schema";
import { eq, and, ne, inArray, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const recruiter = await getVerifiedAuthPayloadFromRequest(req, ["recruiter"]);
    if (!recruiter || !recruiter.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const applicantsLimit = Math.min(parseInt(searchParams.get("applicantsLimit") || "50", 10), 100);
    const applicantsPage = Math.max(1, parseInt(searchParams.get("applicantsPage") || "1", 10));

    const db = getDb();


    // Get recruiter's drives WITHOUT nested registrations (avoid N+1)
    const drives = await db.query.placementDrive.findMany({
      where: and(
        eq(placementDrive.recruiterId, recruiter.id),
        ne(placementDrive.status, "archived")
      ),
      columns: {
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
      },
      orderBy: (t, { desc }) => [desc(t.driveDate)],
    });

    // Single GROUP BY query instead of N separate count() calls
    const driveIds = drives.map((d: any) => d.id);
    const countMap = new Map<string, number>();
    if (driveIds.length > 0) {
      try {
        const countRows = await db.select({
          driveId: driveRegistration.driveId,
          cnt: count(),
        })
        .from(driveRegistration)
        .where(inArray(driveRegistration.driveId, driveIds))
        .groupBy(driveRegistration.driveId);

        for (const row of countRows) {
          countMap.set(row.driveId, Number(row.cnt));
        }
      } catch (error) {
        console.error("Group by query failed, falling back to individual counts:", error);
        // Fallback: use individual count queries if raw SQL fails
        const counts = await Promise.all(
          drives.map(async (drive: any) => {
            const res = await db.select({ count: count() }).from(driveRegistration).where(eq(driveRegistration.driveId, drive.id));
            return res[0]?.count || 0;
          })
        );
        drives.forEach((d: any, i: number) => countMap.set(d.id, counts[i]));
      }
    }

    // Get detailed registrations only for first drive (paginated)
    let applicants: any[] = [];
    let applicantsCount = 0;

    
    const driveParams = searchParams.get("driveId")
    const targetDriveId = driveParams || drives[0]?.id

    if (drives.length > 0 && targetDriveId) {
      const [applicantsResult, countResult] = await Promise.all([
        db.query.driveRegistration.findMany({
          where: eq(driveRegistration.driveId, targetDriveId),
          columns: {
            id: true,
            attended: true,
            createdAt: true,
            status: true,
            studentId: true,
            externalStudentId: true,
          },
          with: {
            drive: {
              columns: {
                roleName: true,
                companyName: true,
              }
            },
            student: {
              columns: {
                profileImageUrl: true,
              }
            },
            externalStudent: {
              columns: {
                profileImageUrl: true,
              }
            }
          },
          limit: applicantsLimit,
          offset: (applicantsPage - 1) * applicantsLimit,
          orderBy: (t, { desc }) => [desc(t.createdAt)],
        }),
        db.select({ count: count() }).from(driveRegistration).where(eq(driveRegistration.driveId, targetDriveId))
      ]);

      applicants = applicantsResult;
      applicantsCount = countResult[0]?.count || 0;

      // Fetch student/external data separately (not nested)
      const studentIds = applicants.filter(a => a.studentId).map(a => a.studentId as string);
      const externalIds = applicants.filter(a => a.externalStudentId).map(a => a.externalStudentId as string);

      const [students, externalStudents] = await Promise.all([
        (studentIds.length > 0
          ? db.query.student.findMany({
              where: inArray(student.id, studentIds),
              columns: { id: true, name: true, enrollmentNumber: true, branch: true, cgpa: true, email: true, profileImageUrl: true, collegeName: true }
            })
          : Promise.resolve([])) as Promise<any[]>,
        (externalIds.length > 0
          ? db.query.externalStudent.findMany({
              where: inArray(externalStudent.id, externalIds),
              columns: { id: true, name: true, collegeName: true, branch: true, cgpa: true, email: true, profileImageUrl: true }
            })
          : Promise.resolve([])) as Promise<any[]>,
      ]);

      const studentMap = new Map(students.map(s => [s.id, s] as const));
      const externalMap = new Map(externalStudents.map(e => [e.id, e] as const));

      applicants = applicants.map((a: any) => {
        const studentData = a.studentId ? studentMap.get(a.studentId) : null;
        const externalData = a.externalStudentId ? externalMap.get(a.externalStudentId) : null;
        const data = studentData || externalData;

        return {
          id: a.id,
          attended: a.attended,
          status: a.status,
          createdAt: a.createdAt,
          name: data?.name || "Unknown",
          college: data?.collegeName || "RGI",
          branch: data?.branch || "",
          cgpa: data?.cgpa || 0,
          email: data?.email || "",
          type: studentData ? "internal" : "external",
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
      registrationCount: countMap.get(d.id) || 0,
      applicants: d.applicants
    }));

    let totalApplicants = 0;
    countMap.forEach(count => { totalApplicants += count; });

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
