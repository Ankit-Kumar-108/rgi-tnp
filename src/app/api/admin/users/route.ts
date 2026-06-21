export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { eq, inArray, and, or, like, gte, notInArray, count } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { deleteMultipleFromR2 } from "@/lib/r2-delete";
import { COURSE_SEMESTER_MAP, MAX_SEMESTERS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "student";
    const branch = searchParams.get("branch");
    const passoutOnly = searchParams.get("passout_only") === "true";
    const search = searchParams.get("search");
    const parsedLimit = parseInt(searchParams.get("limit") || "100", 10);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);

    const limit = isNaN(parsedLimit) ? 100 : Math.max(1, parsedLimit);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const skip = (page - 1) * limit;

    const db = getDb();

    if (role === "student") {
      const conditions: any[] = [];
      if (branch) {
        conditions.push(eq(schema.student.branch, branch));
      }
      if (search) {
        conditions.push(
          or(
            like(schema.student.name, `%${search}%`),
            like(schema.student.enrollmentNumber, `%${search}%`),
            like(schema.student.email, `%${search}%`)
          )
        );
      }
      if (passoutOnly) {
        conditions.push(
          or(
            ...Object.entries(COURSE_SEMESTER_MAP).map(([course, maxSems]) => 
              and(
                eq(schema.student.course, course),
                gte(schema.student.semester, maxSems)
              )
            ),
            and(
              notInArray(schema.student.course, Object.keys(COURSE_SEMESTER_MAP)),
              gte(schema.student.semester, MAX_SEMESTERS)
            )
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [students, totalCountResult] = await Promise.all([
        db.query.student.findMany({
          where: whereClause,
          columns: {
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
          orderBy: (t, { desc }) => [desc(t.createdAt)],
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.student).where(whereClause)
      ]);
      
      const totalCount = totalCountResult[0]?.count || 0;
      return NextResponse.json({ success: true, users: students, role, totalCount });
    }

    if (role === "alumni") {
      const conditions: any[] = [];
      if (search) {
        conditions.push(
          or(
            like(schema.alumni.name, `%${search}%`),
            like(schema.alumni.enrollmentNumber, `%${search}%`),
            like(schema.alumni.personalEmail, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [alumni, totalCountResult] = await Promise.all([
        db.query.alumni.findMany({
          where: whereClause,
          columns: {
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
          orderBy: (t, { desc }) => [desc(t.createdAt)],
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.alumni).where(whereClause)
      ]);
      const totalCount = totalCountResult[0]?.count || 0;
      return NextResponse.json({ success: true, users: alumni, role, totalCount });
    }

    if (role === "recruiter") {
      const conditions: any[] = [];
      if (search) {
        conditions.push(
          or(
            like(schema.recruiter.name, `%${search}%`),
            like(schema.recruiter.email, `%${search}%`),
            like(schema.recruiter.company, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [recruiters, totalCountResult] = await Promise.all([
        db.query.recruiter.findMany({
          where: whereClause,
          columns: {
            id: true,
            name: true,
            email: true,
            company: true,
            designation: true,
            phoneNumber: true,
          },
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.recruiter).where(whereClause)
      ]);
      const totalCount = totalCountResult[0]?.count || 0;
      return NextResponse.json({ success: true, users: recruiters, role, totalCount });
    }

    if (role === "external") {
      const conditions: any[] = [];
      if (search) {
        conditions.push(
          or(
            like(schema.externalStudent.name, `%${search}%`),
            like(schema.externalStudent.enrollmentNumber, `%${search}%`),
            like(schema.externalStudent.email, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [externals, totalCountResult] = await Promise.all([
        db.query.externalStudent.findMany({
          where: whereClause,
          columns: {
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
          limit,
          offset: skip,
        }),
        db.select({ count: count() }).from(schema.externalStudent).where(whereClause)
      ]);
      const totalCount = totalCountResult[0]?.count || 0;
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
    const { ids, action, role } = (await req.json()) as any;
    
    if (!ids || !Array.isArray(ids) || action !== "approve" || !role) {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const db = getDb();
    switch (role) {
      case "student":
        await db.update(schema.student)
          .set({ 
            isEmailVerified: true,
            isVerified: true
          })
          .where(inArray(schema.student.id, ids));
        break;

      case "alumni":
        await db.update(schema.alumni)
          .set({ 
            isVerified: true,
          })
          .where(inArray(schema.alumni.id, ids));
        break;

      case "external":
        await db.update(schema.externalStudent)
          .set({ 
            isVerified: true,
          })
          .where(inArray(schema.externalStudent.id, ids));
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
      case "student": {
        const students = await db.query.student.findMany({
          where: inArray(schema.student.id, ids),
          columns: { profileImageUrl: true, resumeUrl: true },
        });
        const studentUrls = students
          .flatMap((s) => [s.profileImageUrl, s.resumeUrl])
          .filter((url): url is string => Boolean(url));

        await db.delete(schema.driveRegistration).where(inArray(schema.driveRegistration.studentId, ids));
        await db.delete(schema.student).where(inArray(schema.student.id, ids));

        if (studentUrls.length > 0) await deleteMultipleFromR2(studentUrls);
        break;
      }

      case "alumni": {
        const alumniRecords = await db.query.alumni.findMany({
          where: inArray(schema.alumni.id, ids),
          columns: { profileImageUrl: true },
        });
        const alumniUrls = alumniRecords
          .map((a) => a.profileImageUrl)
          .filter(Boolean);

        await db.delete(schema.alumni).where(inArray(schema.alumni.id, ids));

        if (alumniUrls.length > 0) await deleteMultipleFromR2(alumniUrls);
        break;
      }

      case "recruiter":
        await db.delete(schema.recruiter).where(inArray(schema.recruiter.id, ids));
        break;

      case "external": {
        const externals = await db.query.externalStudent.findMany({
          where: inArray(schema.externalStudent.id, ids),
          columns: { profileImageUrl: true, resumeUrl: true },
        });
        const externalUrls = externals
          .flatMap((s) => [s.profileImageUrl, s.resumeUrl])
          .filter((url): url is string => Boolean(url));

        await db.delete(schema.driveRegistration).where(inArray(schema.driveRegistration.externalStudentId, ids));
        await db.delete(schema.externalStudent).where(inArray(schema.externalStudent.id, ids));

        if (externalUrls.length > 0) await deleteMultipleFromR2(externalUrls);
        break;
      }

      default:
        return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${role}s deleted successfully` });
  } catch (error) {
    console.error("Admin Users DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete users" }, { status: 500 });
  }
}

