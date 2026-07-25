/*
  Warnings:

  - You are about to drop the column `address` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `childrenCount` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `nationalId` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `patients` table. All the data in the column will be lost.
  - Added the required column `identifierType` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PatientIdentifierType" AS ENUM ('NATIONAL_ID', 'BIRTH_CERTIFICATE', 'PASSPORT', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AgeUnit" AS ENUM ('YEARS', 'MONTHS', 'DAYS');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MedicationCompliance" AS ENUM ('GOOD', 'POOR', 'IRREGULAR');

-- CreateEnum
CREATE TYPE "AllergyType" AS ENUM ('DRUG', 'FOOD', 'ENVIRONMENTAL', 'OTHER');

-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'ANAPHYLAXIS');

-- CreateEnum
CREATE TYPE "FamilyRelation" AS ENUM ('FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'SON', 'DAUGHTER', 'GRANDFATHER', 'GRANDMOTHER', 'UNCLE', 'AUNT', 'COUSIN', 'OTHER');

-- CreateEnum
CREATE TYPE "SmokingStatus" AS ENUM ('NEVER', 'CURRENT', 'FORMER');

-- CreateEnum
CREATE TYPE "AlcoholStatus" AS ENUM ('NO', 'CURRENT', 'FORMER');

-- CreateEnum
CREATE TYPE "AlcoholFrequency" AS ENUM ('OCCASIONAL', 'WEEKLY', 'DAILY', 'HEAVY');

-- CreateEnum
CREATE TYPE "LivingCondition" AS ENUM ('LIVES_ALONE', 'LIVES_WITH_FAMILY', 'NURSING_HOME', 'HOMELESS', 'OTHER');

-- CreateEnum
CREATE TYPE "PhysicalActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'HEAVY');

-- CreateEnum
CREATE TYPE "SleepDuration" AS ENUM ('LESS_THAN_5', 'HOURS_5_TO_7', 'HOURS_7_TO_9', 'MORE_THAN_9');

-- CreateEnum
CREATE TYPE "SocialSupportLevel" AS ENUM ('GOOD', 'LIMITED', 'NO_SUPPORT', 'CAREGIVER_AVAILABLE');

-- CreateEnum
CREATE TYPE "SexualHistoryStatus" AS ENUM ('NOT_DISCUSSED', 'SEXUALLY_ACTIVE', 'NOT_ACTIVE');

-- CreateEnum
CREATE TYPE "VaccinationStatus" AS ENUM ('UP_TO_DATE', 'PARTIALLY_VACCINATED', 'UNVACCINATED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "VaccinationReason" AS ENUM ('MISSED_APPOINTMENT', 'VACCINE_UNAVAILABLE', 'MEDICAL_CONTRAINDICATION', 'PARENT_REFUSED', 'ACCESS_PROBLEMS', 'UNKNOWN', 'OTHER');

-- CreateEnum
CREATE TYPE "ReactionSeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE');

-- CreateEnum
CREATE TYPE "CycleRegularity" AS ENUM ('REGULAR', 'IRREGULAR', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BleedingDuration" AS ENUM ('LESS_THAN_3_DAYS', 'DAYS_3_TO_7', 'MORE_THAN_7_DAYS');

-- CreateEnum
CREATE TYPE "MenstrualFlow" AS ENUM ('SCANTY', 'NORMAL', 'HEAVY', 'FLOODING');

-- CreateEnum
CREATE TYPE "DysmenorrheaSeverity" AS ENUM ('NONE', 'MILD', 'MODERATE', 'SEVERE');

-- CreateEnum
CREATE TYPE "PainStart" AS ENUM ('BEFORE_MENSES', 'FIRST_DAY', 'THROUGHOUT_MENSES');

-- CreateEnum
CREATE TYPE "AntenatalCare" AS ENUM ('REGULAR', 'IRREGULAR', 'NONE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SmokingExposure" AS ENUM ('NO', 'PASSIVE', 'MATERNAL_SMOKING');

-- CreateEnum
CREATE TYPE "GestationalAge" AS ENUM ('TERM', 'PRETERM', 'POST_TERM', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DeliveryMode" AS ENUM ('NORMAL_VAGINAL', 'CESAREAN', 'INSTRUMENTAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DevelopmentStatus" AS ENUM ('NORMAL', 'DELAYED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DelayType" AS ENUM ('GROSS_MOTOR', 'FINE_MOTOR', 'SPEECH', 'SOCIAL', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "SchoolPerformance" AS ENUM ('GOOD', 'AVERAGE', 'POOR');

-- CreateEnum
CREATE TYPE "SchoolAttendance" AS ENUM ('REGULAR', 'IRREGULAR');

-- CreateEnum
CREATE TYPE "DurationUnit" AS ENUM ('HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "SystemType" AS ENUM ('GENERAL', 'CVS', 'CHEST', 'GIT', 'RENAL', 'NEURO', 'MUSCULOSKELETAL', 'ENDOCRINE', 'HEMATOLOGY', 'SKIN', 'GYNECOLOGY', 'OBSTETRIC', 'ENT', 'OPHTHALMOLOGY');

-- CreateEnum
CREATE TYPE "PulseRhythm" AS ENUM ('REGULAR', 'IRREGULAR');

-- CreateEnum
CREATE TYPE "OxygenSource" AS ENUM ('ROOM_AIR', 'OXYGEN');

-- CreateEnum
CREATE TYPE "TemperatureRoute" AS ENUM ('ORAL', 'AXILLARY', 'TYMPANIC', 'TEMPORAL', 'RECTAL');

-- CreateEnum
CREATE TYPE "ConsciousnessLevel" AS ENUM ('CONSCIOUS', 'DROWSY', 'CONFUSED', 'COMATOSE');

-- CreateEnum
CREATE TYPE "GeneralAppearance" AS ENUM ('NORMAL', 'ILL', 'TOXIC', 'DISTRESSED');

-- CreateEnum
CREATE TYPE "HydrationStatus" AS ENUM ('NORMAL', 'MILD', 'MODERATE', 'SEVERE');

-- CreateEnum
CREATE TYPE "BodyBuild" AS ENUM ('AVERAGE', 'THIN', 'OBESE', 'ATHLETIC');

-- CreateEnum
CREATE TYPE "NourishmentStatus" AS ENUM ('WELL_NOURISHED', 'MALNOURISHED');

-- CreateEnum
CREATE TYPE "RegionalExaminationArea" AS ENUM ('HEAD', 'NECK', 'UPPER_LIMB', 'LOWER_LIMB');

-- CreateEnum
CREATE TYPE "ExaminationSystem" AS ENUM ('ABDOMEN', 'CHEST', 'CVS', 'ENDOCRINE', 'ENT', 'GYNECOLOGY', 'MUSCULOSKELETAL', 'NEUROLOGY', 'OBSTETRIC', 'OPHTHALMOLOGY', 'SKIN');

-- CreateEnum
CREATE TYPE "InvestigationStatus" AS ENUM ('REQUESTED', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "clinics_phone_key";

-- AlterTable
ALTER TABLE "clinics" ADD COLUMN     "nextVisitNumber" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "address",
DROP COLUMN "childrenCount",
DROP COLUMN "nationalId",
DROP COLUMN "notes",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "estimatedAgeUnit" "AgeUnit",
ADD COLUMN     "estimatedAgeValue" INTEGER,
ADD COLUMN     "governorate" TEXT,
ADD COLUMN     "hasAllergy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "identifierNumber" TEXT,
ADD COLUMN     "identifierType" "PatientIdentifierType" NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "medicationCompliance" "MedicationCompliance",
ADD COLUMN     "selfMedication" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "selfMedicationDetails" TEXT,
ADD COLUMN     "streetAddress" TEXT,
ADD COLUMN     "supplementDetails" TEXT,
ADD COLUMN     "takesSupplements" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL;

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "visitCode" TEXT NOT NULL,
    "secureCode" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "visitStatus" "VisitStatus" NOT NULL DEFAULT 'WAITING',
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_chronic_diseases" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "diseaseCode" TEXT NOT NULL,
    "diseaseName" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_chronic_diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_hospitalizations" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "duration" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_hospitalizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_operations" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "operationName" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "indication" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_blood_transfusions" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "reason" TEXT,
    "date" TIMESTAMP(3),
    "reaction" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_blood_transfusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_major_traumas" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "traumaType" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "complications" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_major_traumas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_icu_admissions" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "duration" TEXT,
    "ventilatorSupport" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_icu_admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_medications" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dose" TEXT,
    "durationValue" INTEGER,
    "durationUnit" "DurationUnit",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_allergies" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" "AllergyType" NOT NULL,
    "allergen" TEXT NOT NULL,
    "reaction" TEXT,
    "severity" "AllergySeverity" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_allergies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_family_history" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "relation" "FamilyRelation" NOT NULL,
    "otherRelation" TEXT,
    "diseases" TEXT[],
    "alive" BOOLEAN NOT NULL,
    "ageAtDeath" INTEGER,
    "causeOfDeath" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_family_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_social_history" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "smoking" "SmokingStatus",
    "cigarettesPerDay" INTEGER,
    "yearsSmoking" INTEGER,
    "yearsSinceQuitting" INTEGER,
    "alcohol" "AlcoholStatus",
    "alcoholFrequency" "AlcoholFrequency",
    "yearsSinceStopping" INTEGER,
    "livingCondition" "LivingCondition",
    "livingConditionNotes" TEXT,
    "substanceUse" TEXT[],
    "substanceNotes" TEXT,
    "physicalActivity" "PhysicalActivityLevel",
    "physicalActivityNotes" TEXT,
    "sleepDuration" "SleepDuration",
    "sleepNotes" TEXT,
    "socialSupport" "SocialSupportLevel",
    "socialSupportNotes" TEXT,
    "sexualHistory" "SexualHistoryStatus",
    "sexualHistoryNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_social_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_vaccination_history" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "vaccinationStatus" "VaccinationStatus",
    "missedVaccines" TEXT[],
    "partialReason" "VaccinationReason",
    "partialOtherDetails" TEXT,
    "unvaccinatedReason" "VaccinationReason",
    "unvaccinatedOtherDetails" TEXT,
    "previousReaction" BOOLEAN,
    "reactionSeverity" "ReactionSeverity",
    "reactionDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_vaccination_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_menstrual_history" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "ageAtMenarche" INTEGER,
    "cycleRegularity" "CycleRegularity",
    "cycleLength" INTEGER,
    "bleedingDuration" "BleedingDuration",
    "menstrualFlow" "MenstrualFlow",
    "dysmenorrhea" "DysmenorrheaSeverity",
    "painStarts" "PainStart",
    "painRelievedBy" TEXT[],
    "associatedSymptoms" TEXT[],
    "intermenstrualBleeding" BOOLEAN,
    "postcoitalBleeding" BOOLEAN,
    "pmsSymptoms" TEXT[],
    "lmp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_menstrual_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_pediatric_history" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "antenatalCare" "AntenatalCare",
    "antenatalCareNotes" TEXT,
    "maternalIllnesses" TEXT[],
    "maternalIllnessOther" TEXT,
    "pregnancyComplications" TEXT[],
    "pregnancyComplicationsOther" TEXT,
    "drugIntake" BOOLEAN,
    "drugIntakeDetails" TEXT,
    "smokingExposure" "SmokingExposure",
    "alcoholExposure" BOOLEAN,
    "alcoholExposureDetails" TEXT,
    "gestationalAge" "GestationalAge",
    "gestationalWeeks" INTEGER,
    "deliveryMode" "DeliveryMode",
    "birthWeight" INTEGER,
    "nicuAdmission" BOOLEAN,
    "nicuReason" TEXT,
    "nicuDuration" INTEGER,
    "birthComplications" TEXT[],
    "birthComplicationDetails" TEXT,
    "neonatalJaundice" BOOLEAN,
    "phototherapy" BOOLEAN,
    "exchangeTransfusion" BOOLEAN,
    "neonatalSeizures" BOOLEAN,
    "feedingTypes" TEXT[],
    "development" "DevelopmentStatus",
    "delayType" "DelayType",
    "delayDetails" TEXT,
    "attendsSchool" BOOLEAN,
    "grade" TEXT,
    "schoolPerformance" "SchoolPerformance",
    "schoolPerformanceDetails" TEXT,
    "schoolAttendance" "SchoolAttendance",
    "schoolAttendanceReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_pediatric_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_chief_complaints" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "chiefComplaintId" TEXT NOT NULL,
    "durationValue" INTEGER,
    "durationUnit" "DurationUnit",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_chief_complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chief_complaint_master" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chief_complaint_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chief_complaint_templates" (
    "id" TEXT NOT NULL,
    "chiefComplaintId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "template" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chief_complaint_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_complaint_analysis" (
    "id" TEXT NOT NULL,
    "chiefComplaintId" TEXT NOT NULL,
    "templateCode" TEXT NOT NULL,
    "templateVersion" INTEGER NOT NULL,
    "values" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_complaint_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_related_systems" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "system" "SystemType" NOT NULL,
    "symptoms" TEXT[],
    "otherFinding" TEXT,

    CONSTRAINT "visit_related_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_systematic_review" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "system" "SystemType" NOT NULL,
    "symptoms" TEXT[],

    CONSTRAINT "visit_systematic_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_vital_signs" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "systolicBP" INTEGER,
    "diastolicBP" INTEGER,
    "heartRate" INTEGER,
    "pulseRhythm" "PulseRhythm",
    "respiratoryRate" INTEGER,
    "spo2" INTEGER,
    "oxygenSource" "OxygenSource",
    "temperature" DECIMAL(4,1),
    "temperatureRoute" "TemperatureRoute",
    "bloodGlucose" INTEGER,
    "weight" DECIMAL(5,2),
    "height" DECIMAL(5,2),
    "bmi" DECIMAL(4,1),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_vital_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_general_inspection" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "consciousness" "ConsciousnessLevel",
    "appearance" "GeneralAppearance",
    "hydration" "HydrationStatus",
    "bodyBuild" "BodyBuild",
    "nourishment" "NourishmentStatus",
    "findings" TEXT[],
    "edemaLocations" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_general_inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_regional_examinations" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "area" "RegionalExaminationArea" NOT NULL,
    "findings" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_regional_examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_system_examinations" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "system" "ExaminationSystem" NOT NULL,
    "fields" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_system_examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_diagnoses" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "primaryDiagnosisCode" TEXT,
    "primaryDiagnosisName" TEXT,
    "differentialDiagnoses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_investigations" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "status" "InvestigationStatus" NOT NULL DEFAULT 'REQUESTED',
    "result" JSONB,
    "notes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_investigations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_procedures" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_procedures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_referrals" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_prescriptions" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "advice" TEXT,
    "notes" TEXT,
    "followUp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_prescription_medications" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medication" TEXT NOT NULL,
    "instructions" TEXT,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_prescription_medications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visits_secureCode_key" ON "visits"("secureCode");

-- CreateIndex
CREATE INDEX "visits_patientId_idx" ON "visits"("patientId");

-- CreateIndex
CREATE INDEX "visits_doctorId_idx" ON "visits"("doctorId");

-- CreateIndex
CREATE INDEX "visits_clinicId_idx" ON "visits"("clinicId");

-- CreateIndex
CREATE INDEX "visits_visitDate_idx" ON "visits"("visitDate");

-- CreateIndex
CREATE INDEX "visits_visitStatus_idx" ON "visits"("visitStatus");

-- CreateIndex
CREATE UNIQUE INDEX "visits_clinicId_visitCode_key" ON "visits"("clinicId", "visitCode");

-- CreateIndex
CREATE INDEX "patient_chronic_diseases_patientId_idx" ON "patient_chronic_diseases"("patientId");

-- CreateIndex
CREATE INDEX "patient_chronic_diseases_diseaseCode_idx" ON "patient_chronic_diseases"("diseaseCode");

-- CreateIndex
CREATE INDEX "patient_hospitalizations_patientId_idx" ON "patient_hospitalizations"("patientId");

-- CreateIndex
CREATE INDEX "patient_operations_patientId_idx" ON "patient_operations"("patientId");

-- CreateIndex
CREATE INDEX "patient_blood_transfusions_patientId_idx" ON "patient_blood_transfusions"("patientId");

-- CreateIndex
CREATE INDEX "patient_major_traumas_patientId_idx" ON "patient_major_traumas"("patientId");

-- CreateIndex
CREATE INDEX "patient_icu_admissions_patientId_idx" ON "patient_icu_admissions"("patientId");

-- CreateIndex
CREATE INDEX "patient_medications_patientId_idx" ON "patient_medications"("patientId");

-- CreateIndex
CREATE INDEX "patient_allergies_patientId_idx" ON "patient_allergies"("patientId");

-- CreateIndex
CREATE INDEX "patient_allergies_type_idx" ON "patient_allergies"("type");

-- CreateIndex
CREATE INDEX "patient_allergies_allergen_idx" ON "patient_allergies"("allergen");

-- CreateIndex
CREATE INDEX "patient_family_history_patientId_idx" ON "patient_family_history"("patientId");

-- CreateIndex
CREATE INDEX "patient_family_history_relation_idx" ON "patient_family_history"("relation");

-- CreateIndex
CREATE UNIQUE INDEX "patient_social_history_patientId_key" ON "patient_social_history"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_vaccination_history_patientId_key" ON "patient_vaccination_history"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_menstrual_history_visitId_key" ON "visit_menstrual_history"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_pediatric_history_visitId_key" ON "visit_pediatric_history"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_chief_complaints_visitId_key" ON "visit_chief_complaints"("visitId");

-- CreateIndex
CREATE INDEX "visit_chief_complaints_chiefComplaintId_idx" ON "visit_chief_complaints"("chiefComplaintId");

-- CreateIndex
CREATE UNIQUE INDEX "chief_complaint_master_code_key" ON "chief_complaint_master"("code");

-- CreateIndex
CREATE INDEX "chief_complaint_master_name_idx" ON "chief_complaint_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "chief_complaint_templates_chiefComplaintId_key" ON "chief_complaint_templates"("chiefComplaintId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_complaint_analysis_chiefComplaintId_key" ON "visit_complaint_analysis"("chiefComplaintId");

-- CreateIndex
CREATE INDEX "visit_complaint_analysis_templateCode_idx" ON "visit_complaint_analysis"("templateCode");

-- CreateIndex
CREATE INDEX "visit_related_systems_visitId_idx" ON "visit_related_systems"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_related_systems_visitId_system_key" ON "visit_related_systems"("visitId", "system");

-- CreateIndex
CREATE INDEX "visit_systematic_review_visitId_idx" ON "visit_systematic_review"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_systematic_review_visitId_system_key" ON "visit_systematic_review"("visitId", "system");

-- CreateIndex
CREATE UNIQUE INDEX "visit_vital_signs_visitId_key" ON "visit_vital_signs"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_general_inspection_visitId_key" ON "visit_general_inspection"("visitId");

-- CreateIndex
CREATE INDEX "visit_regional_examinations_visitId_idx" ON "visit_regional_examinations"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_regional_examinations_visitId_area_key" ON "visit_regional_examinations"("visitId", "area");

-- CreateIndex
CREATE INDEX "visit_system_examinations_visitId_idx" ON "visit_system_examinations"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_system_examinations_visitId_system_key" ON "visit_system_examinations"("visitId", "system");

-- CreateIndex
CREATE UNIQUE INDEX "visit_diagnoses_visitId_key" ON "visit_diagnoses"("visitId");

-- CreateIndex
CREATE INDEX "visit_diagnoses_primaryDiagnosisCode_idx" ON "visit_diagnoses"("primaryDiagnosisCode");

-- CreateIndex
CREATE INDEX "visit_investigations_visitId_idx" ON "visit_investigations"("visitId");

-- CreateIndex
CREATE INDEX "visit_investigations_status_idx" ON "visit_investigations"("status");

-- CreateIndex
CREATE INDEX "visit_procedures_visitId_idx" ON "visit_procedures"("visitId");

-- CreateIndex
CREATE INDEX "visit_referrals_visitId_idx" ON "visit_referrals"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "visit_prescriptions_visitId_key" ON "visit_prescriptions"("visitId");

-- CreateIndex
CREATE INDEX "visit_prescription_medications_prescriptionId_idx" ON "visit_prescription_medications"("prescriptionId");

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_chronic_diseases" ADD CONSTRAINT "patient_chronic_diseases_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_hospitalizations" ADD CONSTRAINT "patient_hospitalizations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_operations" ADD CONSTRAINT "patient_operations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_blood_transfusions" ADD CONSTRAINT "patient_blood_transfusions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_major_traumas" ADD CONSTRAINT "patient_major_traumas_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_icu_admissions" ADD CONSTRAINT "patient_icu_admissions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_medications" ADD CONSTRAINT "patient_medications_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_allergies" ADD CONSTRAINT "patient_allergies_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_family_history" ADD CONSTRAINT "patient_family_history_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_social_history" ADD CONSTRAINT "patient_social_history_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_vaccination_history" ADD CONSTRAINT "patient_vaccination_history_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_menstrual_history" ADD CONSTRAINT "visit_menstrual_history_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_pediatric_history" ADD CONSTRAINT "visit_pediatric_history_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_chief_complaints" ADD CONSTRAINT "visit_chief_complaints_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_chief_complaints" ADD CONSTRAINT "visit_chief_complaints_chiefComplaintId_fkey" FOREIGN KEY ("chiefComplaintId") REFERENCES "chief_complaint_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chief_complaint_templates" ADD CONSTRAINT "chief_complaint_templates_chiefComplaintId_fkey" FOREIGN KEY ("chiefComplaintId") REFERENCES "chief_complaint_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_complaint_analysis" ADD CONSTRAINT "visit_complaint_analysis_chiefComplaintId_fkey" FOREIGN KEY ("chiefComplaintId") REFERENCES "visit_chief_complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_related_systems" ADD CONSTRAINT "visit_related_systems_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_systematic_review" ADD CONSTRAINT "visit_systematic_review_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_vital_signs" ADD CONSTRAINT "visit_vital_signs_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_general_inspection" ADD CONSTRAINT "visit_general_inspection_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_regional_examinations" ADD CONSTRAINT "visit_regional_examinations_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_system_examinations" ADD CONSTRAINT "visit_system_examinations_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_diagnoses" ADD CONSTRAINT "visit_diagnoses_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_investigations" ADD CONSTRAINT "visit_investigations_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_procedures" ADD CONSTRAINT "visit_procedures_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_referrals" ADD CONSTRAINT "visit_referrals_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_prescriptions" ADD CONSTRAINT "visit_prescriptions_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_prescription_medications" ADD CONSTRAINT "visit_prescription_medications_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "visit_prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
