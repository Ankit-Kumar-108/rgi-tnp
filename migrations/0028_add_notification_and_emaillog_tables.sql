-- CreateTable Notification
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientType" TEXT NOT NULL,
    "studentId" TEXT,
    "alumniId" TEXT,
    "externalStudentId" TEXT,
    "recruiterId" TEXT,
    CONSTRAINT "Notification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE,
    CONSTRAINT "Notification_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE CASCADE,
    CONSTRAINT "Notification_externalStudentId_fkey" FOREIGN KEY ("externalStudentId") REFERENCES "ExternalStudent" ("id") ON DELETE CASCADE,
    CONSTRAINT "Notification_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE CASCADE
);

-- CreateTable EmailLog
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "recipientType" TEXT,
    "triggeredBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndexes
CREATE INDEX "Notification_studentId_idx" ON "Notification"("studentId");
CREATE INDEX "Notification_alumniId_idx" ON "Notification"("alumniId");
CREATE INDEX "Notification_externalStudentId_idx" ON "Notification"("externalStudentId");
CREATE INDEX "Notification_recruiterId_idx" ON "Notification"("recruiterId");
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");
