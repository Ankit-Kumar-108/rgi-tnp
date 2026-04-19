-- Migration: Create Volunteer table
-- Purpose: Initialize Volunteer table for admin-assigned volunteers

CREATE TABLE IF NOT EXISTS "Volunteer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT UNIQUE,
  "designation" TEXT NOT NULL DEFAULT 'Volunteer',
  "isVerified" INTEGER NOT NULL DEFAULT 0,
  "assignedBy" TEXT,
  "assignedAt" DATETIME,
  "verificationNotes" TEXT,
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Volunteer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Volunteer_studentId_key" ON "Volunteer"("studentId");
