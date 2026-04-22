export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { placementOpportunityTemplate } from "@/lib/email-templates";
import { runInBackground } from "@/lib/background";

type ApprovedDrive = {
  id: string;
  companyName: string;
  roleName: string;
  ctc: string;
  driveDate: Date;
  driveType: string;
  eligibleBranches: string;
  minBatch: string;
  maxBatch: string;
  course: string;
};

const DRIVE_NOTIFICATION_BATCH_SIZE = 50;

function parsePagination(req: NextRequest, defaultLimit = 200) {
  const { searchParams } = new URL(req.url);
  const parsedLimit = Number.parseInt(
    searchParams.get("limit") || String(defaultLimit),
    10,
  );
  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);

  const limit = Number.isNaN(parsedLimit) ? defaultLimit : Math.max(1, parsedLimit);
  const page = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);

  return {
    searchParams,
    limit,
    page,
    skip: (page - 1) * limit,
  };
}

function parseEligibleValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function notifyEligibleStudentsForDrive(drive: ApprovedDrive) {
  const db = getDb();
  const eligibleBranches = parseEligibleValues(drive.eligibleBranches);
  const eligibleCourses =
    drive.course === "All" ? [] : parseEligibleValues(drive.course);

  const eligibleStudents = await db.student.findMany({
    where: {
      isEmailVerified: true,
      branch: { in: eligibleBranches },
      batch: {
        gte: drive.minBatch,
        lte: drive.maxBatch,
      },
      ...(eligibleCourses.length > 0
        ? { course: { in: eligibleCourses } }
        : {}),
    },
    select: {
      name: true,
      email: true,
    },
  });

  const driveDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(drive.driveDate));

  for (const studentsBatch of chunkArray(
    eligibleStudents.filter((student) => Boolean(student.email)),
    DRIVE_NOTIFICATION_BATCH_SIZE,
  )) {
    await Promise.allSettled(
      studentsBatch.map((student) =>
        sendEmail({
          to: student.email,
          subject: `New Opportunity: ${drive.companyName} is hiring!`,
          html: placementOpportunityTemplate(
            student.name,
            drive.companyName,
            drive.driveType,
            drive.ctc,
            `${drive.minBatch} - ${drive.maxBatch}`,
            drive.course,
            eligibleBranches.join(", "),
            driveDate,
            "https://ankit-dev.me/portal/students/dashboard",
          ),
        }),
      ),
    );
  }
}

