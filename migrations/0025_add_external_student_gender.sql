-- Add gender column to ExternalStudent
ALTER TABLE "ExternalStudent" ADD COLUMN "gender" TEXT NOT NULL DEFAULT 'Not Specified';