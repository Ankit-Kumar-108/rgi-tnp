-- Migration: Add new fields to Referral table

ALTER TABLE "Referral" ADD COLUMN "jobType" TEXT;
ALTER TABLE "Referral" ADD COLUMN "location" TEXT;
ALTER TABLE "Referral" ADD COLUMN "minCGPA" REAL;
ALTER TABLE "Referral" ADD COLUMN "experience" TEXT;
ALTER TABLE "Referral" ADD COLUMN "batchEligible" TEXT;
ALTER TABLE "Referral" ADD COLUMN "refrerralLink" TEXT;
ALTER TABLE "Referral" ADD COLUMN "referralCode" TEXT;
ALTER TABLE "Referral" ADD COLUMN "deadline" DATETIME;
