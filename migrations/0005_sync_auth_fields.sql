-- Migration: 0005_sync_auth_fields
-- Adds missing authentication fields to all user models to match Prisma schema

-- Student
ALTER TABLE "Student" ADD COLUMN "resetPasswordToken" TEXT;
ALTER TABLE "Student" ADD COLUMN "resetPasswordTokenExpiry" DATETIME;

-- Alumni
ALTER TABLE "Alumni" ADD COLUMN "emailVerificationToken" TEXT;
ALTER TABLE "Alumni" ADD COLUMN "emailVerificationTokenExpiry" DATETIME;
ALTER TABLE "Alumni" ADD COLUMN "resetPasswordToken" TEXT;
ALTER TABLE "Alumni" ADD COLUMN "resetPasswordTokenExpiry" DATETIME;

-- ExternalStudent
ALTER TABLE "ExternalStudent" ADD COLUMN "resetPasswordToken" TEXT;
ALTER TABLE "ExternalStudent" ADD COLUMN "resetPasswordTokenExpiry" DATETIME;
