DROP INDEX IF EXISTS "User_email_idx";

CREATE INDEX "Job_recruiterId_status_createdAt_idx"
    ON "Job"("recruiterId", "status", "createdAt");
CREATE INDEX "Application_jobId_appliedAt_idx"
    ON "Application"("jobId", "appliedAt");
CREATE INDEX "Application_applicantId_appliedAt_idx"
    ON "Application"("applicantId", "appliedAt");
