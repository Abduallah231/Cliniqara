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
  durationValue?: number;
  durationUnit?:
    | "HOURS"
    | "DAYS"
    | "WEEKS"
    | "MONTHS"
    | "YEARS";
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

export type RelatedSystemType =
  | "GENERAL"
  | "CVS"
  | "CHEST"
  | "GIT"
  | "RENAL"
  | "NEURO"
  | "MUSCULOSKELETAL"
  | "ENDOCRINE"
  | "HEMATOLOGY"
  | "SKIN"
  | "GYNECOLOGY"
  | "OBSTETRIC"
  | "ENT"
  | "OPHTHALMOLOGY";

export interface RelatedSystemItem {
  system: RelatedSystemType;
  symptoms: string[];
  otherFinding?: string | null;
}

export interface RelatedSystemSymptoms {
  systems: RelatedSystemItem[];
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

export type AntenatalCare =
  | "REGULAR"
  | "IRREGULAR"
  | "NONE"
  | "UNKNOWN";

export type SmokingExposure =
  | "NO"
  | "PASSIVE"
  | "MATERNAL_SMOKING";

export type GestationalAge =
  | "TERM"
  | "PRETERM"
  | "POST_TERM"
  | "UNKNOWN";

export type DeliveryMode =
  | "NORMAL_VAGINAL"
  | "CESAREAN"
  | "INSTRUMENTAL"
  | "UNKNOWN";

export type DevelopmentStatus =
  | "NORMAL"
  | "DELAYED"
  | "UNKNOWN";

export type DelayType =
  | "GROSS_MOTOR"
  | "FINE_MOTOR"
  | "SPEECH"
  | "SOCIAL"
  | "MULTIPLE";

export type SchoolPerformance =
  | "GOOD"
  | "AVERAGE"
  | "POOR";

export type SchoolAttendance =
  | "REGULAR"
  | "IRREGULAR";

export interface PediatricHistory {
  antenatalCare?: AntenatalCare;
  antenatalCareNotes: string;

  maternalIllnesses: string[];
  maternalIllnessOther: string;

  pregnancyComplications: string[];
  pregnancyComplicationsOther: string;

  drugIntake?: boolean;
  drugIntakeDetails: string;

  smokingExposure?: SmokingExposure;

  alcoholExposure?: boolean;
  alcoholExposureDetails: string;

  gestationalAge?: GestationalAge;
  gestationalWeeks?: number;

  deliveryMode?: DeliveryMode;

  birthWeight?: number;

  nicuAdmission?: boolean;
  nicuReason: string;
  nicuDuration?: number;

  birthComplications: string[];
  birthComplicationDetails: string;

  neonatalJaundice?: boolean;
  phototherapy?: boolean;
  exchangeTransfusion?: boolean;
  neonatalSeizures?: boolean;

  feedingTypes: string[];

  development?: DevelopmentStatus;
  delayType?: DelayType;
  delayDetails: string;

  attendsSchool?: boolean;
  grade: string;

  schoolPerformance?: SchoolPerformance;
  schoolPerformanceDetails: string;

  schoolAttendance?: SchoolAttendance;
  schoolAttendanceReason: string;
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
    durationValue: undefined,
    durationUnit: undefined,
    notes: "",
  },

  hpi: {
    analysis: {
      fields: [],
    },
    relatedSystemSymptoms: {
      systems: [],
    },
    systematicReview: {
      systems: [],
    },
  },

  pediatricHistory: {
    antenatalCare: undefined,
    antenatalCareNotes: "",

    maternalIllnesses: [],
    maternalIllnessOther: "",

    pregnancyComplications: [],
    pregnancyComplicationsOther: "",

    drugIntake: undefined,
    drugIntakeDetails: "",

    smokingExposure: undefined,

    alcoholExposure: undefined,
    alcoholExposureDetails: "",

    gestationalAge: undefined,
    gestationalWeeks: undefined,

    deliveryMode: undefined,

    birthWeight: undefined,

    nicuAdmission: undefined,
    nicuReason: "",
    nicuDuration: undefined,

    birthComplications: [],
    birthComplicationDetails: "",

    neonatalJaundice: undefined,
    phototherapy: undefined,
    exchangeTransfusion: undefined,
    neonatalSeizures: undefined,

    feedingTypes: [],

    development: undefined,
    delayType: undefined,
    delayDetails: "",

    attendsSchool: undefined,
    grade: "",

    schoolPerformance: undefined,
    schoolPerformanceDetails: "",

    schoolAttendance: undefined,
    schoolAttendanceReason: "",
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