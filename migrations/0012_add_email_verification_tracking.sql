-- Migration: Add email verification failure tracking columns

ALTER TABLE "Student" ADD COLUMN "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Student" ADD COLUMN "emailVerificationError" TEXT;

ALTER TABLE "Alumni" ADD COLUMN "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Alumni" ADD COLUMN "emailVerificationError" TEXT;

ALTER TABLE "ExternalStudent" ADD COLUMN "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ExternalStudent" ADD COLUMN "emailVerificationError" TEXT;
