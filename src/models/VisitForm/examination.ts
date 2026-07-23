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
// Vital Signs
// ======================================================

export interface BloodPressure {
  systolic: string;
  diastolic: string;
}

export interface VitalSigns {
  bloodPressure: BloodPressure;

  heartRate: string;
  pulseRhythm: string;

  spo2: string;
  oxygenSource: string;

  temperature: string;
  temperatureRoute: string;

  respiratoryRate: string;

  bloodGlucose: string;

  weight: string;
  height: string;
  bmi: string;
}

// ======================================================
// General Inspection
// ======================================================

export interface GeneralInspection {
  consciousness: string;

  appearance: string;

  hydration: string;

  bodyBuild: string;

  nourishment: string;

  findings: string[];

  edemaLocations: string[];
}

// ======================================================
// Regional Examination
// ======================================================

export interface RegionalPart {
  findings: string[];

  notes: string;
}

export interface RegionalExamination {
  head: RegionalPart;

  neck: RegionalPart;

  upperLimb: RegionalPart;

  lowerLimb: RegionalPart;
}

// ======================================================
// System Examination
// ======================================================

export interface ExaminationSystem {
  systemId: string;
  systemName: string;
  fields: DynamicFieldValue[];
}

export interface SystemExamination {
  selectedSystem: string;
  systems: ExaminationSystem[];
}

// ======================================================
// Visit Examination
// ======================================================

export interface Examination {
  vitalSigns: VitalSigns;

  generalInspection: GeneralInspection;

  regionalExamination: RegionalExamination;

  systemExamination: SystemExamination;
}

// ======================================================
// Create Empty Examination
// ======================================================

export function createEmptyExamination(): Examination {
  return {
    vitalSigns: {
      bloodPressure: {
        systolic: "",
        diastolic: "",
      },

      heartRate: "",
      pulseRhythm: "",

      spo2: "",
      oxygenSource: "",

      temperature: "",
      temperatureRoute: "",

      respiratoryRate: "",

      bloodGlucose: "",

      weight: "",
      height: "",
      bmi: "",
    },

    generalInspection: {
      consciousness: "",

      appearance: "",

      hydration: "",

      bodyBuild: "",

      nourishment: "",

      findings: [],

      edemaLocations: [],
    },

    regionalExamination: {
      head: {
        findings: ["NAD"],
        notes: "",
      },
      neck: {
        findings: ["NAD"],
        notes: "",
      },
      upperLimb: {
        findings: ["NAD"],
        notes: "",
      },
      lowerLimb: {
        findings: ["NAD"],
        notes: "",
      },
    },

    systemExamination: {
      selectedSystem: "CVS",
      systems: [],
    },
  };
}