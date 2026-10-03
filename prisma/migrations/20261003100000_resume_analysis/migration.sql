CREATE TABLE "ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ResumeAnalysis_applicationId_createdAt_idx" ON "ResumeAnalysis"("applicationId", "createdAt");
CREATE INDEX "ResumeAnalysis_actorId_createdAt_idx" ON "ResumeAnalysis"("actorId", "createdAt");

ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_actorId_fkey"
    FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
