-- ======================================================
-- Convert enums to TEXT without dropping existing data
-- Gender remains an enum.
-- ======================================================

-- ======================================================
-- Patient Allergy
-- ======================================================

ALTER TABLE "patient_allergies"
  ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT,
  ALTER COLUMN "severity" TYPE TEXT USING "severity"::TEXT;

-- ======================================================
-- Patient Family History
-- ======================================================

ALTER TABLE "patient_family_history"
  ALTER COLUMN "relation" TYPE TEXT USING "relation"::TEXT;

-- ======================================================
-- Patient Medications
-- ======================================================

ALTER TABLE "patient_medications"
  ALTER COLUMN "durationUnit" TYPE TEXT USING "durationUnit"::TEXT;

-- ======================================================
-- Patient Social History
-- ======================================================

ALTER TABLE "patient_social_history"
  ALTER COLUMN "smoking" TYPE TEXT USING "smoking"::TEXT,
  ALTER COLUMN "alcohol" TYPE TEXT USING "alcohol"::TEXT,
  ALTER COLUMN "alcoholFrequency" TYPE TEXT USING "alcoholFrequency"::TEXT,
  ALTER COLUMN "livingCondition" TYPE TEXT USING "livingCondition"::TEXT,
  ALTER COLUMN "physicalActivity" TYPE TEXT USING "physicalActivity"::TEXT,
  ALTER COLUMN "sleepDuration" TYPE TEXT USING "sleepDuration"::TEXT,
  ALTER COLUMN "socialSupport" TYPE TEXT USING "socialSupport"::TEXT,
  ALTER COLUMN "sexualHistory" TYPE TEXT USING "sexualHistory"::TEXT;

-- ======================================================
-- Patient Vaccination History
-- ======================================================

ALTER TABLE "patient_vaccination_history"
  ALTER COLUMN "vaccinationStatus" TYPE TEXT USING "vaccinationStatus"::TEXT,
  ALTER COLUMN "partialReason" TYPE TEXT USING "partialReason"::TEXT,
  ALTER COLUMN "unvaccinatedReason" TYPE TEXT USING "unvaccinatedReason"::TEXT,
  ALTER COLUMN "reactionSeverity" TYPE TEXT USING "reactionSeverity"::TEXT;

-- ======================================================
-- Patients
-- ======================================================

ALTER TABLE "patients"
  ALTER COLUMN "estimatedAgeUnit" TYPE TEXT USING "estimatedAgeUnit"::TEXT,
  ALTER COLUMN "identifierType" TYPE TEXT USING "identifierType"::TEXT,
  ALTER COLUMN "medicationCompliance" TYPE TEXT USING "medicationCompliance"::TEXT,
  ALTER COLUMN "maritalStatus" TYPE TEXT USING "maritalStatus"::TEXT;

-- ======================================================
-- Visit Chief Complaint
-- ======================================================

ALTER TABLE "visit_chief_complaints"
  ALTER COLUMN "durationUnit" TYPE TEXT USING "durationUnit"::TEXT;

-- ======================================================
-- Visit General Inspection
-- ======================================================

ALTER TABLE "visit_general_inspection"
  ALTER COLUMN "consciousness" TYPE TEXT USING "consciousness"::TEXT,
  ALTER COLUMN "appearance" TYPE TEXT USING "appearance"::TEXT,
  ALTER COLUMN "hydration" TYPE TEXT USING "hydration"::TEXT,
  ALTER COLUMN "bodyBuild" TYPE TEXT USING "bodyBuild"::TEXT,
  ALTER COLUMN "nourishment" TYPE TEXT USING "nourishment"::TEXT;

-- ======================================================
-- Visit Menstrual History
-- ======================================================

ALTER TABLE "visit_menstrual_history"
  ALTER COLUMN "cycleRegularity" TYPE TEXT USING "cycleRegularity"::TEXT,
  ALTER COLUMN "bleedingDuration" TYPE TEXT USING "bleedingDuration"::TEXT,
  ALTER COLUMN "menstrualFlow" TYPE TEXT USING "menstrualFlow"::TEXT,
  ALTER COLUMN "dysmenorrhea" TYPE TEXT USING "dysmenorrhea"::TEXT,
  ALTER COLUMN "painStarts" TYPE TEXT USING "painStarts"::TEXT;

