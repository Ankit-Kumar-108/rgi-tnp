-- Add approval tracking fields to EmailLog table
ALTER TABLE "EmailLog" ADD COLUMN "approvalType" TEXT;
ALTER TABLE "EmailLog" ADD COLUMN "approvalId" TEXT;
ALTER TABLE "EmailLog" ADD COLUMN "actionType" TEXT;

-- Create index for faster lookups on approvalId
CREATE INDEX "EmailLog_approvalId_idx" ON "EmailLog"("approvalId");
