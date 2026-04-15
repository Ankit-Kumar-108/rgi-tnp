export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "student";
    const branch = searchParams.get("branch");
    const search = searchParams.get("search");
    const parsedLimit = parseInt(searchParams.get("limit") || "100", 10);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);

    const limit = isNaN(parsedLimit) ? 100 : Math.max(1, parsedLimit);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const skip = (page - 1) * limit;

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

      const [students, totalCount] = await Promise.all([
        db.student.findMany({
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
            phoneNumber: true,
            resumeUrl: true,
            linkedinUrl: true,
            githubUrl: true,
            course: true,
            batch: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.student.count({ where })
      ])
      return NextResponse.json({ success: true, users: students, role, totalCount });
    }

    if (role === "alumni") {
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { enrollmentNumber: { contains: search } },
          { personalEmail: { contains: search } },
        ];
      }

      const [alumni, totalCount] = await Promise.all([
        db.alumni.findMany({
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
            phoneNumber: true,
            linkedInUrl: true,
            course: true,
            batch: true,
            
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip,
        }),
        db.alumni.count({ where })
      ])
      return NextResponse.json({ success: true, users: alumni, role, totalCount });
    }


    if (role === "recruiter") {
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { email: { contains: search } },
          { company: { contains: search } },
        ];
      }

      const [recruiters, totalCount] = await Promise.all([
        db.recruiter.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            designation: true,
            phoneNumber: true,
          },
          take: limit,
          skip: skip,
        }),
        db.recruiter.count({ where })
      ])
      return NextResponse.json({ success: true, users: recruiters, role, totalCount });
    }

    if (role === "external") {
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { enrollmentNumber: { contains: search } },
          { email: { contains: search } },
        ];
      }

      const [externals, totalCount] = await Promise.all([
        db.externalStudent.findMany({
          where,
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
            phoneNumber: true,
            resumeUrl: true,
            linkedinUrl: true,
            githubUrl: true,
            course: true,
            batch: true,

          },
          take: limit,
          skip: skip,
        }),
        db.externalStudent.count({ where })
      ])
      return NextResponse.json({ success: true, users: externals, role, totalCount });
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
    // 1. Extract role from the payload
    const { ids, action, role } = (await req.json()) as any;
    
    if (!ids || !Array.isArray(ids) || action !== "approve" || !role) {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const db = getDb();
    switch (role) {
      case "student":
        await db.student.updateMany({
          where: { id: { in: ids } },
          data: { isEmailVerified: true }, 
        });
        break;

      case "alumni":
        await db.alumni.updateMany({
          where: { id: { in: ids } },
          data: { isVerified: true }, 
        });
        break;

      case "external":
        await db.externalStudent.updateMany({
          where: { id: { in: ids } },
          data: { isVerified: true },
        });
        break;

      case "recruiter":
        return NextResponse.json({ success: false, message: "Recruiters do not require approval" }, { status: 400 });
      default:
        return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${role}s approved successfully` });
  } catch (error) {
    console.error("Admin Users PATCH Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update users" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { ids, action, role } = (await req.json()) as any;
    if (!ids || !Array.isArray(ids) || action !== "delete" || !role) {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const db = getDb();
    switch (role) {
      case "student":
        await db.driveRegistration.deleteMany({
          where: { studentId: { in: ids } },
        });
        await db.student.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "alumni":
        await db.alumni.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "recruiter":
        await db.recruiter.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "external":
        await db.driveRegistration.deleteMany({
          where: { externalStudentId: { in: ids } },
        });
        await db.externalStudent.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      default:
        return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${role}s deleted successfully` });
  } catch (error) {
    console.error("Admin Users DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete users" }, { status: 500 });
  }
}