-- ======================================================
-- Visit Pediatric History
-- ======================================================

ALTER TABLE "visit_pediatric_history"
  ALTER COLUMN "antenatalCare" TYPE TEXT USING "antenatalCare"::TEXT,
  ALTER COLUMN "smokingExposure" TYPE TEXT USING "smokingExposure"::TEXT,
  ALTER COLUMN "gestationalAge" TYPE TEXT USING "gestationalAge"::TEXT,
  ALTER COLUMN "deliveryMode" TYPE TEXT USING "deliveryMode"::TEXT,
  ALTER COLUMN "development" TYPE TEXT USING "development"::TEXT,
  ALTER COLUMN "delayType" TYPE TEXT USING "delayType"::TEXT,
  ALTER COLUMN "schoolPerformance" TYPE TEXT USING "schoolPerformance"::TEXT,
  ALTER COLUMN "schoolAttendance" TYPE TEXT USING "schoolAttendance"::TEXT;

-- ======================================================
-- Visit Regional Examination
-- ======================================================

ALTER TABLE "visit_regional_examinations"
  ALTER COLUMN "area" TYPE TEXT USING "area"::TEXT;

-- ======================================================
-- Visit Related Systems
-- ======================================================

ALTER TABLE "visit_related_systems"
  ALTER COLUMN "system" TYPE TEXT USING "system"::TEXT;

-- ======================================================
-- Visit System Examination
-- ======================================================

ALTER TABLE "visit_system_examinations"
  ALTER COLUMN "system" TYPE TEXT USING "system"::TEXT;

-- ======================================================
-- Visit Systematic Review
-- ======================================================

ALTER TABLE "visit_systematic_review"
  ALTER COLUMN "system" TYPE TEXT USING "system"::TEXT;

-- ======================================================
-- Visit Vital Signs
-- ======================================================

ALTER TABLE "visit_vital_signs"
  ALTER COLUMN "pulseRhythm" TYPE TEXT USING "pulseRhythm"::TEXT,
  ALTER COLUMN "oxygenSource" TYPE TEXT USING "oxygenSource"::TEXT,
  ALTER COLUMN "temperatureRoute" TYPE TEXT USING "temperatureRoute"::TEXT;

-- ======================================================
-- Drop converted PostgreSQL enum types
-- Gender is intentionally NOT dropped.
-- ======================================================

DROP TYPE "AgeUnit";
DROP TYPE "AlcoholFrequency";
DROP TYPE "AlcoholStatus";
DROP TYPE "AllergySeverity";
DROP TYPE "AllergyType";
DROP TYPE "AntenatalCare";
DROP TYPE "BleedingDuration";
DROP TYPE "BodyBuild";
DROP TYPE "ConsciousnessLevel";
DROP TYPE "CycleRegularity";
DROP TYPE "DelayType";
DROP TYPE "DeliveryMode";
DROP TYPE "DevelopmentStatus";
DROP TYPE "DurationUnit";
DROP TYPE "DysmenorrheaSeverity";
DROP TYPE "ExaminationSystem";
DROP TYPE "FamilyRelation";
DROP TYPE "GeneralAppearance";
DROP TYPE "GestationalAge";
DROP TYPE "HydrationStatus";
DROP TYPE "LivingCondition";
DROP TYPE "MaritalStatus";
DROP TYPE "MedicationCompliance";
DROP TYPE "MenstrualFlow";
DROP TYPE "NourishmentStatus";
DROP TYPE "OxygenSource";
DROP TYPE "PainStart";
DROP TYPE "PatientIdentifierType";
DROP TYPE "PhysicalActivityLevel";
DROP TYPE "PulseRhythm";
DROP TYPE "ReactionSeverity";
DROP TYPE "RegionalExaminationArea";
DROP TYPE "SchoolAttendance";
DROP TYPE "SchoolPerformance";
DROP TYPE "SexualHistoryStatus";
DROP TYPE "SleepDuration";
DROP TYPE "SmokingExposure";
DROP TYPE "SmokingStatus";
DROP TYPE "SocialSupportLevel";
DROP TYPE "SystemType";
DROP TYPE "TemperatureRoute";
DROP TYPE "VaccinationReason";
DROP TYPE "VaccinationStatus";
