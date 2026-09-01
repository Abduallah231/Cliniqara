import type {
  CancelVisitInput,
  ChangeDoctorInput,
  CompleteVisitInput,
  WaitingVisit,
  Visit,
} from "@/types/visit";
import { api } from "./api";

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

export type RelatedSystemItem = {
  system: RelatedSystemType;
  symptoms: string[];
  otherFinding?: string | null;
};

export type SaveRelatedSystemsInput = {
  systems: RelatedSystemItem[];
};

export async function createWaitingVisit(
  patientId: string,
  doctorId?: string,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/waiting",
    {
      patientId,
      ...(doctorId
        ? { doctorId }
        : {}),
    },
  );

  return data;
}

export async function getWaitingVisits(
  clinicId: string,
): Promise<WaitingVisit[]> {
  const { data } = await api.get(
    "/visits/waiting",
    {
      params: {
        clinicId,
      },
    },
  );

  return data;
}

export async function getOpenPatientVisit(
  patientId: string,
): Promise<Visit | null> {
  const { data } = await api.get(
    `/visits/patient/${patientId}/open`,
  );

  return data;
}

export async function getTodayVisitCount(
  clinicId: string,
): Promise<number> {
  const { data } = await api.get(
    "/visits/today/count",
    {
      params: {
        clinicId,
      },
    },
  );

  return data.count;
}

export async function startVisit(
  visitId: string,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/start",
    {
      visitId,
    },
  );

  return data;
}

export async function completeVisit(
  dto: CompleteVisitInput,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/complete",
    dto,
  );

  return data;
}

export async function cancelVisit(
  dto: CancelVisitInput,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/cancel",
    dto,
  );

  return data;
}

export async function changeDoctor(
  dto: ChangeDoctorInput,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/change-doctor",
    dto,
  );

  return data;
}

export async function getVisit(
  visitId: string,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/details",
    {
      visitId,
    },
  );

  return data;
}

export async function saveRelatedSystems(
  visitId: string,
  dto: SaveRelatedSystemsInput,
): Promise<RelatedSystemItem[]> {
  const { data } = await api.put(
    `/visits/${visitId}/related-systems`,
    dto,
  );

  return data;
}

export async function getRelatedSystems(
  visitId: string,
): Promise<RelatedSystemItem[]> {
  const { data } = await api.get(
    `/visits/${visitId}/related-systems`,
  );

  return data;
}

export async function saveChiefComplaint(
  visitId: string,
  chiefComplaintId: string,
  payload: {
    durationValue?: number;
    durationUnit?:
      | "HOURS"
      | "DAYS"
      | "WEEKS"
      | "MONTHS"
      | "YEARS";
    answers?: Record<string, any>;
  },
) {
  const { data } = await api.post(
    `/visits/${visitId}/chief-complaint`,
    {
      chiefComplaintId,
      ...payload,
    },
  );

  return data;
}

export async function getChiefComplaint(
  visitId: string,
  chiefComplaintId: string,
) {
  const { data } = await api.get(
    `/visits/${visitId}/chief-complaint/${chiefComplaintId}`,
  );

  return data;
}

export async function savePediatricHistory(
  visitId: string,
  dto: Record<string, unknown>,
) {
  const { data } = await api.post(
    `/visits/${visitId}/pediatric-history`,
    dto,
  );

  return data;
}

export async function getPediatricHistory(
  visitId: string,
) {
  const { data } = await api.get(
    `/visits/${visitId}/pediatric-history`,
  );

  return data;
}

export type CycleRegularity =
  | "REGULAR"
  | "IRREGULAR"
  | "UNKNOWN";

export type BleedingDuration =
  | "LESS_THAN_3_DAYS"
  | "DAYS_3_TO_7"
  | "MORE_THAN_7_DAYS";

export type MenstrualFlow =
  | "SCANTY"
  | "NORMAL"
  | "HEAVY"
  | "FLOODING";

export type DysmenorrheaSeverity =
  | "NONE"
  | "MILD"
  | "MODERATE"
  | "SEVERE";

export type PainStart =
  | "BEFORE_MENSES"
  | "FIRST_DAY"
  | "THROUGHOUT_MENSES";

export type SaveMenstrualHistoryInput = {
  ageAtMenarche?: number | null;
  cycleRegularity?: CycleRegularity | null;
  cycleLength?: number | null;
  bleedingDuration?: BleedingDuration | null;
  menstrualFlow?: MenstrualFlow | null;
  dysmenorrhea?: DysmenorrheaSeverity | null;
  painStarts?: PainStart | null;
  painRelievedBy?: string[];
  associatedSymptoms?: string[];
  intermenstrualBleeding?: boolean | null;
  postcoitalBleeding?: boolean | null;
  pmsSymptoms?: string[];
  lmp?: string | null;
};

export async function saveMenstrualHistory(
  visitId: string,
  dto: SaveMenstrualHistoryInput,
) {
  const { data } = await api.put(
    `/visits/${visitId}/menstrual-history`,
    dto,
  );

  return data;
}

export async function getMenstrualHistory(
  visitId: string,
) {
  const { data } = await api.get(
    `/visits/${visitId}/menstrual-history`,
  );

  return data;
}

export type VaccinationStatus =
  | "UP_TO_DATE"
  | "PARTIALLY_VACCINATED"
  | "UNVACCINATED"
  | "UNKNOWN";

export type VaccinationReason =
  | "MISSED_APPOINTMENT"
  | "VACCINE_UNAVAILABLE"
  | "MEDICAL_CONTRAINDICATION"
  | "PARENT_REFUSED"
  | "ACCESS_PROBLEMS"
  | "UNKNOWN"
  | "OTHER";

