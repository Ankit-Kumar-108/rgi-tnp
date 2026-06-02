export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { 
  placementOpportunityTemplate, 
  driveRejectionTemplate, 
  referralStatusUpdateTemplate, 
  volunteerApprovedTemplate, 
  externalVerificationSuccessTemplate, 
  studentVerificationSuccessTemplate 
} from "@/lib/email-templates";
import { runInBackground } from "@/lib/background";
import { deleteMultipleFromR2 } from "@/lib/r2-delete";
import { NotificationService } from "@/lib/notification-service";

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

async function notifyEligibleStudentsForDrive(drive: ApprovedDrive, triggeredBy: string) {
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
      id: true,
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
      studentsBatch.map(async (student) => {
        await NotificationService.notifyUser({
          email: {
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
              `https://${process.env.DOMAIN_NAME}/students/dashboard`,
            ),
            template: "placementOpportunityTemplate",
          },
          inApp: {
            type: "drive_approved",
            title: `New Placement Opportunity: ${drive.companyName}`,
            message: `${drive.roleName} role with CTC of ${drive.ctc}. Date: ${driveDate}.`,
            link: "/students/dashboard",
          },
          triggeredBy,
          recipient: {
            id: student.id,
            type: "student",
          },
        });
      })
    );
  }
}

async function sendApprovedDriveNotifications(driveIds: string[], triggeredBy: string) {
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
        await notifyEligibleStudentsForDrive(drive, triggeredBy);
      } catch (error) {
        console.error(
          `[DRIVE NOTIFICATION ERROR] Failed for drive ${drive.id}:`,
          error,
        );
      }
    }),
  );
}

async function notifyRecruitersForRejectedDrives(driveIds: string[], triggeredBy: string) {
  const db = getDb();
  const rejectedDrives = await db.placementDrive.findMany({
    where: { id: { in: driveIds }, status: "rejected" },
    include: {
      recruiter: { select: { id: true, name: true, email: true } },
    },
  });

  await Promise.allSettled(
    rejectedDrives.map(async (drive) => {
      if (!drive.recruiter) return;
      await NotificationService.notifyUser({
        email: {
          to: drive.recruiter.email,
          subject: `Placement Drive Rejected: ${drive.companyName}`,
          html: driveRejectionTemplate(drive.recruiter.name, drive.companyName, drive.roleName),
          template: "driveRejectionTemplate",
        },
        inApp: {
          type: "drive_rejected",
          title: `Drive Rejected: ${drive.companyName}`,
          message: `Your drive for ${drive.companyName} (${drive.roleName}) was not approved.`,
        },
        triggeredBy,
        recipient: {
          id: drive.recruiter.id,
          type: "recruiter",
        },
      });
    })
  );
}

async function notifyAlumniForReferrals(referralIds: string[], action: "approve" | "reject", triggeredBy: string) {
  const db = getDb();
  const referrals = await db.referral.findMany({
    where: { id: { in: referralIds } },
    include: {
      alumni: { select: { id: true, name: true, personalEmail: true } },
    },
  });

  await Promise.allSettled(
    referrals.map(async (ref) => {
      await NotificationService.notifyUser({
        email: {
          to: ref.alumni.personalEmail,
          subject: `Referral Submission ${action === "approve" ? "Approved" : "Rejected"}: ${ref.position}`,
          html: referralStatusUpdateTemplate(ref.alumni.name, ref.position, ref.companyName, action),
          template: "referralStatusUpdateTemplate",
        },
        inApp: {
          type: action === "approve" ? "referral_approved" : "referral_rejected",
          title: `Referral ${action === "approve" ? "Approved" : "Rejected"}`,
          message: `Your referral for ${ref.position} at ${ref.companyName} was ${action === "approve" ? "published" : "not approved"}.`,
        },
        triggeredBy,
        recipient: {
          id: ref.alumni.id,
          type: "alumni",
        },
      });
    })
  );
}

async function notifyUploaderForMemoryApproval(memoryIds: string[], triggeredBy: string) {
  const db = getDb();
  const memories = await db.memory.findMany({
    where: { id: { in: memoryIds } },
    select: {
      id: true,
      title: true,
      studentId: true,
      alumniId: true,
      student: { select: { email: true, name: true } },
      alumni: { select: { personalEmail: true, name: true } },
    },
  });

  await Promise.allSettled(
    memories.map(async (memory) => {
      const isStudent = Boolean(memory.studentId);
      const recipientId = isStudent ? memory.studentId : memory.alumniId;
      const recipientType = isStudent ? ("student" as const) : ("alumni" as const);

      if (!recipientId) return;

      await NotificationService.notifyUser({
        inApp: {
          type: "memory_approved",
          title: `Memory Approved`,
          message: `Your memory "${memory.title}" has been approved and published.`,
        },
        triggeredBy,
        recipient: {
          id: recipientId,
          type: recipientType,
        },
      });
    })
  );
}

