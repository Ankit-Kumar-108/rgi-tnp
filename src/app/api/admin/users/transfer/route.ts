export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { getMaxSemestersForCourse } from "@/lib/constants";
import { NotificationService } from "@/lib/notification-service";
import { alumniTransferTemplate } from "@/lib/email-templates";

function generateId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 25);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      studentIds: string[];
      placementDetails?: {
        currentCompany: string;
        jobTitle: string;
      };
    };

    const { studentIds, placementDetails } = body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No student IDs provided" },
        { status: 400 }
      );
    }

    if (studentIds.length > 200) {
      return NextResponse.json(
        { success: false, message: "Maximum 200 students per transfer batch" },
        { status: 400 }
      );
    }

    const db = getDb();
    let transferred = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const studentId of studentIds) {
      try {
        const student = await db.query.student.findFirst({
          where: eq(schema.student.id, studentId),
        });

        if (!student) {
          skipped++;
          if (errors.length < 5) errors.push(`Student ${studentId}: Not found`);
          continue;
        }

        const maxSem = getMaxSemestersForCourse(student.course);
        if (student.semester < maxSem) {
          skipped++;
          if (errors.length < 5)
            errors.push(
              `${student.enrollmentNumber}: Not a pass-out (Sem ${student.semester}/${maxSem})`
            );
          continue;
        }

        const existingAlumni = await db.query.alumni.findFirst({
          where: eq(schema.alumni.enrollmentNumber, student.enrollmentNumber),
        });

        if (existingAlumni) {
          skipped++;
          if (errors.length < 5)
            errors.push(`${student.enrollmentNumber}: Already exists in Alumni`);
          continue;
        }

        const emailExists = await db.query.alumni.findFirst({
          where: eq(schema.alumni.personalEmail, student.email),
        });

        if (emailExists) {
          skipped++;
          if (errors.length < 5)
            errors.push(
              `${student.enrollmentNumber}: Email ${student.email} already used by another alumni`
            );
          continue;
        }

        await db.run(
          sql`INSERT OR REPLACE INTO "AlumniMaster" ("id", "enrollmentNumber", "name", "branch", "course", "batch")
              VALUES (COALESCE((SELECT "id" FROM "AlumniMaster" WHERE "enrollmentNumber" = ${student.enrollmentNumber}), ${generateId()}), ${student.enrollmentNumber}, ${student.name}, ${student.branch}, ${student.course}, ${student.batch})`
        );

        let placementSnapsJson: any[] = [];
        if (placementDetails?.currentCompany) {
          placementSnapsJson = [{
            company: placementDetails.currentCompany,
            role: placementDetails.jobTitle,
            transferredAt: new Date().toISOString(),
          }];
        }

        const insertResult = await db.insert(schema.alumni)
          .values({
            name: student.name,
            enrollmentNumber: student.enrollmentNumber,
            personalEmail: student.email,
            passwordHash: student.passwordHash,
            branch: student.branch,
            course: student.course,
            batch: student.batch,
            profileImageUrl: student.profileImageUrl || "",
            phoneNumber: student.phoneNumber || null,
            linkedInUrl: student.linkedinUrl || null,
            currentCompany: placementDetails?.currentCompany || null,
            jobTitle: placementDetails?.jobTitle || null,
            isVerified: true,
            isProfileComplete: false,
            isTransferred: true,
            placementSnapsJson: placementSnapsJson,
            cgpa: student.cgpa,
            twelfthPercentage: student.twelfthPercentage,
            tenthPercentage: student.tenthPercentage,
            gender: student.gender
          })
          .returning();
        const newAlumni = insertResult[0];

        await db.update(schema.memory)
          .set({ studentId: null, alumniId: newAlumni.id })
          .where(eq(schema.memory.studentId, student.id));

        await db.update(schema.notification)
          .set({ studentId: null, alumniId: newAlumni.id, recipientType: "alumni" })
          .where(eq(schema.notification.studentId, student.id));

        await db.delete(schema.driveRegistration).where(eq(schema.driveRegistration.studentId, student.id));
        await db.delete(schema.studentFeedback).where(eq(schema.studentFeedback.studentId, student.id));
        await db.delete(schema.volunteerStudentStatus).where(eq(schema.volunteerStudentStatus.studentId, student.id));
        await db.delete(schema.volunteer).where(eq(schema.volunteer.studentId, student.id));

        await db.delete(schema.student).where(eq(schema.student.id, student.id));

        const host = req.headers.get("host");
        const protocol = host?.includes("localhost") ? "http" : "https";
        const alumniLoginLink = `${protocol}://${host}/alumni/login`;

        await NotificationService.sendEmailWithLog({
          to: student.email,
          subject: "Your Account Has Been Upgraded to Alumni — RGI Training & Placement Department",
          html: alumniTransferTemplate(student.name, placementDetails, alumniLoginLink),
          template: "alumni_transfer",
          triggeredBy: req.headers.get("x-admin-email") || "admin",
          recipientType: "alumni",
          approvalId: newAlumni.id,
          approvalType: "alumni_transfer",
          actionType: "transferred",
        });

        transferred++;
      } catch (err: any) {
        // Per-student catch so one failure doesn't stop the batch
        const msg = err?.message || String(err);
        console.error(`[TRANSFER] Failed for student ${studentId}:`, msg);
        if (errors.length < 5) errors.push(`${studentId}: ${msg}`);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Transfer complete: ${transferred} transferred, ${skipped} skipped`,
      transferred,
      skipped,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error: any) {
    console.error("[TRANSFER] Fatal error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Transfer failed" },
      { status: 500 }
    );
  }
}

