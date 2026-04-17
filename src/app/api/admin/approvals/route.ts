export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { placementOpportunityTemplate } from "@/lib/email-templates";

// GET: Fetch pending items by type
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "drives";
    const parsedLimit = parseInt(searchParams.get("limit") || "200", 10);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);

    const limit = isNaN(parsedLimit) ? 200 : Math.max(1, parsedLimit);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const skip = (page - 1) * limit;



    const db = getDb();

    if (type === "drives") {
      const where = { status: "pending" };
      const [drives, totalCount] = await Promise.all([
        db.placementDrive.findMany({
          where,
          include: { recruiter: { select: { name: true, company: true, email: true } } },
          orderBy: { driveDate: "desc" },
          take: limit,
          skip: skip,
        }),
        db.placementDrive.count({ where })
      ]);
      return NextResponse.json({ success: true, items: drives, totalCount });
    }

    if (type === "studentFeedback") {
      const where = { isApproved: false };
      const [feedbacks, totalCount] = await Promise.all([
        db.studentFeedback.findMany({
          where,
          include: { student: { select: { name: true, enrollmentNumber: true, profileImageUrl: true } } },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.studentFeedback.count({ where })
      ]);
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    if (type === "alumniFeedback") {
      const where = { isApproved: false };
      const [feedbacks, totalCount] = await Promise.all([
        db.alumniFeedback.findMany({
          where,
          include: { alumni: { select: { name: true, personalEmail: true, profileImageUrl: true } } },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.alumniFeedback.count({ where })
      ]);
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    if (type === "corporateFeedback") {
      const where = { isApproved: false };
      const [feedbacks, totalCount] = await Promise.all([
        db.corporateFeedback.findMany({
          where,
          include: { recruiter: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.corporateFeedback.count({ where })
      ]);
      return NextResponse.json({ success: true, items: feedbacks, totalCount });
    }

    if (type === "referrals") {
      const where = { status: "pending" };
      const [referrals, totalCount] = await Promise.all([
        db.referral.findMany({
          where,
          include: { alumni: { select: { name: true, personalEmail: true, profileImageUrl: true } } },
          take: limit,
          skip: skip,
        }),
        db.referral.count({ where })
      ])
      return NextResponse.json({ success: true, items: referrals, totalCount });
    }

    if (type === "external") {
      const where = { isVerified: false };
      const [externals, totalCount] = await Promise.all([
        db.externalStudent.findMany({
          where,
          select: {
            id: true, name: true, collegeName: true, branch: true, cgpa: true,
            email: true, enrollmentNumber: true, resumeUrl: true, profileImageUrl: true,
            phoneNumber: true, batch: true, course: true, tenthPercentage: true, twelfthPercentage: true,
          },
          take: limit,
          skip: skip,
        }),
        db.externalStudent.count({ where })
      ]);
      return NextResponse.json({ success: true, items: externals, totalCount });
    }

    if (type === "memories") {
      const where = { OR: [{ status: "pending_moderation" }, { status: "approved" }] };
      const [memories, totalCount] = await Promise.all([
        db.memory.findMany({
          where,
          include: {
            student: { select: { name: true, enrollmentNumber: true, profileImageUrl: true } },
            alumni: { select: { name: true, enrollmentNumber: true, profileImageUrl: true } }
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.memory.count({ where })
      ]);
      return NextResponse.json({ success: true, items: memories, totalCount });
    }

    if (type === "unverifiedStudents") {
      const where = { emailVerificationFailed: true };
      const [students, totalCount] = await Promise.all([
        db.student.findMany({
          where,
          select: {
            id: true, name: true, enrollmentNumber: true, email: true, branch: true,
            batch: true, course: true, cgpa: true, profileImageUrl: true, phoneNumber: true,
            emailVerificationError: true, createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.student.count({ where })
      ]);
      return NextResponse.json({ success: true, items: students, totalCount });
    }

    if (type === "unverifiedAlumni") {
      const where = { emailVerificationFailed: true };
      const [alumni, totalCount] = await Promise.all([
        db.alumni.findMany({
          where,
          select: {
            id: true, name: true, enrollmentNumber: true, personalEmail: true, branch: true,
            batch: true, course: true, profileImageUrl: true, phoneNumber: true,
            emailVerificationError: true, createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.alumni.count({ where })
      ]);
      return NextResponse.json({ success: true, items: alumni, totalCount });
    }

    if (type === "unverifiedExternal") {
      const where = { emailVerificationFailed: true };
      const [external, totalCount] = await Promise.all([
        db.externalStudent.findMany({
          where,
          select: {
            id: true, name: true, enrollmentNumber: true, email: true, branch: true,
            batch: true, course: true, cgpa: true, profileImageUrl: true, phoneNumber: true,
            collegeName: true, emailVerificationError: true, createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.externalStudent.count({ where })
      ]);
      return NextResponse.json({ success: true, items: external, totalCount });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Approvals GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Approve or reject an item (Supports Bulk)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: string;
      id?: string;
      ids?: string[];
      action: "approve" | "reject";
      reason?: string;
    };
    const { type, id, ids, action } = body;
    const targetIds = ids || (id ? [id] : []);

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, message: "No IDs provided" }, { status: 400 });
    }

    const db = getDb();

    if (type === "drives") {
      await db.placementDrive.updateMany({
        where: { id: { in: targetIds } },
        data: { status: action === "approve" ? "active" : "rejected" },
      });
      if (action === "approve") {
        try {
          const approvedDrives = await db.placementDrive.findMany({
            where: { id: { in: targetIds }, status: "active" },
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
            }
          });

          // For each approved drive, send emails to eligible students
          for (const drive of approvedDrives) {
            // Parse eligible branches (comma-separated)
            const eligibleBranchList = drive.eligibleBranches
              .split(',')
              .map(b => b.trim())
              .filter(b => b);

            // Find all students matching the drive's eligibility criteria
            const eligibleStudents = await db.student.findMany({
              where: {
                isEmailVerified: true,
                branch: { in: eligibleBranchList },
                batch: {
                  gte: drive.minBatch,
                  lte: drive.maxBatch,
                },
                course: drive.course,
              },
              select: {
                id: true,
                name: true,
                email: true,
              }
            });

            // Send notification email to each eligible student
            for (const student of eligibleStudents) {
              if (!student.email) continue;
              
              try {
                const driveDate = new Date(drive.driveDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });

                const emailHtml = placementOpportunityTemplate(
                  student.name,
                  drive.companyName,
                  drive.driveType,
                  drive.ctc,
                  `${drive.minBatch} - ${drive.maxBatch}`,
                  drive.course,
                  eligibleBranchList.join(', '),
                  driveDate,
                  "https://ankit-dev.me/portal/students/dashboard" // Portal dashboard link
                );

                await sendEmail({
                  to: student.email,
                  subject: `🚀 New Opportunity: ${drive.companyName} is hiring!`,
                  html: emailHtml,
                });

                console.log(`[DRIVE NOTIFICATION] Sent to ${student.email} for drive ${drive.id}`);
              } catch (studentEmailError) {
                console.error(`[DRIVE NOTIFICATION ERROR] Failed to send to ${student.email}:`, studentEmailError);
                // Continue with next student - don't fail the whole operation
              }
            }
          }
        } catch (emailError) {
          console.error("Error fetching drive data for emails:", emailError);
        }
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
        // Permanent delete for rejected external signups
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
        // Admin override: Clear email failure flag to allow manual verification or force verify
        await db.student.updateMany({
          where: { id: { in: targetIds } },
          data: {
            emailVerificationFailed: false,
            emailVerificationError: null,
            isEmailVerified: true, // Force verify on admin approval
            isVerified: true,
          },
        });
      } else {
        // Reject: Delete the failed registration
        await db.student.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "unverifiedAlumni") {
      if (action === "approve") {
        // Admin override: Clear email failure flag
        await db.alumni.updateMany({
          where: { id: { in: targetIds } },
          data: {
            emailVerificationFailed: false,
            emailVerificationError: null,
            isVerified: true, // Force verify on admin approval
          },
        });
      } else {
        // Reject: Delete the failed registration
        await db.alumni.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else if (type === "unverifiedExternal") {
      if (action === "approve") {
        // Admin override: Clear email failure flag
        await db.externalStudent.updateMany({
          where: { id: { in: targetIds } },
          data: {
            emailVerificationFailed: false,
            emailVerificationError: null,
            isVerified: true, // Force verify on admin approval
          },
        });
      } else {
        // Reject: Delete the failed registration
        await db.externalStudent.deleteMany({
          where: { id: { in: targetIds } },
        });
      }
    } else {
      return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Action '${action}' completed for ${targetIds.length} item(s)` });
  } catch (error) {
    console.error("Approvals POST Error:", error);
    return NextResponse.json({ success: false, message: "Action failed" }, { status: 500 });
  }
}

