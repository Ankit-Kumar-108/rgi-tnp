-- Migration: 0001_init_schema
-- Created for Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS "StudentMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "batch" REAL NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "StudentMaster_enrollmentNumber_key" ON "StudentMaster"("enrollmentNumber");

CREATE TABLE IF NOT EXISTS "AlumniMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "batch" TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "AlumniMaster_enrollmentNumber_key" ON "AlumniMaster"("enrollmentNumber");

CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin'
);
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");

CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "semester" REAL NOT NULL,
    "cgpa" REAL NOT NULL,
    "isEmailVerified" INTEGER NOT NULL DEFAULT 0,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" DATETIME,
    "otpAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastOtpSentAt" DATETIME,
    "image" TEXT,
    "feedback" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isVerified" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'student',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Student_enrollmentNumber_key" ON "Student"("enrollmentNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_email_key" ON "Student"("email");

CREATE TABLE IF NOT EXISTS "Alumni" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isVerified" INTEGER NOT NULL DEFAULT 0,
    "isProfileComplete" INTEGER NOT NULL DEFAULT 0,
    "currentCompany" TEXT,
    "jobTitle" TEXT,
    "city" TEXT,
    "linkedInUrl" TEXT,
    "phoneNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "Alumni_enrollmentNumber_key" ON "Alumni"("enrollmentNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Alumni_personalEmail_key" ON "Alumni"("personalEmail");

CREATE TABLE IF NOT EXISTS "ExternalStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "isScreened" INTEGER NOT NULL DEFAULT 0,
    "branch" TEXT NOT NULL,
    "cgpa" REAL NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "ExternalStudent_email_key" ON "ExternalStudent"("email");

CREATE TABLE IF NOT EXISTS "Recruiter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'recruiter'
);
CREATE UNIQUE INDEX IF NOT EXISTS "Recruiter_email_key" ON "Recruiter"("email");

CREATE TABLE IF NOT EXISTS "PlacementDrive" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "ctc" TEXT NOT NULL,
    "minCGPA" REAL NOT NULL,
    "eligibleBranches" TEXT NOT NULL,
    "driveDate" DATETIME NOT NULL,
    "driveType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "googleSheetUrl" TEXT,
    "recruiterId" TEXT NOT NULL,
    CONSTRAINT "PlacementDrive_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "DriveRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driveId" TEXT NOT NULL,
    "studentId" TEXT,
    "externalStudentId" TEXT,
    "attended" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DriveRegistration_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "PlacementDrive" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DriveRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DriveRegistration_externalStudentId_fkey" FOREIGN KEY ("externalStudentId") REFERENCES "ExternalStudent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applyLink" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "alumniId" TEXT NOT NULL,
    CONSTRAINT "Referral_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_moderation',
    "studentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Memory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "alumniId" TEXT NOT NULL,
    CONSTRAINT "Feedback_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