export type ReactionSeverity =
  | "MILD"
  | "MODERATE"
  | "SEVERE";

export type SaveVaccinationHistoryInput = {
  vaccinationStatus?: VaccinationStatus | null;
  missedVaccines?: string[];

  partialReason?: VaccinationReason | null;
  partialOtherDetails?: string | null;

  unvaccinatedReason?: VaccinationReason | null;
  unvaccinatedOtherDetails?: string | null;

  previousReaction?: boolean | null;

  reactionSeverity?: ReactionSeverity | null;
  reactionDetails?: string | null;
};

export async function saveVaccinationHistory(
  patientId: string,
  dto: SaveVaccinationHistoryInput,
) {
  const { data } = await api.put(
    `/patients/${patientId}/vaccination-history`,
    dto,
  );

  return data;
}

export async function getVaccinationHistory(
  patientId: string,
) {
  const { data } = await api.get(
    `/patients/${patientId}/vaccination-history`,
  );

  return data;
}

export type SavePastHistoryInput = {
  chronicDiseases: {
    diseaseCode: string;
    diseaseName: string;
    notes?: string | null;
  }[];
  hospitalizations: {
    reason: string;
    date?: string | null;
    duration?: string | null;
    notes?: string | null;
  }[];
  operations: {
    operationName: string;
    date?: string | null;
    indication?: string | null;
    notes?: string | null;
  }[];
  bloodTransfusions: {
    reason?: string | null;
    date?: string | null;
    reaction?: string | null;
    notes?: string | null;
  }[];
  majorTraumas: {
    traumaType: string;
    date?: string | null;
    complications?: string | null;
    notes?: string | null;
  }[];
  icuAdmissions: {
    reason: string;
    date?: string | null;
    duration?: string | null;
    ventilatorSupport?: boolean;
    notes?: string | null;
  }[];
};

export async function savePastHistory(
  patientId: string,
  dto: SavePastHistoryInput,
) {
  const { data } = await api.put(
    `/patients/${patientId}/past-history`,
    dto,
  );
  return data;
}

export async function getPastHistory(
  patientId: string,
) {
  const { data } = await api.get(
    `/patients/${patientId}/past-history`,
  );
  return data;
}

// ======================================================
// Examination - Vital Signs
// ======================================================

export type SaveVitalSignsInput = {
  systolicBP?: number | null;
  diastolicBP?: number | null;
  heartRate?: number | null;
  pulseRhythm?: string | null;
  respiratoryRate?: number | null;
  spo2?: number | null;
  oxygenSource?: string | null;
  temperature?: number | null;
  temperatureRoute?: string | null;
  bloodGlucose?: number | null;
  weight?: number | null;
  height?: number | null;
  bmi?: number | null;
};

export async function saveVitalSigns(
  visitId: string,
  dto: SaveVitalSignsInput,
) {
  const { data } = await api.put(
    `/visits/${visitId}/vital-signs`,
    dto,
  );

  return data;
}

export async function getVitalSigns(
  visitId: string,
) {
  const { data } = await api.get(
    `/visits/${visitId}/vital-signs`,
  );

  return data;
}


// ======================================================
// Examination - General Inspection
// ======================================================

export type SaveGeneralInspectionInput = {
  consciousness?: string | null;
  appearance?: string | null;
  hydration?: string | null;
  bodyBuild?: string | null;
  nourishment?: string | null;
  findings?: string[];
  edemaLocations?: string[];
};

export async function saveGeneralInspection(
  visitId: string,
  dto: SaveGeneralInspectionInput,
) {
  const { data } = await api.put(
    `/visits/${visitId}/general-inspection`,
    dto,
  );

  return data;
}

export async function getGeneralInspection(
  visitId: string,
) {
  const { data } = await api.get(
    `/visits/${visitId}/general-inspection`,
  );

  return data;
}


// ======================================================
// Examination - Regional Examination
// ======================================================

export type RegionalExaminationArea =
  | "HEAD"
  | "NECK"
  | "UPPER_LIMB"
  | "LOWER_LIMB";

export type RegionalExaminationItem = {
  area: RegionalExaminationArea;
  findings: string[];
  notes?: string | null;
};

export type SaveRegionalExaminationInput = {
  regionalExaminations: RegionalExaminationItem[];
};

export async function saveRegionalExamination(
  visitId: string,
  dto: SaveRegionalExaminationInput,
): Promise<RegionalExaminationItem[]> {
  const { data } = await api.put(
    `/visits/${visitId}/regional-examination`,
    dto,
  );

  return data;
}

export async function getRegionalExamination(
  visitId: string,
): Promise<RegionalExaminationItem[]> {
  const { data } = await api.get(
    `/visits/${visitId}/regional-examination`,
  );

  return data;
}


// ======================================================
// Examination - System Examination
// ======================================================

export type SystemExaminationItem = {
  system: string;
  fields: Record<string, unknown>;
};

export type SaveSystemExaminationInput = {
  systems: SystemExaminationItem[];
};

export async function saveSystemExamination(
  visitId: string,
  dto: SaveSystemExaminationInput,
): Promise<SystemExaminationItem[]> {
  const { data } = await api.put(
    `/visits/${visitId}/system-examination`,
    dto,
  );

  return data;
}

export async function getSystemExamination(
  visitId: string,
): Promise<SystemExaminationItem[]> {
  const { data } = await api.get(
    `/visits/${visitId}/system-examination`,
  );

  return data;
}