-- AlterTable
ALTER TABLE "prescription_template_medications" ADD COLUMN     "drugId" TEXT;

-- AlterTable
ALTER TABLE "visit_prescription_medications" ADD COLUMN     "drugId" TEXT;

-- CreateTable
CREATE TABLE "drugs" (
    "id" TEXT NOT NULL,
    "commercialNameEn" TEXT NOT NULL,
    "commercialNameAr" TEXT,
    "scientificName" TEXT,
    "manufacturer" TEXT,
    "drugClass" TEXT,
    "route" TEXT,
    "priceEgp" DECIMAL(10,2),
    "source" TEXT NOT NULL DEFAULT 'github-egyptian-drug-database',
    "sourceRowKey" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drugs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drugs_commercialNameEn_key" ON "drugs"("commercialNameEn");

-- CreateIndex
CREATE INDEX "drugs_scientificName_idx" ON "drugs"("scientificName");

-- CreateIndex
CREATE INDEX "drugs_manufacturer_idx" ON "drugs"("manufacturer");

-- CreateIndex
CREATE INDEX "drugs_drugClass_idx" ON "drugs"("drugClass");

-- CreateIndex
CREATE INDEX "drugs_route_idx" ON "drugs"("route");

-- CreateIndex
CREATE INDEX "drugs_isActive_idx" ON "drugs"("isActive");

-- CreateIndex
CREATE INDEX "prescription_template_medications_drugId_idx" ON "prescription_template_medications"("drugId");

-- CreateIndex
CREATE INDEX "visit_prescription_medications_drugId_idx" ON "visit_prescription_medications"("drugId");

-- AddForeignKey
ALTER TABLE "prescription_template_medications" ADD CONSTRAINT "prescription_template_medications_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drugs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_prescription_medications" ADD CONSTRAINT "visit_prescription_medications_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drugs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
