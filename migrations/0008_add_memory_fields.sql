-- Migration: 0008_add_memory_fields
-- Description: Add title, uploaderName, alumniId, and make studentId optional in Memory table.

-- Disable foreign key checks to allow table recreation
PRAGMA foreign_keys=OFF;

-- Create a temporary table with the new structure
CREATE TABLE "Memory_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_moderation',
    "studentId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Untitled Memory',
    "uploaderName" TEXT NOT NULL,
    "alumniId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Memory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Memory_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Copy data from the old table to the new one (if it exists)
INSERT INTO "Memory_new" ("id", "imageUrl", "status", "studentId", "createdAt", "title", "uploaderName")
SELECT "id", "imageUrl", "status", "studentId", "createdAt", 'Untitled Memory', 'Unknown'
FROM "Memory";

-- Drop the old table
DROP TABLE "Memory";

-- Rename the new table
ALTER TABLE "Memory_new" RENAME TO "Memory";

-- Re-enable foreign key checks
PRAGMA foreign_keys=ON;
