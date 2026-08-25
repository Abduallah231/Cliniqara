/*
  Warnings:

  - The values [BIRTH_CERTIFICATE] on the enum `PatientIdentifierType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `chiefComplaintId` on the `visit_complaint_analysis` table. All the data in the column will be lost.
  - You are about to drop the `visit_chief_complaint_answers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[patientCode]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[visitChiefComplaintId]` on the table `visit_complaint_analysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `visitChiefComplaintId` to the `visit_complaint_analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PatientIdentifierType_new" AS ENUM ('NATIONAL_ID', 'PASSPORT', 'OTHER', 'UNKNOWN');
ALTER TABLE "patients" ALTER COLUMN "identifierType" TYPE "PatientIdentifierType_new" USING ("identifierType"::text::"PatientIdentifierType_new");
ALTER TYPE "PatientIdentifierType" RENAME TO "PatientIdentifierType_old";
ALTER TYPE "PatientIdentifierType_new" RENAME TO "PatientIdentifierType";
DROP TYPE "public"."PatientIdentifierType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "visit_chief_complaint_answers" DROP CONSTRAINT "visit_chief_complaint_answers_visitId_fkey";

-- DropForeignKey
ALTER TABLE "visit_complaint_analysis" DROP CONSTRAINT "visit_complaint_analysis_chiefComplaintId_fkey";

-- DropIndex
DROP INDEX "patients_clinicId_patientCode_key";

-- DropIndex
DROP INDEX "visit_complaint_analysis_chiefComplaintId_key";

-- AlterTable
ALTER TABLE "clinics" DROP COLUMN "address",
DROP COLUMN "country",
ADD COLUMN     "district" TEXT,
ADD COLUMN     "governorate" TEXT,
ADD COLUMN     "streetAddress" TEXT,
ALTER COLUMN "city" DROP NOT NULL;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "childrenCount" INTEGER,
ADD COLUMN     "documentType" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentClinicId" TEXT,
ADD COLUMN     "selectedClinicId" TEXT;

-- AlterTable
ALTER TABLE "visit_complaint_analysis" DROP COLUMN "chiefComplaintId",
ADD COLUMN     "visitChiefComplaintId" TEXT NOT NULL;

-- DropTable
DROP TABLE "visit_chief_complaint_answers";

-- CreateTable
CREATE TABLE "system_counters" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_counters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_patientCode_key" ON "patients"("patientCode");

-- CreateIndex
CREATE UNIQUE INDEX "visit_complaint_analysis_visitChiefComplaintId_key" ON "visit_complaint_analysis"("visitChiefComplaintId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_selectedClinicId_fkey" FOREIGN KEY ("selectedClinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currentClinicId_fkey" FOREIGN KEY ("currentClinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_complaint_analysis" ADD CONSTRAINT "visit_complaint_analysis_visitChiefComplaintId_fkey" FOREIGN KEY ("visitChiefComplaintId") REFERENCES "visit_chief_complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
