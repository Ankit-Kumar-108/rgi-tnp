-- CreateTable
CREATE TABLE "StudentMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "batch" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AlumniMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "batch" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin'
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "cgpa" REAL NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" DATETIME,
    "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationError" TEXT,
    "resetPasswordToken" TEXT,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Alumni" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" DATETIME,
    "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationError" TEXT,
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

-- CreateTable
CREATE TABLE "ExternalStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
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
    "emailVerificationFailed" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationError" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'external_student',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlacementDrive" (
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
    "genderPreference" TEXT NOT NULL,
    "duration" TEXT,
    "interviewProcess" TEXT,
    "driveDate" DATETIME NOT NULL,
    "driveType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "googleSheetUrl" TEXT,
    "recruiterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlacementDrive_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DriveImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DriveImage_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "PlacementDrive" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DriveRegistration" (
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

-- CreateTable
CREATE TABLE "Recruiter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'recruiter',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "jobType" TEXT,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "minCGPA" REAL,
    "experience" TEXT,
    "batchEligible" TEXT,
    "refrerralLink" TEXT,
    "referralCode" TEXT,
    "deadline" DATETIME,
    "applyLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "alumniId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Referral_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_moderation',
    "studentId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Untitled Memory',
    "uploaderName" TEXT NOT NULL,
    "alumniId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Memory_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Memory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlumniFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "alumniId" TEXT NOT NULL,
    CONSTRAINT "AlumniFeedback_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "studentId" TEXT NOT NULL,
    CONSTRAINT "StudentFeedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CorporateFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "recruiterId" TEXT NOT NULL,
    CONSTRAINT "CorporateFeedback_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT,
    "designation" TEXT NOT NULL DEFAULT 'Volunteer',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "assignedBy" TEXT,
    "assignedAt" DATETIME,
    "verificationNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Volunteer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolunteerStudentStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driveId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VolunteerStudentStatus_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "PlacementDrive" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VolunteerStudentStatus_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentMaster_enrollmentNumber_key" ON "StudentMaster"("enrollmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniMaster_enrollmentNumber_key" ON "AlumniMaster"("enrollmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollmentNumber_key" ON "Student"("enrollmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_enrollmentNumber_key" ON "Alumni"("enrollmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_personalEmail_key" ON "Alumni"("personalEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalStudent_email_key" ON "ExternalStudent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_email_key" ON "Recruiter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_studentId_key" ON "Volunteer"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerStudentStatus_driveId_studentId_key" ON "VolunteerStudentStatus"("driveId", "studentId");
