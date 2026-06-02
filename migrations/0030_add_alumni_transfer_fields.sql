-- Migration number: 0030_add_alumni_transfer_fields
-- Add placementSnapsJson and isTransferred to Alumni

ALTER TABLE "Alumni" ADD COLUMN "placementSnapsJson" TEXT DEFAULT '[]';
ALTER TABLE "Alumni" ADD COLUMN "isTransferred" INTEGER DEFAULT 0;
