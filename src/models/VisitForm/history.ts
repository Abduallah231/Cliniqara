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
// Chief Complaint
// ======================================================

export interface ChiefComplaintHistory {
  complaintId: string;
  complaintName: string;
  durationValue:string;
  durationUnit:string;
  notes: string;
}

// ======================================================
// Analysis of Complaint
// ======================================================

export interface AnalysisOfComplaint {
  fields: DynamicFieldValue[];
}

// ======================================================
// Related System Symptoms
// ======================================================

export interface RelatedSystemSymptoms {
  fields: DynamicFieldValue[];
}

// ======================================================
// Systematic Review
// ======================================================

export interface SystematicReview {
  systems: DynamicFieldValue[];
}

// ======================================================
// History of Present Illness
// ======================================================

export interface HPIHistory {
  analysis: AnalysisOfComplaint;
  relatedSystemSymptoms: RelatedSystemSymptoms;
  systematicReview: SystematicReview;
}


// ======================================================
// Pediatric History
// ======================================================

export interface PediatricHistory {
  prenatalHistory: DynamicFieldValue[];
  birthHistory: DynamicFieldValue[];
  neonatalHistory: DynamicFieldValue[];
  feedingHistory: DynamicFieldValue[];
  developmentHistory: DynamicFieldValue[];
  schoolHistory: DynamicFieldValue[];
}

// ======================================================
// Vaccination History
// ======================================================

export interface VaccinationHistory {
  fields: DynamicFieldValue[];
}

// ======================================================
// Menstrual History
// ======================================================

export interface MenstrualHistory {
  fields: DynamicFieldValue[];
}

// ======================================================
// Past History
// ======================================================

export interface PastHistory {
  fields: DynamicFieldValue[];

  hospitalizations: Hospitalization[];

  operations: Operation[];

  bloodTransfusions: BloodTransfusion[];

  majorTraumas: MajorTrauma[];

  icuAdmissions: ICUAdmission[];
}

// ======================================================
// Past History Events
// ======================================================

export interface Hospitalization {
  id: string;
  reason: string;
  date: string;
  duration: string;
}

export interface Operation {
  id: string;
  name: string;
  date: string;
  indication: string;
}

export interface BloodTransfusion {
  id: string;
  reason: string;
  date: string;
  reaction: string;
}

export interface MajorTrauma {
  id: string;
  type: string;
  date: string;
  complications: string;
}

export interface ICUAdmission {
  id: string;
  reason: string;
  date: string;
  duration: string;
  ventilatorSupport: boolean;
}

// ======================================================
// Drug History
// ======================================================

export interface Medication {
  id: string;
  name: string;
  dose: string;

  durationValue: string;
  durationUnit: string;
}

export interface DrugHistory {
  currentMedications: Medication[];

  compliance: string;

  selfMedication: string;
  selfMedicationDetails: string;

  supplements: string;
  supplementDetails: string;
}

// ======================================================
// Allergy History
// ======================================================

export type AllergyType =
  | "Drug"
  | "Food"
  | "Environmental"
  | "Other";

export type AllergySeverity =
  | "Mild"
  | "Moderate"
  | "Severe"
  | "Anaphylaxis";

export interface Allergy {
  id: string;
  type: AllergyType;
  allergen: string;
  reaction: string;
  severity: AllergySeverity;
}

export interface AllergyHistory {
  hasAllergy: string;
  allergies: Allergy[];
}

// ======================================================
// Family History
// ======================================================

export interface FamilyDisease {
  id: string;
  affectedRelative: string;
  otherRelative: string;
  diseases: string[];
  alive: boolean;
  ageAtDeath: string;
  causeOfDeath: string;
}

export interface FamilyHistory {
  familyDiseases: FamilyDisease[];
}

// ======================================================
// Social History
// ======================================================

export interface SocialHistory {
  fields: DynamicFieldValue[];
}

// ======================================================
// Visit History
// ======================================================

export interface History {
  chiefComplaint: ChiefComplaintHistory;
  hpi: HPIHistory;
  pediatricHistory: PediatricHistory;
  vaccinationHistory: VaccinationHistory;
  menstrualHistory: MenstrualHistory;

  pastHistory: PastHistory;

  socialHistory: SocialHistory;

  drugHistory: DrugHistory;

  allergyHistory: AllergyHistory;

  familyHistory: FamilyHistory;
}

export function createEmptyHistory(): History {
  return {
  chiefComplaint: {
    complaintId: "",
    complaintName: "",
    durationValue: "",
    durationUnit: "",
    notes: "",
  },

  hpi: {
    analysis: {
      fields: [],
    },
    relatedSystemSymptoms: {
      fields: [],
    },
    systematicReview: {
      systems: [],
    },
  },

  pediatricHistory: {
    prenatalHistory: [],
    birthHistory: [],
    neonatalHistory: [],
    feedingHistory: [],
    developmentHistory: [],
    schoolHistory: [],
  },

  vaccinationHistory: {
    fields: [],
  },

  menstrualHistory: {
    fields: [],
  },

  pastHistory: {
    fields: [],

    hospitalizations: [],

    operations: [],

    bloodTransfusions: [],

    majorTraumas: [],

    icuAdmissions: [],
  },

  socialHistory: {
    fields: [],
  },

  drugHistory: {
    currentMedications: [],
    compliance: "",

    selfMedication: "",
    selfMedicationDetails: "",

    supplements: "",
    supplementDetails: "",
  },

  allergyHistory: {
    hasAllergy: "",
    allergies: [],
  },

  familyHistory: {
    familyDiseases: [],
  },
  };
}