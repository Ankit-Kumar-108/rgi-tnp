export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "student";
    const branch = searchParams.get("branch");
    const search = searchParams.get("search");

    const db = getDb();

    if (role === "student") {
      const where: any = {};
      if (branch) where.branch = branch;
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { enrollmentNumber: { contains: search } },
          { email: { contains: search } },
        ];
      }
      const students = await db.student.findMany({
        where,
        select: {
          id: true,
          name: true,
          enrollmentNumber: true,
          email: true,
          branch: true,
          semester: true,
          cgpa: true,
          isEmailVerified: true,
          profileImageUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return NextResponse.json({ success: true, users: students, role });
    }

    if (role === "alumni") {
      const alumni = await db.alumni.findMany({
        select: {
          id: true,
          name: true,
          enrollmentNumber: true,
          personalEmail: true,
          isVerified: true,
          currentCompany: true,
          jobTitle: true,
          city: true,
          country: true,
          profileImageUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return NextResponse.json({ success: true, users: alumni, role });
    }

    if (role === "recruiter") {
      const recruiters = await db.recruiter.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          designation: true,
          phoneNumber: true,
        },
        take: 100,
      });
      return NextResponse.json({ success: true, users: recruiters, role });
    }

    if (role === "external") {
      const externals = await db.externalStudent.findMany({
        select: {
          id: true,
          name: true,
          collegeName: true,
          enrollmentNumber: true,
          email: true,
          branch: true,
          cgpa: true,
          isVerified: true,
          profileImageUrl: true,
        },
        take: 100,
      });
      return NextResponse.json({ success: true, users: externals, role });
    }

    return NextResponse.json(
      { success: false, message: "Invalid role" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin Users Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { ids, action } = (await req.json()) as any;
    if (!ids || !Array.isArray(ids) || action !== "approve") {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const db = getDb();
    await db.externalStudent.updateMany({
      where: { id: { in: ids } },
      data: { isVerified: true },
    });

    return NextResponse.json({ success: true, message: "Users approved successfully" });
  } catch (error) {
    console.error("Admin Users PATCH Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update users" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { ids, action } = (await req.json()) as any;
    if (!ids || !Array.isArray(ids) || action !== "delete") {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const db = getDb();
    
    // Also delete any existing registrations for these external students to maintain referential integrity
    await db.driveRegistration.deleteMany({
      where: { externalStudentId: { in: ids } },
    });
    
    await db.externalStudent.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ success: true, message: "Users deleted successfully" });
  } catch (error) {
    console.error("Admin Users DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete users" }, { status: 500 });
  }
}
