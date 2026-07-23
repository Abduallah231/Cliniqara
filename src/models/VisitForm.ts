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
    patient: createEmptyPatient(),

    history: createEmptyHistory(),

    examination: createEmptyExamination(),

    assessment: createEmptyAssessment(),
  };
}