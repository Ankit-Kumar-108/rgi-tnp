export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { rejectionEmailTemplate } from "@/lib/email-templates";
import { shortlistedEmailTemplate } from "@/lib/email-templates";
import { offerSelectionEmailTemplate } from "@/lib/email-templates";

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
    const query: Prisma.DriveRegistrationFindManyArgs = {
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
        }
      },
      orderBy: { createdAt: "desc" }
    };

    const [registrations, totalCount, drive] = await Promise.all([
      db.driveRegistration.findMany(query),
      db.driveRegistration.count({ where: { driveId: id } }),
      db.placementDrive.findUnique({
        where: { id },
        select: { googleSheetUrl: true, companyName: true, roleName: true }
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

    // Update all registrations with the new status
    await db.driveRegistration.updateMany({
      where: {
        id: { in: registrationIds },
        driveId: driveId
      },
      data: { status }
    });

    // Send emails to all updated registrations if status is "selected"
    if (status.toLowerCase() === "selected") {
      try {
        // Fetch all updated registrations with their data
        const updatedRegistrations = await db.driveRegistration.findMany({
          where: {
            id: { in: registrationIds }
          },
          select: {
            id: true,
            drive: {
              select: {
                companyName: true,
                roleName: true,
                ctc: true
              }
            },
            student: {
              select: {
                name: true,
                email: true
              }
            },
            externalStudent: {
              select: {
                name: true,
                email: true
              }
            }
          }

        });

        // Send email to each selected student
        for (const reg of updatedRegistrations) {
          const studentData = reg.student || reg.externalStudent;
          if (studentData?.email && studentData?.name && reg.drive?.companyName && reg.drive?.roleName && reg.drive?.ctc) {
            try {
              await sendEmail({
                to: studentData.email,
                subject: `Selected for ${reg.drive.companyName} Campus Drive`,
                html: offerSelectionEmailTemplate(
                  studentData.name,
                  reg.drive.roleName,
                  reg.drive.companyName,
                  reg.drive.ctc,
                  "Sent Later",
                )
              });
            } catch (emailError) {
              console.error(`Failed to send email to ${studentData.email}:`, {
                error: emailError instanceof Error ? emailError.message : String(emailError),
                stack: emailError instanceof Error ? emailError.stack : null
              });
            }
          }
        }

      } catch (emailError) {
        console.error("Error processing selection emails:", emailError);
      }
    }

    if (status.toLowerCase() === "rejected") {
      try {
        // Fetch all updated registrations with their data
        const updatedRegistrations = await db.driveRegistration.findMany({
          where: {
            id: { in: registrationIds }
          },
          select: {
            id: true,
            drive: {
              select: {
                companyName: true,
                roleName: true
              }
            },
            student: {
              select: {
                name: true,
                email: true
              }
            },
            externalStudent: {
              select: {
                name: true,
                email: true
              }
            }
          }

        });

        // Send email to each rejected student
        for (const reg of updatedRegistrations) {
          const studentData = reg.student || reg.externalStudent;
          if (studentData?.email && studentData?.name && reg.drive?.companyName && reg.drive?.roleName) {
            try {
              await sendEmail({
                to: studentData.email,
                subject: `Update on ${reg.drive.companyName} Campus Drive application`,
                html: rejectionEmailTemplate(
                  studentData.name,
                  reg.drive.roleName,
                  reg.drive.companyName
                )
              });
            } catch (emailError) {
              console.error(`Failed to send email to ${studentData.email}:`, {
                error: emailError instanceof Error ? emailError.message : String(emailError),
                stack: emailError instanceof Error ? emailError.stack : null
              });
            }
          }
        }

      } catch (emailError) {
        console.error("Error processing rejection emails:", emailError);
      }
    }

    if(status.toLowerCase() === "shortlisted") {
      try {
        // Fetch all updated registrations with their data
        const updatedRegistrations = await db.driveRegistration.findMany({
          where: {
            id: { in: registrationIds }
          },
          select: {
            id: true,
            drive: {
              select: {
                companyName: true,
                roleName: true
              }
            },
            student: {
              select: {
                name: true,
                email: true
              }
            },
            externalStudent: {
              select: {
                name: true,
                email: true
              }
            }
          }

        });

        // Send email to each shortlisted student
        for (const reg of updatedRegistrations) {
          const studentData = reg.student || reg.externalStudent;
          if (studentData?.email && studentData?.name && reg.drive?.companyName && reg.drive?.roleName) {
            try {
              await sendEmail({
                to: studentData.email,
                subject: `Shortlisted for ${reg.drive.companyName} Campus Drive`,
                html: shortlistedEmailTemplate(
                  studentData.name,
                  reg.drive.roleName,
                  reg.drive.companyName,
                  "Today in 10 Minutes",
                  "RGI Seminar Hall",
                  "Robin Samul (TPO)",
                )
              });
            } catch (emailError) {
              console.error(`Failed to send email to ${studentData.email}:`, {
                error: emailError instanceof Error ? emailError.message : String(emailError),
                stack: emailError instanceof Error ? emailError.stack : null
              });
            }
          }
        }

      } catch (emailError) {
        console.error("Error processing shortlisted emails:", emailError);
      }
    }


    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    console.error("Update participant error:", err);
    return NextResponse.json({ success: false, message: "Failed to update status" }, { status: 500 });
  }
}
