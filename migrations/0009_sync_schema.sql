-- Migration: 0009_sync_schema
-- Description: Full table recreation for all modified tables to resolve persistent SQLITE_ERROR 7500

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- 1. Redefine Student (Drop memoriesImageUrl and feedback)
CREATE TABLE "Student_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "cgpa" REAL NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" DATETIME,
    "profileImageUrl" TEXT,
    "resumeUrl" TEXT,
    "batch" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "tenthPercentage" REAL NOT NULL,
    "twelfthPercentage" REAL NOT NULL,
    "activeBacklog" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'student',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "Student_new" ("id", "name", "enrollmentNumber", "email", "branch", "semester", "cgpa", "isEmailVerified", "isVerified", "emailVerificationToken", "emailVerificationTokenExpiry", "resetPasswordToken", "resetPasswordTokenExpiry", "profileImageUrl", "resumeUrl", "batch", "phoneNumber", "course", "passwordHash", "linkedinUrl", "githubUrl", "tenthPercentage", "twelfthPercentage", "activeBacklog", "role", "createdAt", "updatedAt")
SELECT "id", "name", "enrollmentNumber", "email", "branch", "semester", "cgpa", "isEmailVerified", "isVerified", "emailVerificationToken", "emailVerificationTokenExpiry", "resetPasswordToken", "resetPasswordTokenExpiry", "profileImageUrl", "resumeUrl", "batch", "phoneNumber", "course", "passwordHash", "linkedinUrl", "githubUrl", "tenthPercentage", "twelfthPercentage", "activeBacklog", "role", "createdAt", "updatedAt" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "Student_new" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_enrollmentNumber_key" ON "Student"("enrollmentNumber");
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- 2. Redefine ExternalStudent (Add createdAt/updatedAt and drop feedback)
CREATE TABLE "ExternalStudent_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "tenthPercentage" REAL NOT NULL,
    "twelfthPercentage" REAL NOT NULL,
    "cgpa" REAL NOT NULL,
    "activeBacklog" INTEGER NOT NULL DEFAULT 0,
    "course" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'external_student',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "ExternalStudent_new" ("id", "name", "collegeName", "enrollmentNumber", "email", "passwordHash", "profileImageUrl", "semester", "linkedinUrl", "githubUrl", "resumeUrl", "branch", "tenthPercentage", "twelfthPercentage", "cgpa", "activeBacklog", "course", "batch", "phoneNumber", "isVerified", "emailVerificationToken", "emailVerificationTokenExpiry", "resetPasswordToken", "resetPasswordTokenExpiry", "role")
SELECT "id", "name", "collegeName", "enrollmentNumber", "email", "passwordHash", "profileImageUrl", "semester", "linkedinUrl", "githubUrl", "resumeUrl", "branch", "tenthPercentage", "twelfthPercentage", "cgpa", "activeBacklog", "course", "batch", "phoneNumber", "isVerified", "emailVerificationToken", "emailVerificationTokenExpiry", "resetPasswordToken", "resetPasswordTokenExpiry", "role" FROM "ExternalStudent";
DROP TABLE "ExternalStudent";
ALTER TABLE "ExternalStudent_new" RENAME TO "ExternalStudent";
CREATE UNIQUE INDEX "ExternalStudent_email_key" ON "ExternalStudent"("email");

-- 3. Redefine PlacementDrive (Add createdAt/updatedAt)
CREATE TABLE "PlacementDrive_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "ctc" TEXT NOT NULL,
    "minCGPA" REAL NOT NULL,
    "jobType" TEXT NOT NULL,
    "minBatch" TEXT NOT NULL,
    "maxBatch" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "eligibleBranches" TEXT NOT NULL,
    "driveDate" DATETIME NOT NULL,
    "driveType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "googleSheetUrl" TEXT,
    "recruiterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlacementDrive_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "PlacementDrive_new" ("id", "companyName", "roleName", "jobDescription", "ctc", "minCGPA", "jobType", "minBatch", "maxBatch", "course", "eligibleBranches", "driveDate", "driveType", "status", "googleSheetUrl", "recruiterId")
SELECT "id", "companyName", "roleName", "jobDescription", "ctc", "minCGPA", "jobType", "minBatch", "maxBatch", "course", "eligibleBranches", "driveDate", "driveType", "status", "googleSheetUrl", "recruiterId" FROM "PlacementDrive";
DROP TABLE "PlacementDrive";
ALTER TABLE "PlacementDrive_new" RENAME TO "PlacementDrive";

-- 4. Redefine Recruiter (Add createdAt/updatedAt)
CREATE TABLE "Recruiter_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'recruiter',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "Recruiter_new" ("id", "name", "email", "phoneNumber", "designation", "company", "passwordHash", "role")
SELECT "id", "name", "email", "phoneNumber", "designation", "company", "passwordHash", "role" FROM "Recruiter";
DROP TABLE "Recruiter";
ALTER TABLE "Recruiter_new" RENAME TO "Recruiter";
CREATE UNIQUE INDEX "Recruiter_email_key" ON "Recruiter"("email");

-- 5. Redefine Referral (Add createdAt/updatedAt)
CREATE TABLE "Referral_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applyLink" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "alumniId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Referral_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "Referral_new" ("id", "companyName", "position", "description", "applyLink", "status", "alumniId")
SELECT "id", "companyName", "position", "description", "applyLink", "status", "alumniId" FROM "Referral";
DROP TABLE "Referral";
ALTER TABLE "Referral_new" RENAME TO "Referral";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
