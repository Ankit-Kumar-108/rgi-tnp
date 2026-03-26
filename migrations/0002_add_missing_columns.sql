-- Migration: 0002_add_missing_columns
-- Adds columns that were added to schema.prisma but never migrated to D1

-- StudentMaster: add course column, fix batch to TEXT
ALTER TABLE "StudentMaster" ADD COLUMN "course" TEXT NOT NULL DEFAULT '';
-- Note: SQLite doesn't support ALTER COLUMN. batch was REAL, should be TEXT.
-- We'll work around it since SQLite is flexible with types.

-- AlumniMaster: add course column
ALTER TABLE "AlumniMaster" ADD COLUMN "course" TEXT NOT NULL DEFAULT '';

-- Student: add batch, course columns
ALTER TABLE "Student" ADD COLUMN "batch" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Student" ADD COLUMN "course" TEXT NOT NULL DEFAULT '';

-- Alumni: add batch, course columns
ALTER TABLE "Alumni" ADD COLUMN "batch" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Alumni" ADD COLUMN "course" TEXT NOT NULL DEFAULT '';

-- ExternalStudent: add course, batch, phoneNumber, isVerified, role columns
ALTER TABLE "ExternalStudent" ADD COLUMN "course" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ExternalStudent" ADD COLUMN "batch" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ExternalStudent" ADD COLUMN "phoneNumber" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ExternalStudent" ADD COLUMN "isVerified" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ExternalStudent" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'external_student';

-- PlacementDrive: add minBatch, maxBatch, course columns
ALTER TABLE "PlacementDrive" ADD COLUMN "minBatch" TEXT NOT NULL DEFAULT '';
ALTER TABLE "PlacementDrive" ADD COLUMN "maxBatch" TEXT NOT NULL DEFAULT '';
ALTER TABLE "PlacementDrive" ADD COLUMN "course" TEXT NOT NULL DEFAULT '';

-- Create AlumniFeedback table (replaces old Feedback table)
CREATE TABLE IF NOT EXISTS "AlumniFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "alumniId" TEXT NOT NULL,
    CONSTRAINT "AlumniFeedback_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create StudentFeedback table
CREATE TABLE IF NOT EXISTS "StudentFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,
    CONSTRAINT "StudentFeedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create CorporateFeedback table
CREATE TABLE IF NOT EXISTS "CorporateFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "recruiterId" TEXT NOT NULL,
    CONSTRAINT "CorporateFeedback_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
