export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
// import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { rejectionEmailTemplate } from "@/lib/email-templates";
import { shortlistedEmailTemplate } from "@/lib/email-templates";
import { offerSelectionEmailTemplate } from "@/lib/email-templates";
import { NotificationService } from "@/lib/notification-service";


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
                ctc: true,
                id: true
              }
            },
            student: {
              select: {
                name: true,
                email: true,
                id: true
              }
            },
            externalStudent: {
              select: {
                name: true,
                email: true,
                id: true
              }
            },
            alumni: {
              select: {
                name: true,
                personalEmail: true,
                id: true
              }
            }
          }

        });

        // Send emails to all selected students in PARALLEL (not sequential)
        const emailPromises = updatedRegistrations
          .filter(reg => {
            const studentData = reg.student || reg.externalStudent || (reg.alumni ? { ...reg.alumni, email: reg.alumni.personalEmail } : null);
            return studentData?.email && studentData?.name && reg.drive?.companyName && reg.drive?.roleName && reg.drive?.ctc;
          })
          .map(async (reg) => {
            const studentData = reg.student || reg.externalStudent || (reg.alumni ? { ...reg.alumni, email: reg.alumni.personalEmail } : null);
            await NotificationService.notifyUser({
              email: {
                to: studentData!.email,
                subject: `Selected for next round for ${reg.drive!.companyName} Campus Drive`,
                html: offerSelectionEmailTemplate(
                  studentData!.name,
                  reg.drive!.roleName,
                  reg.drive!.companyName,
                  reg.drive!.ctc,
                  reg.drive!.roleName,
                ),
                template: "offerSelectionTemplate",
                approvalType: "participants_selection",
                approvalId: reg.drive.id,
                actionType: "selected for the next round",
              },
              inApp:{
                type: "participant_selection",
                title: "You're Selected For the next round!",
                message: `Selected for the next round at ${reg.drive!.companyName} drive`,
              },
              triggeredBy: "system",
              recipient: {
                id: studentData!.id,
                type: reg.student ? "student" : reg.externalStudent ? "external_student" : "alumni"
              }
      }).catch(emailError => {
        console.error(`Failed to send email to ${studentData!.email}:`, {
          error: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : null
        });
      });
    });

    // Wait for all emails to send (parallel, not sequential)
    if (emailPromises.length > 0) {
      await Promise.all(emailPromises);
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
            roleName: true,
            id: true
          }
        },
        student: {
          select: {
            name: true,
            email: true,
            id: true
          }
        },
        externalStudent: {
          select: {
            name: true,
            email: true,
            id: true
          }
        },
        alumni: {
          select: {
            name: true,
            personalEmail: true,
            id: true
          }
        }
      }

    });

    // Send emails to all rejected students in PARALLEL (not sequential)
    const emailPromises = updatedRegistrations
      .filter(reg => {
        const studentData = reg.student || reg.externalStudent || (reg.alumni ? { ...reg.alumni, email: reg.alumni.personalEmail } : null);
        return studentData?.email && studentData?.name && reg.drive?.companyName && reg.drive?.roleName;
      })
      .map(async (reg) => {
        const studentData = reg.student || reg.externalStudent || (reg.alumni ? { ...reg.alumni, email: reg.alumni.personalEmail } : null);
        await NotificationService.notifyUser({
          email: {
            to: studentData!.email,
            subject: `Update on ${reg.drive!.companyName} Campus Drive application`,
            html: rejectionEmailTemplate(
              studentData!.name,
              reg.drive!.roleName,
              reg.drive!.companyName
            ),
            template: "rejectionEmailTemplate",
            approvalId: reg.drive.id,
            approvalType: "participant_rejection",
            actionType: "rejected"
          },
          inApp: {
            type: "participant_rejection",
            title: "Application Status Update",
            message: `Your application for ${reg.drive!.companyName} has been updated`,
          },
          triggeredBy: "system",
          recipient: {
            id: studentData!.id,
            type: reg.student ? "student" : reg.externalStudent ? "external_student" : "alumni"
          }
        }).catch(emailError => {
          console.error(`Failed to send email to ${studentData!.email}:`, {
            error: emailError instanceof Error ? emailError.message : String(emailError),
            stack: emailError instanceof Error ? emailError.stack : null
          });
        });
      });

    // Wait for all emails to send (parallel, not sequential)
    if (emailPromises.length > 0) {
      await Promise.all(emailPromises);
    }

  } catch (emailError) {
    console.error("Error processing rejection emails:", emailError);
  }
}

if (status.toLowerCase() === "shortlisted") {
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
            id: true,
          }
        },
        student: {
          select: {
            name: true,
            email: true,
            id: true
          }
        },
        externalStudent: {
          select: {
            name: true,
            email: true,
            id: true
          }
        },
        alumni: {
          select: {
            name: true,
            personalEmail: true,
            id: true
          }
        }
      }

    });

    // Send emails to all shortlisted students in PARALLEL (not sequential)
    const emailPromises = updatedRegistrations
      .filter(reg => {
        const studentData = reg.student || reg.externalStudent || (reg.alumni ? { ...reg.alumni, email: reg.alumni.personalEmail } : null);
        return studentData?.email && studentData?.name && reg.drive?.companyName && reg.drive?.roleName;
      })
      .map(reg => {
        const studentData = reg.student || reg.externalStudent || (reg.alumni ? { ...reg.alumni, email: reg.alumni.personalEmail } : null);
        return NotificationService.notifyUser({
          email: {
            to: studentData!.email,
            subject: `Shortlisted for ${reg.drive!.companyName} Campus Drive`,
            html: shortlistedEmailTemplate(
              studentData!.name,
              reg.drive!.roleName,
              reg.drive!.companyName,
              `${new Date().toLocaleDateString()} in 10 Minutes`,
              "RGI Seminar Hall",
              "Robin Samul (TPO)",
            ),
            template: "shortlisted",
            approvalType: "drive",
            approvalId: reg.drive!.id,
            actionType: "shortlisted"
          },
          triggeredBy: "admin",
          recipient: {
            id: studentData!.id,
            type: reg.student ? "student" : reg.externalStudent ? "external_student" : "alumni"
          }
        }).catch(emailError => {
          console.error(`Failed to send email to ${studentData!.email}:`, {
            error: emailError instanceof Error ? emailError.message : String(emailError),
            stack: emailError instanceof Error ? emailError.stack : null
          });
        });
      });

    // Wait for all emails to send (parallel, not sequential)
    if (emailPromises.length > 0) {
      await Promise.all(emailPromises);
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
