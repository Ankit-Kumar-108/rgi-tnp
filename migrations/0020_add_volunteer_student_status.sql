-- CreateTable VolunteerStudentStatus
CREATE TABLE "VolunteerStudentStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driveId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VolunteerStudentStatus_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "PlacementDrive" ("id") ON DELETE CASCADE,
    CONSTRAINT "VolunteerStudentStatus_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerStudentStatus_driveId_studentId_key" ON "VolunteerStudentStatus"("driveId", "studentId");
