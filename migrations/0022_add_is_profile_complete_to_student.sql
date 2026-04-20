-- Add missing isProfileComplete column to Student table
-- This column was lost during the schema sync in migration 0007

-- Simple approach: just add the column using ALTER TABLE
-- SQLite will ignore if it already exists
ALTER TABLE Student 
ADD COLUMN isProfileComplete BOOLEAN NOT NULL DEFAULT 0;
