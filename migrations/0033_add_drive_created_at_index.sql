-- Migration 0033: Add composite index for paginated participant listing
-- Queries filtering by driveId and sorting by createdAt DESC (recruiter dashboard,
-- admin participants page) currently do a full scan + sort. This index makes them O(log n).
-- Created: 2026-06-17

CREATE INDEX IF NOT EXISTS "DriveRegistration_driveId_createdAt_idx"
ON "DriveRegistration"("driveId", "createdAt" DESC);
