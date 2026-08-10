/*
  Warnings:

  - You are about to drop the column `endTime` on the `clinic_working_days` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `clinic_working_days` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "clinic_working_days" DROP CONSTRAINT "clinic_working_days_clinicId_fkey";

-- AlterTable
ALTER TABLE "clinic_working_days" DROP COLUMN "endTime",
DROP COLUMN "startTime";

-- CreateTable
CREATE TABLE "clinic_working_shifts" (
    "id" TEXT NOT NULL,
    "workingDayId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "clinic_working_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clinic_working_shifts_workingDayId_idx" ON "clinic_working_shifts"("workingDayId");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_working_shifts_workingDayId_sortOrder_key" ON "clinic_working_shifts"("workingDayId", "sortOrder");

-- AddForeignKey
ALTER TABLE "clinic_working_shifts" ADD CONSTRAINT "clinic_working_shifts_workingDayId_fkey" FOREIGN KEY ("workingDayId") REFERENCES "clinic_working_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_working_days" ADD CONSTRAINT "clinic_working_days_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
