-- CreateTable
CREATE TABLE "visit_chief_complaint_answers" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "chiefComplaintId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_chief_complaint_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visit_chief_complaint_answers_visitId_idx" ON "visit_chief_complaint_answers"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_chief_complaint_answers_visitId_chiefComplaintId_key" ON "visit_chief_complaint_answers"("visitId", "chiefComplaintId");

-- AddForeignKey
ALTER TABLE "visit_chief_complaint_answers" ADD CONSTRAINT "visit_chief_complaint_answers_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
