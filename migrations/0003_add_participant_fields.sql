-- Migration: 0003_add_participant_fields
-- Adds columns recently added to schema.prisma (Profile Images, Feedback, Status, JobType)

-- Student: add profileImageUrl, memoriesImageUrl (replacing old image field if it was there, or adding new ones)
ALTER TABLE "Student" ADD COLUMN "profileImageUrl" TEXT;
ALTER TABLE "Student" ADD COLUMN "memoriesImageUrl" TEXT;

-- Alumni: add profileImageUrl
ALTER TABLE "Alumni" ADD COLUMN "profileImageUrl" TEXT NOT NULL DEFAULT '';

-- ExternalStudent: add profileImageUrl, feedback
ALTER TABLE "ExternalStudent" ADD COLUMN "profileImageUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ExternalStudent" ADD COLUMN "feedback" TEXT;

-- PlacementDrive: add jobType
ALTER TABLE "PlacementDrive" ADD COLUMN "jobType" TEXT NOT NULL DEFAULT 'Full-Time';

-- DriveRegistration: add status
ALTER TABLE "DriveRegistration" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'Applied';
