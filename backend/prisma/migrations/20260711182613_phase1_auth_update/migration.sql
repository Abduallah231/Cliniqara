/*
  Warnings:

  - You are about to drop the column `workingDays` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `workingHoursEnd` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `workingHoursStart` on the `clinics` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DoctorLevel" AS ENUM ('INTERN', 'DOCTOR');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- AlterTable
ALTER TABLE "clinics" DROP COLUMN "workingDays",
DROP COLUMN "workingHoursEnd",
DROP COLUMN "workingHoursStart";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "doctorLevel" "DoctorLevel";

-- CreateTable
CREATE TABLE "clinic_working_days" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clinic_working_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clinic_working_days_clinicId_idx" ON "clinic_working_days"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_working_days_clinicId_day_key" ON "clinic_working_days"("clinicId", "day");

-- AddForeignKey
ALTER TABLE "clinic_working_days" ADD CONSTRAINT "clinic_working_days_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
