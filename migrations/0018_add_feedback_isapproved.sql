-- Migration: Add isApproved column to feedback tables
-- These columns are missing from the database but expected by Prisma schema

ALTER TABLE "StudentFeedback" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AlumniFeedback" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CorporateFeedback" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
