-- Migration: Mark previous migrations as applied (they are already in remote DB)
-- These columns already exist in the remote database from earlier migrations
-- This is a no-op migration to mark them as applied in the migration history

-- The following columns already exist in the remote database:
-- Student: emailVerificationFailed, emailVerificationError, isProfileComplete  
-- Alumni: emailVerificationFailed, emailVerificationError
-- ExternalStudent: emailVerificationFailed, emailVerificationError, isProfileComplete

-- No changes needed - columns already exist
SELECT 1;
