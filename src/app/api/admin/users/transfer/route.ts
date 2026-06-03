export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
        const student = await db.student.findUnique({
          where: { id: studentId },
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

        const existingAlumni = await db.alumni.findUnique({
          where: { enrollmentNumber: student.enrollmentNumber },
        });

        if (existingAlumni) {
          skipped++;
          if (errors.length < 5)
            errors.push(`${student.enrollmentNumber}: Already exists in Alumni`);
          continue;
        }

        const emailExists = await db.alumni.findUnique({
          where: { personalEmail: student.email },
        });

        if (emailExists) {
          skipped++;
          if (errors.length < 5)
            errors.push(
              `${student.enrollmentNumber}: Email ${student.email} already used by another alumni`
            );
          continue;
        }

        await db.$executeRawUnsafe(
          `INSERT OR REPLACE INTO "AlumniMaster" ("id", "enrollmentNumber", "name", "branch", "course", "batch")
           VALUES (COALESCE((SELECT "id" FROM "AlumniMaster" WHERE "enrollmentNumber" = ?), ?), ?, ?, ?, ?, ?)`,
          student.enrollmentNumber,
          generateId(),
          student.enrollmentNumber,
          student.name,
          student.branch,
          student.course,
          student.batch,
          student.cgpa,
          student.twelfthPercentage,
          student.tenthPercentage
        );

        let placementSnapsJson: any[] = [];
        if (placementDetails?.currentCompany) {
          placementSnapsJson = [{
            company: placementDetails.currentCompany,
            role: placementDetails.jobTitle,
            transferredAt: new Date().toISOString(),
          }];
        }

        const newAlumni = await db.alumni.create({
          data: {
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
            tenthPercentage: student.tenthPercentage
          },
        });

        await db.memory.updateMany({
          where: { studentId: student.id },
          data: { studentId: null, alumniId: newAlumni.id },
        });

        await db.notification.updateMany({
          where: { studentId: student.id },
          data: { studentId: null, alumniId: newAlumni.id, recipientType: "alumni" },
        });

        await db.driveRegistration.deleteMany({ where: { studentId: student.id } });
        await db.studentFeedback.deleteMany({ where: { studentId: student.id } });
        await db.volunteerStudentStatus.deleteMany({ where: { studentId: student.id } });
        await db.volunteer.deleteMany({ where: { studentId: student.id } });

        await db.student.delete({ where: { id: student.id } });

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
        // Perstudent catch so one failure doesn't stop the batch
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
