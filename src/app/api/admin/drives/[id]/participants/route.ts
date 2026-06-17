export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
// import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { rejectionEmailTemplate } from "@/lib/email-templates";
import { shortlistedEmailTemplate } from "@/lib/email-templates";
import { offerSelectionEmailTemplate } from "@/lib/email-templates";
import { NotificationService } from "@/lib/notification-service";
import {runInBackground} from "@/lib/background";


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url)
    const parsedLimit = parseInt(searchParams.get("limit") || "100", 10);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);

    const limit = isNaN(parsedLimit) ? 100 : Math.max(1, parsedLimit);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const skip = (page - 1) * limit;


    const db = getDb();

    // Explicitly type the query to help the compiler
    const query: any = {
      where: { driveId: id },
      take: limit,
      skip: skip,
      select: {
        id: true,
        status: true,
        attended: true,
        createdAt: true,
        student: {
          select: {
            name: true,
            enrollmentNumber: true,
            branch: true,
            cgpa: true,
            profileImageUrl: true,
            email: true,
            phoneNumber: true,
            resumeUrl: true,
            linkedinUrl: true,
            githubUrl: true,
            course: true,
            batch: true,
            tenthPercentage: true,
            twelfthPercentage: true,
          }
        },
        externalStudent: {
          select: {
            name: true,
            enrollmentNumber: true,
            branch: true,
            cgpa: true,
            profileImageUrl: true,
            email: true,
            phoneNumber: true,
            resumeUrl: true,
            collegeName: true,
            linkedinUrl: true,
            githubUrl: true,
            course: true,
            batch: true,
            tenthPercentage: true,
            twelfthPercentage: true,
          }
        },
        alumni: {
          select: {
            name: true,
            enrollmentNumber: true,
            branch: true,
            profileImageUrl: true,
            personalEmail: true,
            phoneNumber: true,
            linkedInUrl: true,
            course: true,
            batch: true,
            currentCompany: true,
            jobTitle: true,
            cgpa: true,
            twelfthPercentage: true,
            tenthPercentage: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    };

    const [registrations, totalCount, drive] = await Promise.all([
      db.driveRegistration.findMany(query),
      db.driveRegistration.count({ where: { driveId: id } }),
      db.placementDrive.findUnique({
        where: { id },
        select: { googleSheetUrl: true, companyName: true, roleName: true, status: true }
      })
    ])

    return NextResponse.json({ success: true, registrations, drive, totalCount });
  } catch (error) {
    console.error("Fetch participants error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch participants" }, { status: 500 });
  }
}

// Update participant statuses (e.g. promoting them to next round)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: driveId } = await params;
    const db = getDb();
    const body = await req.json() as { registrationIds: string[], status: string };
    const { registrationIds, status } = body;

    if (!registrationIds || !Array.isArray(registrationIds) || !status) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    // Validate batch size to prevent abuse
    if (registrationIds.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Maximum 1000 records per request" },
        { status: 400 }
      );
    }

    if (!["selected", "rejected", "shortlisted"].includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Update all registrations with the new status (synchronous — this is fast)
    await db.driveRegistration.updateMany({
      where: {
        id: { in: registrationIds },
        driveId: driveId
      },
      data: { status }
    });

    // Return immediately — emails send in background via Cloudflare waitUntil
    // This prevents 30s timeout when sending to 500+ students
    runInBackground(
      sendBulkStatusEmails(db, registrationIds, status.toLowerCase()),
      `bulk-${status}-emails`
    );

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    console.error("Update participant error:", err);
    return NextResponse.json({ success: false, message: "Failed to update status" }, { status: 500 });
  }
}

/**
 * Background email sending with chunked processing.
 * Processes emails in batches of 10 to respect Cloudflare free-tier subrequest limits.
 * Each email = 2 subrequests (OAuth token [cached] + Gmail send) + 2 DB writes (emailLog + notification).
 */
