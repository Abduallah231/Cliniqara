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
  unit?:string;
}

// ======================================================
// Diagnosis
// ======================================================

export interface Diagnosis {
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

export interface Investigation {
  name: string;
  status: "requested" | "completed" | "cancelled";
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

export interface PrescriptionMedication {
  medication: string;
  instructions: string;
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