async function sendApprovedDriveNotifications(driveIds: string[]) {
  const db = getDb();
  const approvedDrives = await db.placementDrive.findMany({
    where: { id: { in: driveIds }, status: "active" },
    select: {
      id: true,
      companyName: true,
      roleName: true,
      ctc: true,
      driveDate: true,
      driveType: true,
      eligibleBranches: true,
      minBatch: true,
      maxBatch: true,
      course: true,
    },
  });

  await Promise.allSettled(
    approvedDrives.map(async (drive) => {
      try {
        await notifyEligibleStudentsForDrive(drive);
      } catch (error) {
        console.error(
          `[DRIVE NOTIFICATION ERROR] Failed for drive ${drive.id}:`,
          error,
        );
      }
    }),
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams, limit, skip } = parsePagination(req);
    const type = searchParams.get("type") || "drives";
    const db = getDb();

    if (type === "drives") {
      const where = { status: "pending" };
      const [items, totalCount] = await Promise.all([
        db.placementDrive.findMany({
          where,
          include: {
            recruiter: { select: { name: true, company: true, email: true } },
          },
          orderBy: { driveDate: "desc" },
          take: limit,
          skip,
        }),
        db.placementDrive.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "studentFeedback") {
      const where = { isApproved: false };
      const [items, totalCount] = await Promise.all([
        db.studentFeedback.findMany({
          where,
          include: {
            student: {
              select: { name: true, enrollmentNumber: true, profileImageUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.studentFeedback.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "alumniFeedback") {
      const where = { isApproved: false };
      const [items, totalCount] = await Promise.all([
        db.alumniFeedback.findMany({
          where,
          include: {
            alumni: {
              select: { name: true, personalEmail: true, profileImageUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.alumniFeedback.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "corporateFeedback") {
      const where = { isApproved: false };
      const [items, totalCount] = await Promise.all([
        db.corporateFeedback.findMany({
          where,
          include: {
            recruiter: { select: { name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.corporateFeedback.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "referrals") {
      const where = { status: "pending" };
      const [items, totalCount] = await Promise.all([
        db.referral.findMany({
          where,
          include: {
            alumni: {
              select: { name: true, personalEmail: true, profileImageUrl: true },
            },
          },
          take: limit,
          skip,
        }),
        db.referral.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "external") {
      const where = { isVerified: false };
      const [items, totalCount] = await Promise.all([
        db.externalStudent.findMany({
          where,
          select: {
            id: true,
            name: true,
            collegeName: true,
            branch: true,
            cgpa: true,
            email: true,
            enrollmentNumber: true,
            resumeUrl: true,
            profileImageUrl: true,
            phoneNumber: true,
            batch: true,
            course: true,
            tenthPercentage: true,
            twelfthPercentage: true,
          },
          take: limit,
          skip,
        }),
        db.externalStudent.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "memories") {
      const where = {
        OR: [{ status: "pending_moderation" }, { status: "approved" }],
      };
      const [items, totalCount] = await Promise.all([
        db.memory.findMany({
          where,
          include: {
            student: {
              select: { name: true, enrollmentNumber: true, profileImageUrl: true },
            },
            alumni: {
              select: { name: true, enrollmentNumber: true, profileImageUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.memory.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "unverifiedStudents") {
      const where = { emailVerificationFailed: true };
      const [items, totalCount] = await Promise.all([
        db.student.findMany({
          where,
          select: {
            id: true,
            name: true,
            enrollmentNumber: true,
            email: true,
            branch: true,
            batch: true,
            course: true,
            cgpa: true,
            profileImageUrl: true,
            phoneNumber: true,
            emailVerificationError: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.student.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "unverifiedAlumni") {
      const where = { emailVerificationFailed: true };
      const [items, totalCount] = await Promise.all([
        db.alumni.findMany({
          where,
          select: {
            id: true,
            name: true,
            enrollmentNumber: true,
            personalEmail: true,
            branch: true,
            batch: true,
            course: true,
            profileImageUrl: true,
            phoneNumber: true,
            emailVerificationError: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.alumni.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "unverifiedExternal") {
      const where = { emailVerificationFailed: true };
      const [items, totalCount] = await Promise.all([
        db.externalStudent.findMany({
          where,
          select: {
            id: true,
            name: true,
            enrollmentNumber: true,
            email: true,
            branch: true,
            batch: true,
            course: true,
            cgpa: true,
            profileImageUrl: true,
            phoneNumber: true,
            collegeName: true,
            emailVerificationError: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.externalStudent.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    if (type === "volunteers") {
      const where = { isVerified: false };
      const [items, totalCount] = await Promise.all([
        db.volunteer.findMany({
          where,
          select: {
            id: true,
            studentId: true,
            designation: true,
            createdAt: true,
            student: {
              select: {
                name: true,
                enrollmentNumber: true,
                profileImageUrl: true,
                email: true,
                branch: true,
                batch: true,
                course: true,
                cgpa: true,
                phoneNumber: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        db.volunteer.count({ where }),
      ]);
      return NextResponse.json({ success: true, items, totalCount });
    }

    return NextResponse.json(
      { success: false, message: "Invalid type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Approvals GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: string;
      id?: string;
      ids?: string[];
      action: "approve" | "reject";
      status?: string;
      driveStudentPair?: { driveId: string; studentId: string }[];
    };
    const { type, id, ids, action, status, driveStudentPair } = body;
    const targetIds = ids || (id ? [id] : []);

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 },
      );
    }

    const db = getDb();

    if (type === "drives") {
      await db.placementDrive.updateMany({
        where: { id: { in: targetIds } },
        data: { status: action === "approve" ? "active" : "rejected" },
      });

      if (action === "approve") {
        runInBackground(
          sendApprovedDriveNotifications(targetIds),
          "drive approval notifications",
        );
      }
    } else if (type === "referrals") {
      await db.referral.updateMany({
        where: { id: { in: targetIds } },
        data: { status: action === "approve" ? "published" : "rejected" },
      });
    } else if (type === "external") {
      if (action === "approve") {
        await db.externalStudent.updateMany({
          where: { id: { in: targetIds } },
          data: { isVerified: true },
        });
      } else {
        await db.externalStudent.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "memories") {
      if (action === "approve") {
        await db.memory.updateMany({
          where: { id: { in: targetIds } },
          data: { status: "approved" },
        });
      } else {
        await db.memory.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "studentFeedback") {
      if (action === "approve") {
        await db.studentFeedback.updateMany({
          where: { id: { in: targetIds } },
          data: { isApproved: true },
        });
      } else {
        await db.studentFeedback.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "alumniFeedback") {
      if (action === "approve") {
        await db.alumniFeedback.updateMany({
          where: { id: { in: targetIds } },
          data: { isApproved: true },
        });
      } else {
        await db.alumniFeedback.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "corporateFeedback") {
      if (action === "approve") {
        await db.corporateFeedback.updateMany({
          where: { id: { in: targetIds } },
          data: { isApproved: true },
        });
      } else {
        await db.corporateFeedback.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "unverifiedStudents") {
      if (action === "approve") {
        await db.student.updateMany({
          where: { id: { in: targetIds } },
          data: {
            emailVerificationFailed: false,
            emailVerificationError: null,
            isEmailVerified: true,
            isVerified: true,
          },
        });
      } else {
        await db.student.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "unverifiedAlumni") {
      if (action === "approve") {
        await db.alumni.updateMany({
          where: { id: { in: targetIds } },
          data: {
            emailVerificationFailed: false,
            emailVerificationError: null,
            isVerified: true,
          },
        });
      } else {
        await db.alumni.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "unverifiedExternal") {
      if (action === "approve") {
        await db.externalStudent.updateMany({
          where: { id: { in: targetIds } },
          data: {
            emailVerificationFailed: false,
            emailVerificationError: null,
            isVerified: true,
          },
        });
      } else {
        await db.externalStudent.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "volunteers") {
      if (action === "approve") {
        await db.volunteer.updateMany({
          where: { id: { in: targetIds } },
          data: { isVerified: true, assignedAt: new Date() },
        });
      } else {
        await db.volunteer.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "drive_student_status") {
      // Handle volunteer student status updates
      if (!driveStudentPair || driveStudentPair.length === 0) {
        return NextResponse.json(
          { success: false, message: "driveStudentPair is required for this type" },
          { status: 400 },
        );
      }

      if (!status || !["Selected", "Rejected", "Shortlisted"].includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status. Must be Selected, Rejected, or Shortlisted" },
          { status: 400 },
        );
      }

      // Upsert status for each drive-student pair
      for (const pair of driveStudentPair) {
        await db.volunteerStudentStatus.upsert({
          where: {
            driveId_studentId: {
              driveId: pair.driveId,
              studentId: pair.studentId,
            },
          },
          update: { status },
          create: {
            driveId: pair.driveId,
            studentId: pair.studentId,
            status,
          },
        });
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' completed for ${targetIds.length} item(s)`,
    });
  } catch (error) {
    console.error("Approvals POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Action failed" },
      { status: 500 },
    );
  }
}
