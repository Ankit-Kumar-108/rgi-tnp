export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    
    // Explicitly type the query to help the compiler
    const query: Prisma.DriveRegistrationFindManyArgs = {
      where: { driveId: id },
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
            resumeUrl: true
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
            collegeName: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    };

    const registrations = await db.driveRegistration.findMany(query);
    
    const drive = await db.placementDrive.findUnique({
      where: { id },
      select: { googleSheetUrl: true, companyName: true, roleName: true }
    });

    return NextResponse.json({ success: true, registrations, drive });
  } catch (error) {
    console.error("Fetch participants error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch participants" }, { status: 500 });
  }
}

// Update participant statuses (e.g. promoting them to next round)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const db = getDb();
        const body = await req.json() as any;
        const { registrationIds, status } = body;

        if (!registrationIds || !Array.isArray(registrationIds) || !status) {
             return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
        }

        await db.driveRegistration.updateMany({
            where: {
                id: { in: registrationIds },
                driveId: id 
            },
            data: { status }
        });

        return NextResponse.json({ success: true, message: `Status updated to ${status}` });
    } catch(err) {
        console.error("Update participant error:", err);
        return NextResponse.json({ success: false, message: "Failed to update status" }, { status: 500 });
    }
}