async function sendBulkStatusEmails(db: any, registrationIds: string[], status: string) {
  try {
    const updatedRegistrations = await db.driveRegistration.findMany({
      where: { id: { in: registrationIds } },
      select: {
        id: true,
        drive: {
          select: {
            companyName: true,
            roleName: true,
            ctc: true,
            id: true,
          }
        },
        student: {
          select: { name: true, email: true, id: true }
        },
        externalStudent: {
          select: { name: true, email: true, id: true }
        },
        alumni: {
          select: { name: true, personalEmail: true, id: true }
        }
      }
    });

    // Build email tasks
    const emailTasks = updatedRegistrations
      .map((reg: any) => {
        const studentData = reg.student || reg.externalStudent || (reg.alumni ? { ...reg.alumni, email: reg.alumni.personalEmail } : null);
        if (!studentData?.email || !studentData?.name || !reg.drive?.companyName || !reg.drive?.roleName) return null;

        const recipientType = reg.student ? "student" : reg.externalStudent ? "external_student" : "alumni";

        let emailConfig: { subject: string; html: string; template: string; actionType: string };
        let inAppConfig: { type: string; title: string; message: string } | undefined;

        if (status === "selected") {
          emailConfig = {
            subject: `Selected for next round for ${reg.drive.companyName} Campus Drive`,
            html: offerSelectionEmailTemplate(studentData.name, reg.drive.roleName, reg.drive.companyName, reg.drive.ctc, reg.drive.roleName),
            template: "offerSelectionTemplate",
            actionType: "selected for the next round",
          };
          inAppConfig = {
            type: "participant_selection",
            title: "You're Selected For the next round!",
            message: `Selected for the next round at ${reg.drive.companyName} drive`,
          };
        } else if (status === "rejected") {
          emailConfig = {
            subject: `Update on ${reg.drive.companyName} Campus Drive application`,
            html: rejectionEmailTemplate(studentData.name, reg.drive.roleName, reg.drive.companyName),
            template: "rejectionEmailTemplate",
            actionType: "rejected",
          };
          inAppConfig = {
            type: "participant_rejection",
            title: "Application Status Update",
            message: `Your application for ${reg.drive.companyName} has been updated`,
          };
        } else if (status === "shortlisted") {
          emailConfig = {
            subject: `Shortlisted for ${reg.drive.companyName} Campus Drive`,
            html: shortlistedEmailTemplate(
              studentData.name, reg.drive.roleName, reg.drive.companyName,
              `${new Date().toLocaleDateString()} in 10 Minutes`, "RGI Seminar Hall", "Robin Samul (TPO)"
            ),
            template: "shortlisted",
            actionType: "shortlisted",
          };
        } else {
          return null;
        }

        return {
          studentData,
          recipientType,
          driveId: reg.drive.id,
          emailConfig: emailConfig!,
          inAppConfig,
        };
      })
      .filter(Boolean) as Array<{
        studentData: { email: string; name: string; id: string };
        recipientType: "student" | "external_student" | "alumni";
        driveId: string;
        emailConfig: { subject: string; html: string; template: string; actionType: string };
        inAppConfig?: { type: string; title: string; message: string };
      }>;

    // Process in chunks of 10 to respect Cloudflare free-tier limits
    // (10 emails × 2 subrequests = 20, plus DB writes stays well under 50)
    const CHUNK_SIZE = 10;
    for (let i = 0; i < emailTasks.length; i += CHUNK_SIZE) {
      const chunk = emailTasks.slice(i, i + CHUNK_SIZE);
      await Promise.allSettled(
        chunk.map(task =>
          NotificationService.notifyUser({
            email: {
              to: task.studentData.email,
              subject: task.emailConfig.subject,
              html: task.emailConfig.html,
              template: task.emailConfig.template,
              approvalType: `participant_${task.emailConfig.actionType}`,
              approvalId: task.driveId,
              actionType: task.emailConfig.actionType,
            },
            inApp: task.inAppConfig,
            triggeredBy: "admin",
            recipient: {
              id: task.studentData.id,
              type: task.recipientType,
            },
          }).catch(err => {
            console.error(`[BulkEmail] Failed for ${task.studentData.email}:`, err instanceof Error ? err.message : String(err));
          })
        )
      );
    }

    console.log(`[BulkEmail] Completed sending ${emailTasks.length} ${status} emails in ${Math.ceil(emailTasks.length / CHUNK_SIZE)} chunks`);
  } catch (error) {
    console.error(`[BulkEmail] Fatal error in background ${status} email task:`, error);
  }
}
