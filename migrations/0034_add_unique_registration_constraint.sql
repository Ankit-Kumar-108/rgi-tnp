-- Migration 0034: Add unique constraints to prevent duplicate registrations
-- Without this, two concurrent registration requests for the same student+drive
-- can both pass the findFirst() check and create duplicate rows.
-- These partial unique indexes enforce uniqueness at the DB level.
-- Created: 2026-06-17

-- Prevent duplicate student registrations per drive
CREATE UNIQUE INDEX IF NOT EXISTS "DriveRegistration_driveId_studentId_unique"
ON "DriveRegistration"("driveId", "studentId")
WHERE "studentId" IS NOT NULL;

-- Prevent duplicate external student registrations per drive
CREATE UNIQUE INDEX IF NOT EXISTS "DriveRegistration_driveId_externalStudentId_unique"
ON "DriveRegistration"("driveId", "externalStudentId")
WHERE "externalStudentId" IS NOT NULL;

-- Prevent duplicate alumni registrations per drive
CREATE UNIQUE INDEX IF NOT EXISTS "DriveRegistration_driveId_alumniId_unique"
ON "DriveRegistration"("driveId", "alumniId")
WHERE "alumniId" IS NOT NULL;
