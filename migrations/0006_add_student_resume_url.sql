-- Migration: 0006_add_student_resume_url
-- Description: Adds the resumeUrl column to the Student table to match the current Prisma schema.

ALTER TABLE "Student" ADD COLUMN "resumeUrl" TEXT;
