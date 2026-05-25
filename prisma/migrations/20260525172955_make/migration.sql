-- AlterTable
ALTER TABLE "Recruiter" ADD COLUMN "resetPasswordToken" TEXT;
ALTER TABLE "Recruiter" ADD COLUMN "resetPasswordTokenExpiry" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExternalStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "semester" INTEGER NOT NULL,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "resumeUrl" TEXT,
    "gender" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "tenthPercentage" REAL,
    "twelfthPercentage" REAL,
    "cgpa" REAL,
    "activeBacklog" INTEGER NOT NULL DEFAULT 0,
    "course" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" DATETIME,
    "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationError" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'external_student',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ExternalStudent" ("activeBacklog", "batch", "branch", "cgpa", "collegeName", "course", "createdAt", "email", "emailVerificationError", "emailVerificationFailed", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "gender", "githubUrl", "id", "isProfileComplete", "isVerified", "linkedinUrl", "name", "passwordHash", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry", "resumeUrl", "role", "semester", "tenthPercentage", "twelfthPercentage", "updatedAt") SELECT "activeBacklog", "batch", "branch", "cgpa", "collegeName", "course", "createdAt", "email", "emailVerificationError", "emailVerificationFailed", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "gender", "githubUrl", "id", "isProfileComplete", "isVerified", "linkedinUrl", "name", "passwordHash", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry", "resumeUrl", "role", "semester", "tenthPercentage", "twelfthPercentage", "updatedAt" FROM "ExternalStudent";
DROP TABLE "ExternalStudent";
ALTER TABLE "new_ExternalStudent" RENAME TO "ExternalStudent";
CREATE UNIQUE INDEX "ExternalStudent_email_key" ON "ExternalStudent"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
