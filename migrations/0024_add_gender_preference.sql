-- Add genderPreference column to PlacementDrive
ALTER TABLE PlacementDrive ADD COLUMN genderPreference TEXT DEFAULT 'Both';
