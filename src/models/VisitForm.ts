import {
  Patient,
  createEmptyPatient,
} from "./VisitForm/patient";

import {
  History,
  createEmptyHistory,
} from "./VisitForm/history";

import {
  Examination,
  createEmptyExamination,
} from "./VisitForm/examination";

import {
  Assessment,
  createEmptyAssessment,
} from "./VisitForm/assessment";

// ======================================================
// Visit Form
// ======================================================

export interface VisitForm {
  metadata: VisitMetadata;

  patient: Patient;

  history: History;

  examination: Examination;

  assessment: Assessment;
}

// ======================================================
// Create Empty Visit Form
// ======================================================

export function createEmptyVisitForm(): VisitForm {
  return {
    metadata: {
      id: "",
      patientId: "",
      clinicId: "",
      doctorId: "",
      visitNumber: "",
      status: "",
    },

    patient: createEmptyPatient(),

    history: createEmptyHistory(),

    examination: createEmptyExamination(),

    assessment: createEmptyAssessment(),
  };
}

// ======================================================
// Visit Metadata
// ======================================================

export interface VisitMetadata {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string;

  visitNumber: string;
  status: string;
}