import { getDb } from "./db";
import { sendEmail } from "./send-email";
import * as schema from "./schema";
import { eq, and, inArray } from "drizzle-orm";

interface SendEmailWithLogOptions {
  to: string;
  subject: string;
  html: string;
  template: string;
  triggeredBy: string;
  recipientType?: string;
  approvalId?: string
  approvalType?: string
  actionType?: string
}

interface CreateInAppNotificationOptions {
  type: string;
  title: string;
  message: string;
  link?: string;
  recipientType: "student" | "alumni" | "external_student" | "recruiter" | "admin";
  studentId?: string;
  alumniId?: string;
  externalStudentId?: string;
  recruiterId?: string;
}

interface NotifyUserOptions {
  email?: {
    to: string;
    subject: string;
    html: string;
    template: string;
    approvalType?: string;
    approvalId?: string;
    actionType?: string;
  };
  inApp?: {
    type: string;
    title: string;
    message: string;
    link?: string;
  };
  triggeredBy: string;
  recipient: {
    id: string;
    type: "student" | "alumni" | "external_student" | "recruiter";
  };
}

interface BroadcastOptions {
  audience: string; // "all_students" | "cs_students" | "mech_students" | "all_alumni" | "all_recruiters" | string (batch years)
  subject: string;
  message: string;
  triggeredBy: string;
  channels: ("email" | "in_app")[];
  course?: string;
  branch?: string;
  driveId?: string;
  registrationIds?: string[];
}

const BROADCAST_BATCH_SIZE = 50;

/**
 * Service to handle sending emails with detailed audit logs and persistent in-app notifications.
 */
export class NotificationService {
  /**
   * Send email and record success/failure in the EmailLog table.
   */
  static async sendEmailWithLog({
    to,
    subject,
    html,
    template,
    triggeredBy,
    recipientType,
    approvalId,
    approvalType,
    actionType,
  }: SendEmailWithLogOptions) {
    const db = getDb();
    if (!to) {
      try {
        await db.insert(schema.emailLog).values({
          to: "MISSING_ADDRESS",
          subject,
          template,
          status: "failed",
          error: "Recipient email is empty or undefined",
          recipientType: recipientType || null,
          triggeredBy,
          approvalId: approvalId || null,
          approvalType: approvalType || null,
          actionType: actionType || null
        });
      } catch (dbError) {
        console.error(`[NotificationService] Failed to log empty-mail`, dbError);
      }
      return { success: false, error: "Recipient email is undefined" };
    }

    const result = await sendEmail({ to, subject, html });

    try {
      await db.insert(schema.emailLog).values({
        to,
        subject,
        template,
        status: result.success ? "sent" : "failed",
        error: result.error || null,
        recipientType: recipientType || null,
        triggeredBy,
        approvalId: approvalId || null,
        approvalType: approvalType || null,
        actionType: actionType || null
      });
    } catch (dbError) {
      console.error("[NotificationService] Failed to create EmailLog record:", dbError);
    }

    return result;
  }

  /**
   * Persists an in-app notification to the database.
   */
  static async createInAppNotification({
    type,
    title,
    message,
    link,
    recipientType,
    studentId,
    alumniId,
    externalStudentId,
    recruiterId,
  }: CreateInAppNotificationOptions) {
    const db = getDb();
    try {
      const result = await db.insert(schema.notification).values({
        type,
        title,
        message,
        link: link || null,
        recipientType,
        studentId: studentId || null,
        alumniId: alumniId || null,
        externalStudentId: externalStudentId || null,
        recruiterId: recruiterId || null,
      }).returning();
      return result[0];
    } catch (error) {
      console.error("[NotificationService] Failed to create in-app notification in DB:", error);
      throw error;
    }
  }

  /**
   * Helper to send both email (with logs) and create an in-app notification in parallel.
   */
  static async notifyUser({ email, inApp, triggeredBy, recipient }: NotifyUserOptions) {
    const promises: Promise<unknown>[] = [];

    // 1. Build In-App Notification
    if (inApp) {
      const polymorphicKeys: Partial<CreateInAppNotificationOptions> = {};
      if (recipient.type === "student") polymorphicKeys.studentId = recipient.id;
      if (recipient.type === "alumni") polymorphicKeys.alumniId = recipient.id;
      if (recipient.type === "external_student") polymorphicKeys.externalStudentId = recipient.id;
      if (recipient.type === "recruiter") polymorphicKeys.recruiterId = recipient.id;

      promises.push(
        this.createInAppNotification({
          type: inApp.type,
          title: inApp.title,
          message: inApp.message,
          link: inApp.link,
          recipientType: recipient.type,
          ...polymorphicKeys,
        })
      );
    }

    // 2. Build Email sending
    if (email) {
      promises.push(
        this.sendEmailWithLog({
          to: email.to,
          subject: email.subject,
          html: email.html,
          template: email.template,
          triggeredBy,
          recipientType: recipient.type,
          approvalId: email.approvalId,
          approvalType: email.actionType,
          actionType: email.actionType
        })
      );
    }

    await Promise.allSettled(promises);
  }

