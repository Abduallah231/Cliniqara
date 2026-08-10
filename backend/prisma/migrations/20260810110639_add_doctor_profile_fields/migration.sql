/*
  Warnings:

  - You are about to drop the column `medicalCardImage` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clinic_working_days" ADD COLUMN     "is24Hours" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "medicalCardImage",
ADD COLUMN     "medicalLicenseImage" TEXT,
ADD COLUMN     "professionalTitle" TEXT,
ADD COLUMN     "specialty" TEXT;

-- CreateTable
CREATE TABLE "clinic_join_codes" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinic_join_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinic_join_codes_code_key" ON "clinic_join_codes"("code");

-- CreateIndex
CREATE INDEX "clinic_join_codes_clinicId_idx" ON "clinic_join_codes"("clinicId");

-- CreateIndex
CREATE INDEX "clinic_join_codes_expiresAt_idx" ON "clinic_join_codes"("expiresAt");

-- AddForeignKey
ALTER TABLE "clinic_join_codes" ADD CONSTRAINT "clinic_join_codes_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
