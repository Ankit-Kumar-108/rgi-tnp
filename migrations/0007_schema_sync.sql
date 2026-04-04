-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Feedback";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alumni" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" DATETIME,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "currentCompany" TEXT,
    "profileImageUrl" TEXT NOT NULL,
    "jobTitle" TEXT,
    "city" TEXT,
    "country" TEXT,
    "linkedInUrl" TEXT,
    "phoneNumber" TEXT,
    "privacyJson" JSONB,
    "branch" TEXT NOT NULL,
    "about" TEXT,
    "batch" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Alumni" ("batch", "branch", "city", "course", "createdAt", "updatedAt", "currentCompany", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "id", "isProfileComplete", "isVerified", "jobTitle", "linkedInUrl", "name", "passwordHash", "personalEmail", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry") SELECT "batch", 'Unknown', "city", "course", "createdAt", CURRENT_TIMESTAMP, "currentCompany", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "id", "isProfileComplete", "isVerified", "jobTitle", "linkedInUrl", "name", "passwordHash", "personalEmail", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry" FROM "Alumni";
DROP TABLE "Alumni";
ALTER TABLE "new_Alumni" RENAME TO "Alumni";
CREATE UNIQUE INDEX "Alumni_enrollmentNumber_key" ON "Alumni"("enrollmentNumber");
CREATE UNIQUE INDEX "Alumni_personalEmail_key" ON "Alumni"("personalEmail");
CREATE TABLE "new_AlumniMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "batch" TEXT NOT NULL
);
INSERT INTO "new_AlumniMaster" ("batch", "branch", "course", "enrollmentNumber", "id", "name") SELECT "batch", "branch", "course", "enrollmentNumber", "id", "name" FROM "AlumniMaster";
DROP TABLE "AlumniMaster";
ALTER TABLE "new_AlumniMaster" RENAME TO "AlumniMaster";
CREATE UNIQUE INDEX "AlumniMaster_enrollmentNumber_key" ON "AlumniMaster"("enrollmentNumber");
CREATE TABLE "new_DriveRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driveId" TEXT NOT NULL,
    "studentId" TEXT,
    "externalStudentId" TEXT,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DriveRegistration_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "PlacementDrive" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DriveRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DriveRegistration_externalStudentId_fkey" FOREIGN KEY ("externalStudentId") REFERENCES "ExternalStudent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DriveRegistration" ("attended", "createdAt", "driveId", "externalStudentId", "id", "status", "studentId") SELECT "attended", "createdAt", "driveId", "externalStudentId", "id", "status", "studentId" FROM "DriveRegistration";
DROP TABLE "DriveRegistration";
ALTER TABLE "new_DriveRegistration" RENAME TO "DriveRegistration";
CREATE TABLE "new_ExternalStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "feedback" TEXT,
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
    "role" TEXT NOT NULL DEFAULT 'external_student'
);
INSERT INTO "new_ExternalStudent" ("batch", "branch", "cgpa", "collegeName", "course", "email", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "feedback", "id", "isVerified", "name", "passwordHash", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry", "resumeUrl", "role", "semester", "tenthPercentage", "twelfthPercentage") SELECT "batch", "branch", "cgpa", "collegeName", "course", "email", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "feedback", "id", "isVerified", "name", "passwordHash", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry", "resumeUrl", "role", 1, 0.0, 0.0 FROM "ExternalStudent";
DROP TABLE "ExternalStudent";
ALTER TABLE "new_ExternalStudent" RENAME TO "ExternalStudent";
CREATE UNIQUE INDEX "ExternalStudent_email_key" ON "ExternalStudent"("email");
CREATE TABLE "new_PlacementDrive" (
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
    CONSTRAINT "PlacementDrive_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlacementDrive" ("companyName", "course", "ctc", "driveDate", "driveType", "eligibleBranches", "googleSheetUrl", "id", "jobDescription", "jobType", "maxBatch", "minBatch", "minCGPA", "recruiterId", "roleName", "status") SELECT "companyName", "course", "ctc", "driveDate", "driveType", "eligibleBranches", "googleSheetUrl", "id", "jobDescription", "jobType", "maxBatch", "minBatch", "minCGPA", "recruiterId", "roleName", "status" FROM "PlacementDrive";
DROP TABLE "PlacementDrive";
ALTER TABLE "new_PlacementDrive" RENAME TO "PlacementDrive";
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
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" DATETIME,
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
INSERT INTO "new_Student" ("batch", "branch", "cgpa", "course", "createdAt", "email", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "feedback", "id", "isEmailVerified", "isVerified", "memoriesImageUrl", "name", "passwordHash", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry", "resumeUrl", "role", "semester", "updatedAt", "tenthPercentage", "twelfthPercentage") SELECT "batch", "branch", "cgpa", "course", "createdAt", "email", "emailVerificationToken", "emailVerificationTokenExpiry", "enrollmentNumber", "feedback", "id", "isEmailVerified", "isVerified", "memoriesImageUrl", "name", "passwordHash", "phoneNumber", "profileImageUrl", "resetPasswordToken", "resetPasswordTokenExpiry", "resumeUrl", "role", "semester", "updatedAt", 0.0, 0.0 FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_enrollmentNumber_key" ON "Student"("enrollmentNumber");
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE TABLE "new_StudentMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "batch" TEXT NOT NULL
);
INSERT INTO "new_StudentMaster" ("batch", "branch", "course", "enrollmentNumber", "id", "name") SELECT "batch", "branch", "course", "enrollmentNumber", "id", "name" FROM "StudentMaster";
DROP TABLE "StudentMaster";
ALTER TABLE "new_StudentMaster" RENAME TO "StudentMaster";
CREATE UNIQUE INDEX "StudentMaster_enrollmentNumber_key" ON "StudentMaster"("enrollmentNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

