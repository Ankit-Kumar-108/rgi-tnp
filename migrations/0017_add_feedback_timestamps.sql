-- Migration: Add timestamps to feedback tables
-- Add missing createdAt and updatedAt columns to AlumniFeedback, StudentFeedback, and CorporateFeedback

-- Add to AlumniFeedback
ALTER TABLE "AlumniFeedback" ADD COLUMN "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "AlumniFeedback" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add to StudentFeedback
ALTER TABLE "StudentFeedback" ADD COLUMN "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "StudentFeedback" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add to CorporateFeedback
ALTER TABLE "CorporateFeedback" ADD COLUMN "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "CorporateFeedback" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