  /**
   * Large-scale targeted broadcast engine execution in the background.
   */
  static async triggerBroadcast(options: BroadcastOptions) {
    return await this.executeBroadcast(options)
  }

  /**
   * Internal execution of broadcast sending in safe chunks.
   */
  private static async executeBroadcast({
    audience,
    subject,
    message,
    triggeredBy,
    channels,
    course,
    branch,
    driveId,
    registrationIds,
  }: BroadcastOptions) {
    const db = getDb();
    let recipients: { id: string; name: string; email: string; type: "student" | "alumni" | "recruiter" | "external_student" }[] = [];

    console.log(`[NotificationService] Beginning broadcast resolution for: ${audience}`);

    // Resolve audience lists
    if (audience === "all_students") {
      const conditions: any[] = [eq(schema.student.isEmailVerified, true)];
      if (course) conditions.push(eq(schema.student.course, course));
      if (branch) conditions.push(eq(schema.student.branch, branch));

      const list = await db.query.student.findMany({
        where: and(...conditions),
        columns: { id: true, name: true, email: true },
      });
      recipients = list.map((r: any) => ({ ...r, type: "student" as const }));
    } else if (audience === "all_external_students") {
      const conditions: any[] = [eq(schema.externalStudent.isVerified, true)];
      if (course) conditions.push(eq(schema.externalStudent.course, course));
      if (branch) conditions.push(eq(schema.externalStudent.branch, branch));

      const list = await db.query.externalStudent.findMany({
        where: and(...conditions),
        columns: { id: true, name: true, email: true },
      });
      recipients = list.map((r: any) => ({ ...r, type: "external_student" as const }));
    } else if (audience === "cs_students") {
      const list = await db.query.student.findMany({
        where: and(
          eq(schema.student.isEmailVerified, true),
          inArray(schema.student.branch, ["Computer Science"])
        ),
        columns: { id: true, name: true, email: true },
      });
      recipients = list.map((r: any) => ({ ...r, type: "student" as const }));
    } else if (audience === "mech_students") {
      const list = await db.query.student.findMany({
        where: and(
          eq(schema.student.isEmailVerified, true),
          inArray(schema.student.branch, ["Mechanical"])
        ),
        columns: { id: true, name: true, email: true },
      });
      recipients = list.map((r: any) => ({ ...r, type: "student" as const }));
    } else if (audience === "all_alumnis") {
      const list = await db.query.alumni.findMany({
        where: eq(schema.alumni.isVerified, true),
        columns: { id: true, name: true, personalEmail: true },
      });
      recipients = list.map((r: any) => ({ id: r.id, name: r.name, email: r.personalEmail, type: "alumni" as const }));
    } else if (audience === "all_recruiters") {
      const list = await db.query.recruiter.findMany({
        columns: { id: true, name: true, email: true },
      });
      recipients = list.map((r: any) => ({ ...r, type: "recruiter" as const }));
    } else if (audience.startsWith("batch_")) {
      const batchYear = audience.replace("batch_", "");
      const list = await db.query.student.findMany({
        where: and(eq(schema.student.isEmailVerified, true), eq(schema.student.batch, batchYear)),
        columns: { id: true, name: true, email: true },
      });
      recipients = list.map((r: any) => ({ ...r, type: "student" as const }));
    } else if (audience === "selected_drive_participants") {
      if (!registrationIds?.length) {
        return { success: false, message: "No selected participants were provided" }
      }

      const list = await db.query.driveRegistration.findMany({
        where: and(
          driveId ? eq(schema.driveRegistration.driveId, driveId) : undefined,
          inArray(schema.driveRegistration.id, registrationIds)
        ),
        with: {
          student: { columns: { id: true, name: true, email: true } },
          externalStudent: { columns: { id: true, name: true, email: true } },
          alumni: { columns: { id: true, name: true, personalEmail: true } }
        }
      })
      const rawRecipients = list.map((reg: any) => {
        if (reg.student) return { ...reg.student, type: "student" as const }
        if (reg.externalStudent) return { ...reg.externalStudent, type: "external_student" as const }
        if (reg.alumni) return { id: reg.alumni.id, name: reg.alumni.name, email: reg.alumni.personalEmail, type: "alumni" as const }
        return null
      }).filter((r: any): r is NonNullable<typeof r> => Boolean(r?.email))

      const uniqueMap = new Map<string, typeof rawRecipients[number]>()
      for (const person of rawRecipients) {
        const email = person.email.trim().toLowerCase()
        if (!uniqueMap.has(email)) {
          uniqueMap.set(email, person)
        }
      }
      recipients = Array.from(uniqueMap.values())
    } else if (audience === "all_drive_participants") {
      const list = await db.query.driveRegistration.findMany({
        where: driveId ? eq(schema.driveRegistration.driveId, driveId) : undefined,
        with: {
          student: { columns: { id: true, name: true, email: true } },
          externalStudent: { columns: { id: true, name: true, email: true } },
          alumni: { columns: { id: true, name: true, personalEmail: true } }
        }
      })
      const rawRecipients = list.map((reg: any) => {
        if (reg.student) return { ...reg.student, type: "student" as const }
        if (reg.externalStudent) return { ...reg.externalStudent, type: "external_student" as const }
        if (reg.alumni) return { id: reg.alumni.id, name: reg.alumni.name, email: reg.alumni.personalEmail, type: "alumni" as const }
        return null
      }).filter((r: any): r is NonNullable<typeof r> => Boolean(r?.email))
      const uniqueMap = new Map<string, typeof rawRecipients[number]>()
      for (const person of rawRecipients) {
        const email = person.email.trim().toLowerCase()
        if (!uniqueMap.has(email)) {
          uniqueMap.set(email, person)
        }
      }
      recipients = Array.from(uniqueMap.values())

    } else if (audience === "internal_drive_participants") {
      const list = await db.query.driveRegistration.findMany({
        where: driveId ? eq(schema.driveRegistration.driveId, driveId) : undefined,
        with: {
          student: {
            columns: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      const rawRecipients = list.map((reg: any) => {
        if (reg.student) return { ...reg.student, type: "student" as const }
        return null
      }).filter((r: any): r is NonNullable<typeof r> => Boolean(r?.email))

      const uniqueMap = new Map<string, typeof rawRecipients[number]>()
      for (const person of rawRecipients) {
        const email = person.email.trim().toLowerCase()
        if (!uniqueMap.has(email)) {
          uniqueMap.set(email, person)
        }
      }
      recipients = Array.from(uniqueMap.values())

    } else if (audience === "external_drive_participants") {
      const list = await db.query.driveRegistration.findMany({
        where: driveId ? eq(schema.driveRegistration.driveId, driveId) : undefined,
        with: {
          externalStudent: {
            columns: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })
      const rawRecipients = list.map((reg: any) => {
        if (reg.externalStudent) return { ...reg.externalStudent, type: "external_student" as const }
        return null
      }).filter((r: any): r is NonNullable<typeof r> => Boolean(r?.email))

      const uniqueMap = new Map<string, typeof rawRecipients[number]>()
      for (const person of rawRecipients) {
        const email = person.email.trim().toLowerCase()
        if (!uniqueMap.has(email)) {
          uniqueMap.set(email, person)
        }
      }
      recipients = Array.from(uniqueMap.values())
    } else if (audience === "alumni_drive_participants") {
      const list = await db.query.driveRegistration.findMany({
        where: driveId ? eq(schema.driveRegistration.driveId, driveId) : undefined,
        with: {
          alumni: {
            columns: {
              id: true,
              name: true,
              personalEmail: true,
            }
          }
        }
      })
      const rawRecipients = list.map((reg: any) => {
        if (reg.alumni) {
          return {
            id: reg.alumni.id,
            name: reg.alumni.name,
            email: reg.alumni.personalEmail,
            type: "alumni" as const,
          }
        }
        return null
      }).filter((r: any): r is NonNullable<typeof r> => Boolean(r?.email))

      const uniqueMap = new Map<string, typeof rawRecipients[number]>()
      for (const person of rawRecipients) {
        const email = person.email.trim().toLowerCase()
        if (!uniqueMap.has(email)) {
          uniqueMap.set(email, person)
        }
      }
      recipients = Array.from(uniqueMap.values())
    }

    if (recipients.length === 0) {
      console.log(`[NotificationService] No recipients found for audience "${audience}". Aborting broadcast.`);
      return { success: false, message: `No recipients found for audience ${audience}, Course: ${course}, Branch: ${branch}` }
    }

    console.log(`[NotificationService] Resolved ${recipients.length} targets. Dispatching in chunks...`);

    // Helper to chunk delivery safely
    const chunks = this.chunkArray(recipients, BROADCAST_BATCH_SIZE);

    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(async (recipient) => {
          const inAppHTML = `
            <div class="p-2">
              <p class="font-medium text-foreground">${subject}</p>
              <p class="text-xs text-muted-foreground mt-1">${message}</p>
            </div>
          `;

          await this.notifyUser({
            email: channels.includes("email")
              ? {
                to: recipient.email,
                subject: subject,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                      <p style="line-height: 1.6; font-size: 15px;">${message}</p>
                      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                      <p style="font-size: 12px; color: #999;">This is an administrative broadcast from Radharaman Group of Institutes (RGI) Training & Placement Cell.</p>
                    </div>
                  `,
                template: "custom_broadcast",
                approvalId: recipient.id,
                approvalType: "Recipeint_Data",
                actionType: "message",
              }
              : undefined,
            inApp: channels.includes("in_app")
              ? {
                type: "broadcast",
                title: subject,
                message: message,
              }
              : undefined,
            triggeredBy,
            recipient: {
              id: recipient.id,
              type: recipient.type,
            },
          });
        })
      );
    }

    console.log(`[NotificationService] Broadcast to ${recipients.length} recipients completed.`);
    return { success: true, message: `Broadcast completed` }
  }

  private static chunkArray<T>(items: T[], size: number) {
    const chunks: T[][] = [];
    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size));
    }
    return chunks;
  }
}
