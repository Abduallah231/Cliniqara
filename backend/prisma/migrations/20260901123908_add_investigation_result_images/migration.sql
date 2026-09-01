-- CreateEnum
CREATE TYPE "PrescriptionTemplateScope" AS ENUM ('USER', 'CLINIC', 'GLOBAL');

-- AlterTable
ALTER TABLE "visit_prescription_medications" ADD COLUMN     "durationUnit" TEXT,
ADD COLUMN     "durationValue" INTEGER;

-- CreateTable
CREATE TABLE "visit_investigation_images" (
    "id" TEXT NOT NULL,
    "investigationId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visit_investigation_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_template_folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" "PrescriptionTemplateScope" NOT NULL,
    "userId" TEXT,
    "clinicId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_template_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scope" "PrescriptionTemplateScope" NOT NULL,
    "userId" TEXT,
    "clinicId" TEXT,
    "folderId" TEXT,
    "advice" TEXT,
    "notes" TEXT,
    "followUp" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_template_medications" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "medication" TEXT NOT NULL,
    "instructions" TEXT,
    "durationValue" INTEGER,
    "durationUnit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_template_medications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visit_investigation_images_investigationId_idx" ON "visit_investigation_images"("investigationId");

-- CreateIndex
CREATE INDEX "prescription_template_folders_userId_idx" ON "prescription_template_folders"("userId");

-- CreateIndex
CREATE INDEX "prescription_template_folders_clinicId_idx" ON "prescription_template_folders"("clinicId");

-- CreateIndex
CREATE INDEX "prescription_template_folders_scope_idx" ON "prescription_template_folders"("scope");

-- CreateIndex
CREATE INDEX "prescription_templates_userId_idx" ON "prescription_templates"("userId");

-- CreateIndex
CREATE INDEX "prescription_templates_clinicId_idx" ON "prescription_templates"("clinicId");

-- CreateIndex
CREATE INDEX "prescription_templates_folderId_idx" ON "prescription_templates"("folderId");

-- CreateIndex
CREATE INDEX "prescription_templates_scope_idx" ON "prescription_templates"("scope");

-- CreateIndex
CREATE INDEX "prescription_template_medications_templateId_idx" ON "prescription_template_medications"("templateId");

-- AddForeignKey
ALTER TABLE "visit_investigation_images" ADD CONSTRAINT "visit_investigation_images_investigationId_fkey" FOREIGN KEY ("investigationId") REFERENCES "visit_investigations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_template_folders" ADD CONSTRAINT "prescription_template_folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_template_folders" ADD CONSTRAINT "prescription_template_folders_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_templates" ADD CONSTRAINT "prescription_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_templates" ADD CONSTRAINT "prescription_templates_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_templates" ADD CONSTRAINT "prescription_templates_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "prescription_template_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_template_medications" ADD CONSTRAINT "prescription_template_medications_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "prescription_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
