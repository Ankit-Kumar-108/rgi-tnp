-- Migration: 0004_add_external_verification
-- Adds verification tokens to ExternalStudent

ALTER TABLE "ExternalStudent" ADD COLUMN "emailVerificationToken" TEXT;
ALTER TABLE "ExternalStudent" ADD COLUMN "emailVerificationTokenExpiry" DATETIME;