async function notifyVolunteersApproval(volunteerIds: string[], triggeredBy: string) {
  const db = getDb();
  const volunteers = await db.volunteer.findMany({
    where: { id: { in: volunteerIds } },
    include: {
      student: { select: { id: true, name: true, email: true } },
    },
  });

  await Promise.allSettled(
    volunteers.map(async (v) => {
      if (!v.student) return;
      await NotificationService.notifyUser({
        email: {
          to: v.student.email,
          subject: `Volunteer Status Approved!`,
          html: volunteerApprovedTemplate(v.student.name),
          template: "volunteerApprovedTemplate",
        },
        inApp: {
          type: "volunteer_approved",
          title: `Volunteer Registration Approved`,
          message: `You are now verified as a student volunteer!`,
        },
        triggeredBy,
        recipient: {
          id: v.student.id,
          type: "student",
        },
      });
    })
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
    const adminEmail = req.headers.get("x-admin-email") || "system";
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
          sendApprovedDriveNotifications(targetIds, adminEmail),
          "drive approval notifications",
        );
      } else {
        runInBackground(
          notifyRecruitersForRejectedDrives(targetIds, adminEmail),
          "drive rejection notifications",
        );
      }
    } else if (type === "referrals") {
      await db.referral.updateMany({
        where: { id: { in: targetIds } },
        data: { status: action === "approve" ? "published" : "rejected" },
      });

      runInBackground(
        notifyAlumniForReferrals(targetIds, action, adminEmail),
        "referral status notifications",
      );
    } else if (type === "external") {
      if (action === "approve") {
        await db.externalStudent.updateMany({
          where: { id: { in: targetIds } },
          data: { isVerified: true },
        });

        // Notify External Student
        runInBackground(
          (async () => {
            const list = await db.externalStudent.findMany({
              where: { id: { in: targetIds } },
              select: { id: true, name: true, email: true },
            });
            await Promise.allSettled(
              list.map((student) =>
                NotificationService.notifyUser({
                  email: {
                    to: student.email,
                    subject: "Account Verified Successfully",
                    html: externalVerificationSuccessTemplate(student.name),
                    template: "externalVerificationSuccess",
                  },
                  inApp: {
                    type: "account_verified",
                    title: "Account Verified",
                    message: "Your external student profile is verified.",
                  },
                  triggeredBy: adminEmail,
                  recipient: { id: student.id, type: "external_student" },
                })
              )
            );
          })(),
          "external student approval notifications"
        );
      } else {
        // Fetch R2 URLs before deleting
        const extStudents = await db.externalStudent.findMany({
          where: { id: { in: targetIds } },
          select: { profileImageUrl: true, resumeUrl: true },
        });
        const extUrls = extStudents
          .flatMap((s) => [s.profileImageUrl, s.resumeUrl])
          .filter((url): url is string => Boolean(url));

        await db.externalStudent.deleteMany({
          where: { id: { in: targetIds } },
        });

        if (extUrls.length > 0) await deleteMultipleFromR2(extUrls);
      }
    } else if (type === "memories") {
      if (action === "approve") {
        await db.memory.updateMany({
          where: { id: { in: targetIds } },
          data: { status: "approved" },
        });

        runInBackground(
          notifyUploaderForMemoryApproval(targetIds, adminEmail),
          "memory approval notifications",
        );
      } else {
        // Fetch imageUrls before deleting
        const memories = await db.memory.findMany({
          where: { id: { in: targetIds } },
          select: { imageUrl: true },
        });
        const imageUrls = memories.map((m) => m.imageUrl).filter(Boolean);

        await db.memory.deleteMany({
          where: { id: { in: targetIds } },
        });

        if (imageUrls.length > 0) await deleteMultipleFromR2(imageUrls);
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

        runInBackground(
          (async () => {
            const list = await db.student.findMany({
              where: { id: { in: targetIds } },
              select: { id: true, name: true, email: true },
            });
            await Promise.allSettled(
              list.map((student) =>
                NotificationService.notifyUser({
                  email: {
                    to: student.email,
                    subject: "Account Verified Successfully",
                    html: studentVerificationSuccessTemplate(student.name),
                    template: "studentVerificationSuccess",
                  },
                  inApp: {
                    type: "account_verified",
                    title: "Account Verified",
                    message: "Your profile has been manually verified by the administrator.",
                  },
                  triggeredBy: adminEmail,
                  recipient: { id: student.id, type: "student" },
                })
              )
            );
          })(),
          "student verification notifications"
        );
      } else {
        const students = await db.student.findMany({
          where: { id: { in: targetIds } },
          select: { profileImageUrl: true, resumeUrl: true },
        });
        const studentUrls = students
          .flatMap((s) => [s.profileImageUrl, s.resumeUrl])
          .filter((url): url is string => Boolean(url));

        await db.student.deleteMany({
          where: { id: { in: targetIds } },
        });

        if (studentUrls.length > 0) await deleteMultipleFromR2(studentUrls);
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

        runInBackground(
          (async () => {
            const list = await db.alumni.findMany({
              where: { id: { in: targetIds } },
              select: { id: true, name: true, personalEmail: true },
            });
            await Promise.allSettled(
              list.map((alumni) =>
                NotificationService.notifyUser({
                  email: {
                    to: alumni.personalEmail,
                    subject: "Account Verified Successfully",
                    html: `<p>Hello ${alumni.name}, your alumni account has been verified by the administrator.</p>`,
                    template: "alumniVerificationSuccess",
                  },
                  inApp: {
                    type: "account_verified",
                    title: "Account Verified",
                    message: "Your alumni profile has been manually verified by the administrator.",
                  },
                  triggeredBy: adminEmail,
                  recipient: { id: alumni.id, type: "alumni" },
                })
              )
            );
          })(),
          "alumni verification notifications"
        );
      } else {
        const alumniRecords = await db.alumni.findMany({
          where: { id: { in: targetIds } },
          select: { profileImageUrl: true },
        });
        const alumniUrls = alumniRecords
          .map((a) => a.profileImageUrl)
          .filter(Boolean);

        await db.alumni.deleteMany({
          where: { id: { in: targetIds } },
        });

        if (alumniUrls.length > 0) await deleteMultipleFromR2(alumniUrls);
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

        runInBackground(
          (async () => {
            const list = await db.externalStudent.findMany({
              where: { id: { in: targetIds } },
              select: { id: true, name: true, email: true },
            });
            await Promise.allSettled(
              list.map((student) =>
                NotificationService.notifyUser({
                  email: {
                    to: student.email,
                    subject: "Account Verified Successfully",
                    html: `<p>Hello ${student.name}, your external student account has been verified by the administrator.</p>`,
                    template: "externalVerificationSuccess",
                  },
                  inApp: {
                    type: "account_verified",
                    title: "Account Verified",
                    message: "Your profile has been manually verified by the administrator.",
                  },
                  triggeredBy: adminEmail,
                  recipient: { id: student.id, type: "external_student" },
                })
              )
            );
          })(),
          "external verification notifications"
        );
      } else {
        const extRecords = await db.externalStudent.findMany({
          where: { id: { in: targetIds } },
          select: { profileImageUrl: true, resumeUrl: true },
        });
        const extUrls = extRecords
          .flatMap((s) => [s.profileImageUrl, s.resumeUrl])
          .filter((url): url is string => Boolean(url));

        await db.externalStudent.deleteMany({
          where: { id: { in: targetIds } },
        });

        if (extUrls.length > 0) await deleteMultipleFromR2(extUrls);
      }
    } else if (type === "volunteers") {
      if (action === "approve") {
        await db.volunteer.updateMany({
          where: { id: { in: targetIds } },
          data: { isVerified: true, assignedAt: new Date() },
        });

        runInBackground(
          notifyVolunteersApproval(targetIds, adminEmail),
          "volunteer approval notifications",
        );
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

export async function PUT(req :NextRequest) {
  try {
    const body = (await req.json()) as {
      id: string;
      companyName: string;
      roleName: string;
      genderPreference: string
      jobDescription: string;
      ctc: string;
      eligibleBranches: string;
      minCGPA: number;
      duration: string
      interviewProcess: string
      minBatch: string;
      maxBatch: string;
      course: string;
      driveDate: string;
      driveType: string;
      jobType: string;
    };

    const db = getDb()

    const existingDrive = await db.placementDrive.findUnique({
      where: {id: body.id},
    })
    if (!existingDrive) {
      return NextResponse.json({ success: false, message: "Drive not found" }, { status: 404 });
    }

    const updatedDrive = await db.placementDrive.update({
      where: { id: body.id },
      data: {
        companyName: body.companyName,
        roleName: body.roleName,
        genderPreference: body.genderPreference,
        interviewProcess: body.interviewProcess,
        jobDescription: body.jobDescription,
        ctc: body.ctc,
        eligibleBranches: body.eligibleBranches,
        minCGPA: body.minCGPA,
        minBatch: body.minBatch,
        maxBatch: body.maxBatch,
        duration: body.duration,
        course: body.course,
        driveDate: new Date(body.driveDate),
        driveType: body.driveType || existingDrive.driveType,
        jobType: body.jobType || existingDrive.jobType,
        
      },
    });

    return NextResponse.json({ success: true, message: "Drive updated successfully", drive: updatedDrive });
  } catch (error: any) {
    console.error("Error Upadting Drive", error)
    return NextResponse.json({
      success: false,
      message: "error updating drive",
    }, {
      status: 500
    })
  }
}
