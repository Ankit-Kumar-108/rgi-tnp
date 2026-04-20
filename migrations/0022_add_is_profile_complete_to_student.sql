-- Add missing isProfileComplete column to Student table
-- This column was lost during the schema sync in migration 0007

-- Check if column exists and add if it doesn't
PRAGMA table_info(Student);

-- Using a safe approach: create a new table with all columns including isProfileComplete
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Student" (
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
    "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationError" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" DATETIME,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "profileImageUrl" TEXT,
    "resumeUrl" TEXT,
    "memoriesImageUrl" TEXT,
    "feedback" TEXT,
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
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Student" 
SELECT 
    "id", "name", "enrollmentNumber", "email", "branch", "semester", "cgpa",
    "isEmailVerified", "isVerified", "emailVerificationToken", "emailVerificationTokenExpiry",
    COALESCE("emailVerificationFailed", false), COALESCE("emailVerificationError", NULL),
    "resetPasswordToken", "resetPasswordTokenExpiry",
    false,
    "profileImageUrl", "resumeUrl", "memoriesImageUrl", "feedback", "batch", "phoneNumber", "course",
    "passwordHash", "linkedinUrl", "githubUrl", "tenthPercentage", "twelfthPercentage", "activeBacklog", "role",
    "createdAt", "updatedAt"
FROM "Student";

DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_enrollmentNumber_key" ON "Student"("enrollmentNumber");
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

PRAGMA foreign_keys=ON;
