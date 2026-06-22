export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedAuthPayloadFromRequest } from "@/lib/auth-jwt";
import { student as studentTable, volunteer as volunteerTable, placementDrive, driveRegistration } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const studentTokenData = await getVerifiedAuthPayloadFromRequest(req, ["student"]);

    if (!studentTokenData || !studentTokenData.enrollmentNumber) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();

    // Verify this user is a volunteer
    const studentData = await db.query.student.findFirst({
      where: eq(studentTable.enrollmentNumber, studentTokenData.enrollmentNumber),
      columns: { id: true }
    });

    if (!studentData) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const volunteerData = await db.query.volunteer.findFirst({
      where: eq(volunteerTable.studentId, studentData.id),
      columns: { id: true, isActive: true }
    });

    if (!volunteerData || !volunteerData.isActive) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found or inactive" },
        { status: 403 }
      );
    }

    // Parse pagination & filter params
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const skip = (page - 1) * limit;
    const driveIdParam = searchParams.get("driveId");

    // Get all active drives (lightweight — just id + name for the drive selector)
    const activeDrives = await db.query.placementDrive.findMany({
      where: eq(placementDrive.status, "active"),
      columns: {
        id: true,
        companyName: true,
        roleName: true,
        ctc: true,
        minCGPA: true,
        driveDate: true,
        jobType: true
      }
    });

    // If no drives exist, return empty
    if (activeDrives.length === 0) {
      return NextResponse.json({
        success: true,
        students: [],
        activeDrives: [],
        totalCount: 0,
        page,
        limit,
        selectedDriveId: null,
      }, { status: 200 });
    }

    // Default to first active drive if no driveId provided
    const selectedDriveId = driveIdParam || activeDrives[0].id;
    const selectedDrive = activeDrives.find(d => d.id === selectedDriveId) || activeDrives[0];

    // Paginated single-drive query
    const [registrations, countResult] = await Promise.all([
      db.query.driveRegistration.findMany({
        where: eq(driveRegistration.driveId, selectedDrive.id),
        with: {
          student: {
            columns: {
              id: true,
              name: true,
              enrollmentNumber: true,
              email: true,
              branch: true,
              semester: true,
              cgpa: true,
              profileImageUrl: true,
              batch: true
            }
          },
          externalStudent: {
            columns: {
              id: true,
              name: true,
              enrollmentNumber: true,
              email: true,
              branch: true,
              semester: true,
              cgpa: true,
              profileImageUrl: true,
              collegeName: true
            }
          },
          alumni: {
            columns: {
              id: true,
              name: true,
              enrollmentNumber: true,
              personalEmail: true,
              branch: true,
              batch: true,
              profileImageUrl: true,
              cgpa: true
            }
          }
        },
        limit: limit,
        offset: skip,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
      db.select({ count: count() }).from(driveRegistration).where(eq(driveRegistration.driveId, selectedDrive.id)),
    ]);

    const totalCount = countResult[0]?.count || 0;

    // Format registrations into flat student objects
    const students = registrations.map(reg => {
      const studentData = reg.student || reg.externalStudent || reg.alumni;
      if (!studentData) return null;

      const studentType = reg.student ? "internal" : reg.externalStudent ? "external" : "alumni";
      const email = reg.student?.email || reg.externalStudent?.email || reg.alumni?.personalEmail || "";
      const batch = reg.student?.batch || reg.alumni?.batch || "";
      const cgpa = reg.student?.cgpa ?? reg.externalStudent?.cgpa ?? reg.alumni?.cgpa ?? 0;
      const semester = reg.student?.semester ?? reg.externalStudent?.semester ?? 0;
      const profileImageUrl = reg.student?.profileImageUrl ?? reg.externalStudent?.profileImageUrl ?? reg.alumni?.profileImageUrl ?? undefined;
      const collegeName = reg.externalStudent?.collegeName ?? (reg.alumni ? "Alumni" : "RGI");

      return {
        registrationId: reg.id,
        driveId: selectedDrive.id,
        studentId: studentData.id,
        studentType,
        name: studentData.name,
        enrollmentNumber: studentData.enrollmentNumber,
        email,
        branch: studentData.branch,
        cgpa,
        semester,
        batch,
        collegeName,
        profileImageUrl,
        companyName: selectedDrive.companyName,
        roleName: selectedDrive.roleName,
        ctc: selectedDrive.ctc,
        minCGPA: selectedDrive.minCGPA,
        jobType: selectedDrive.jobType,
        driveDate: selectedDrive.driveDate,
        status: reg.status,
        appliedAt: reg.createdAt
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      students,
      activeDrives,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      selectedDriveId: selectedDrive.id,
    }, { status: 200 });

  } catch (error) {
    console.error("Error in students-overview:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
