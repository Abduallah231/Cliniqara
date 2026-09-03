// ======================================================
// Shared Types
// ======================================================

export type DynamicValue =
  | string
  | string[]
  | number
  | boolean
  | null;

export interface DynamicFieldValue {
  fieldId: string;
  fieldLabel: string;
  value: DynamicValue;
  unit?: string;
}

// ======================================================
// Diagnosis
// ======================================================

export interface Diagnosis {
  code: string;
  diagnosis: string;
}

export interface DiagnosisAssessment {
  aiSuggestedDiagnoses: Diagnosis[];
  primaryDiagnosis?: Diagnosis;
  differentialDiagnoses: Diagnosis[];
}

// ======================================================
// Investigation
// ======================================================

export type InvestigationStatus =
  | "requested"
  | "completed"
  | "cancelled";

export interface InvestigationImage {
  fileUrl: string;
  sortOrder?: number;
}

export interface Investigation {
  id?: string;
  code?: string;
  name: string;
  status: InvestigationStatus;

  /**
   * Images attached to this investigation result.
   *
   * Optional for backward compatibility with existing
   * investigation creation flows.
   */
  images?: InvestigationImage[];
}

export interface InvestigationResult {
  investigationId: string;
  values: DynamicFieldValue[];
}

export interface InvestigationAssessment {
  aiSuggestedInvestigations: Investigation[];
  requestedInvestigations: Investigation[];
  results: InvestigationResult[];
}

// ======================================================
// Procedures & Referrals
// ======================================================

export interface Procedure {
  details: string;
}

export interface Referral {
  details: string;
}

export interface ProceduresReferrals {
  procedures: Procedure[];
  referrals: Referral[];
}

// ======================================================
// Prescription
// ======================================================

export type PrescriptionDurationUnit =
  | "DAYS"
  | "WEEKS"
  | "MONTHS"
  | "YEARS";

export interface PrescriptionMedication {
  drugId: string;
  medication: string;
  instructions: string;
  durationValue: string;
  durationUnit: PrescriptionDurationUnit;
}

export interface Prescription {
  medications: PrescriptionMedication[];
  advice: string;
  notes: string;
  followUp: string;
}

// ======================================================
// Assessment
// ======================================================

export interface Assessment {
  diagnosis: DiagnosisAssessment;
  investigations: InvestigationAssessment;
  proceduresReferrals: ProceduresReferrals;
  prescription: Prescription;
}

// ======================================================
// Create Empty Assessment
// ======================================================

export function createEmptyAssessment(): Assessment {
  return {
    diagnosis: {
      aiSuggestedDiagnoses: [],
      primaryDiagnosis: undefined,
      differentialDiagnoses: [],
    },

    investigations: {
      aiSuggestedInvestigations: [],
      requestedInvestigations: [],
      results: [],
    },

    proceduresReferrals: {
      procedures: [],
      referrals: [],
    },

    prescription: {
      medications: [],
      advice: "",
      notes: "",
      followUp: "",
    },
  };
}