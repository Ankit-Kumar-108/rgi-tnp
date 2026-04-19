-- Migration: Add missing email verification tracking columns
-- These columns were referenced in Prisma schema but missing from database
-- after migration 0009 table recreation

-- Add columns to Student table
ALTER TABLE "Student" ADD COLUMN "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Student" ADD COLUMN "emailVerificationError" TEXT;
ALTER TABLE "Student" ADD COLUMN "isProfileComplete" BOOLEAN NOT NULL DEFAULT false;

-- Add columns to Alumni table
ALTER TABLE "Alumni" ADD COLUMN "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Alumni" ADD COLUMN "emailVerificationError" TEXT;

-- Add columns to ExternalStudent table
ALTER TABLE "ExternalStudent" ADD COLUMN "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ExternalStudent" ADD COLUMN "emailVerificationError" TEXT;
ALTER TABLE "ExternalStudent" ADD COLUMN "isProfileComplete" BOOLEAN NOT NULL DEFAULT false;
