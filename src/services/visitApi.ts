import type {
  CancelVisitInput,
  ChangeDoctorInput,
  CompleteVisitInput,
  WaitingVisit,
  Visit,
} from "@/types/visit";

import { api } from "./api";

// ======================================================
// Shared
// ======================================================

export type DynamicValue =
  | string
  | string[]
  | number
  | boolean
  | null;

export type DynamicFieldValue = {
  fieldId: string;
  fieldLabel: string;
  value: DynamicValue;
  unit?: string;
};

// ======================================================
// Related Systems
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

// ======================================================
// Related Systems
// ======================================================

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

// ======================================================
// Chief Complaint
// ======================================================

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

// ======================================================
// Pediatric History
// ======================================================

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

// ======================================================
// Menstrual History
// ======================================================

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

// ======================================================
// Vaccination History
// ======================================================

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

// ======================================================
// Past History
// ======================================================

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

// ======================================================
// Assessment - Diagnosis
// ======================================================

export type DiagnosisInput = {
  code: string;
  diagnosis: string;
};

export type SaveDiagnosisInput = {
  primaryDiagnosisCode?: string | null;
  primaryDiagnosisName?: string | null;
  differentialDiagnoses?: DiagnosisInput[] | null;
};

export type DiagnosisResponse = {
  id: string;
  visitId: string;
  primaryDiagnosisCode: string | null;
  primaryDiagnosisName: string | null;
  differentialDiagnoses:
    | DiagnosisInput[]
    | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function saveDiagnosis(
  visitId: string,
  dto: SaveDiagnosisInput,
): Promise<DiagnosisResponse> {
  const { data } = await api.put(
    `/visits/${visitId}/diagnosis`,
    dto,
  );

  return data;
}

export async function getDiagnosis(
  visitId: string,
): Promise<DiagnosisResponse | null> {
  const { data } = await api.get(
    `/visits/${visitId}/diagnosis`,
  );

  return data;
}

// ======================================================
// Assessment - Investigations
// ======================================================

/**
 * UI status.
 *
 * Backend Prisma enum is:
 * REQUESTED | COMPLETED | CANCELLED
 */
export type InvestigationStatus =
  | "requested"
  | "completed"
  | "cancelled";

export type BackendInvestigationStatus =
  | "REQUESTED"
  | "COMPLETED"
  | "CANCELLED";

export type InvestigationImageInput = {
  fileUrl: string;
  sortOrder?: number;
};

/**
 * UI-oriented investigation shape.
 *
 * Important:
 * The UI keeps result as:
 *
 * {
 *   values: DynamicFieldValue[];
 * }
 *
 * visitApi converts this shape into the backend DTO
 * where `result` is directly an array.
 */
export type InvestigationInput = {
  /**
   * VisitInvestigation.id.
   *
   * Returned by the backend after persistence.
   * Not required for a new investigation.
   */
  id?: string;

  code?: string | null;

  name: string;

  status: InvestigationStatus;

  /**
   * UI representation of investigation result.
   */
  result?: {
    values: DynamicFieldValue[];
  } | null;

  notes?: string | null;

  images?: InvestigationImageInput[];
};

export type SaveInvestigationsInput = {
  investigations: InvestigationInput[];
};

export type InvestigationImageResponse = {
  id: string;
  investigationId: string;
  fileUrl: string;
  sortOrder: number;
  createdAt?: string;
};

/**
 * Actual backend representation.
 *
 * NestJS DTO expects:
 *
 * result?: InvestigationResultFieldDto[]
 *
 * and Prisma stores that array as JSON.
 */
export type InvestigationResponse = {
  id: string;
  visitId: string;
  code: string | null;
  name: string;
  status: BackendInvestigationStatus;

  result: DynamicFieldValue[] | null;

  notes: string | null;

  requestedAt: string;
  completedAt: string | null;

  images: InvestigationImageResponse[];
};

function toBackendInvestigationStatus(
  status: InvestigationStatus,
): BackendInvestigationStatus {
  switch (status) {
    case "completed":
      return "COMPLETED";

    case "cancelled":
      return "CANCELLED";

    case "requested":
    default:
      return "REQUESTED";
  }
}

function toUiInvestigationStatus(
  status: BackendInvestigationStatus,
): InvestigationStatus {
  switch (status) {
    case "COMPLETED":
      return "completed";

    case "CANCELLED":
      return "cancelled";

    case "REQUESTED":
    default:
      return "requested";
  }
}

/**
 * Convert the frontend/UI Investigation shape
 * into the actual backend DTO shape.
 *
 * UI:
 *   result: {
 *     values: [...]
 *   }
 *
 * Backend:
 *   result: [...]
 */
function mapInvestigationToBackend(
  investigation: InvestigationInput,
) {
  return {
    ...(investigation.code !== undefined
      ? {
          code: investigation.code,
        }
      : {}),

    name: investigation.name,

    status: toBackendInvestigationStatus(
      investigation.status,
    ),

    result:
      investigation.result !== undefined &&
      investigation.result !== null
        ? investigation.result.values
        : null,

    notes: investigation.notes ?? null,

    ...(investigation.images
      ? {
          images: investigation.images.map(
            (image, index) => ({
              fileUrl: image.fileUrl,
              sortOrder:
                image.sortOrder ?? index,
            }),
          ),
        }
      : {}),
  };
}

/**
 * Convert backend investigation
 * into the UI-friendly shape.
 *
 * Backend:
 *   result: [...]
 *
 * UI:
 *   result: {
 *     values: [...]
 *   }
 *
 * Important:
 * `id` is the real VisitInvestigation.id.
 */
function mapInvestigationToUi(
  investigation: InvestigationResponse,
): InvestigationInput {
  return {
    id: investigation.id,

    code: investigation.code,

    name: investigation.name,

    status: toUiInvestigationStatus(
      investigation.status,
    ),

    result:
      investigation.result !== null
        ? {
            values: investigation.result,
          }
        : null,

    notes: investigation.notes,

    images: investigation.images.map(
      (image) => ({
        fileUrl: image.fileUrl,
        sortOrder: image.sortOrder,
      }),
    ),
  };
}

export async function saveInvestigations(
  visitId: string,
  dto: SaveInvestigationsInput,
): Promise<InvestigationResponse[]> {
  const payload = {
    investigations:
      dto.investigations.map(
        mapInvestigationToBackend,
      ),
  };

  const { data } = await api.put(
    `/visits/${visitId}/investigations`,
    payload,
  );

  return data as InvestigationResponse[];
}

export async function getInvestigations(
  visitId: string,
): Promise<InvestigationInput[]> {
  const { data } = await api.get(
    `/visits/${visitId}/investigations`,
  );

  return (data as InvestigationResponse[]).map(
    mapInvestigationToUi,
  );
}

// ======================================================
// Assessment - Procedures
// ======================================================

export type ProcedureInput = {
  details: string;
};

export type SaveProceduresInput = {
  procedures: ProcedureInput[];
};

export async function saveProcedures(
  visitId: string,
  dto: SaveProceduresInput,
): Promise<ProcedureInput[]> {
  const { data } = await api.put(
    `/visits/${visitId}/procedures`,
    dto,
  );

  return data;
}

export async function getProcedures(
  visitId: string,
): Promise<ProcedureInput[]> {
  const { data } = await api.get(
    `/visits/${visitId}/procedures`,
  );

  return data;
}

// ======================================================
// Assessment - Referrals
// ======================================================

export type ReferralInput = {
  details: string;
};

export type SaveReferralsInput = {
  referrals: ReferralInput[];
};

export async function saveReferrals(
  visitId: string,
  dto: SaveReferralsInput,
): Promise<ReferralInput[]> {
  const { data } = await api.put(
    `/visits/${visitId}/referrals`,
    dto,
  );

  return data;
}

export async function getReferrals(
  visitId: string,
): Promise<ReferralInput[]> {
  const { data } = await api.get(
    `/visits/${visitId}/referrals`,
  );

  return data;
}

// ======================================================
// Assessment - Prescription
// ======================================================

export type PrescriptionDurationUnit =
  | "DAYS"
  | "WEEKS"
  | "MONTHS"
  | "YEARS";

export type PrescriptionMedicationInput = {
  drugId: string;
  instructions?: string | null;
  durationValue?: string | number | null;
  durationUnit?: PrescriptionDurationUnit | null;
  sortOrder?: number;
};

export type SavePrescriptionInput = {
  medications: PrescriptionMedicationInput[];
  advice?: string | null;
  notes?: string | null;
  followUp?: string | null;
};

export type PrescriptionMedicationResponse = {
  id: string;
  prescriptionId: string;

  drugId: string | null;
  medication: string;

  instructions: string | null;
  durationValue: number | null;
  durationUnit: string | null;
  sortOrder: number | null;

  createdAt?: string;
  updatedAt?: string;
};

export type PrescriptionResponse = {
  id: string;
  visitId: string;

  advice: string | null;
  notes: string | null;
  followUp: string | null;

  medications: PrescriptionMedicationResponse[];

  createdAt?: string;
  updatedAt?: string;
};

function mapDurationValueToBackend(
  value:
    | string
    | number
    | null
    | undefined,
): number | null {
  if (
    value ===
      undefined ||
    value ===
      null ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value ===
    "number"
  ) {
    return Number.isInteger(value)
      ? value
      : null;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed,
    ) ||
    !Number.isInteger(parsed)
  ) {
    return null;
  }

  return parsed;
}

function mapPrescriptionToBackend(
  dto: SavePrescriptionInput,
) {
  return {
    medications:
      dto.medications.map(
        (medication, index) => ({
          drugId: medication.drugId,

          instructions:
            medication.instructions ??
            null,

          durationValue:
            mapDurationValueToBackend(
              medication.durationValue,
            ),

          durationUnit:
            medication.durationUnit ??
            null,

          sortOrder:
            medication.sortOrder ??
            index,
        }),
      ),

    advice:
      dto.advice ??
      null,

    notes:
      dto.notes ??
      null,

    followUp:
      dto.followUp ??
      null,
  };
}

export async function savePrescription(
  visitId: string,
  dto: SavePrescriptionInput,
): Promise<PrescriptionResponse> {
  const payload =
    mapPrescriptionToBackend(dto);

  const { data } = await api.put(
    `/visits/${visitId}/prescription`,
    payload,
  );

  return data;
}

export async function getPrescription(
  visitId: string,
): Promise<PrescriptionResponse | null> {
  const { data } = await api.get(
    `/visits/${visitId}/prescription`,
  );

  return data;
}

// ======================================================
// Assessment - Combined Helpers
// ======================================================

/**
 * These helpers are intentionally kept separate from
 * the Zustand store.
 *
 * The store remains UI-oriented while this service
 * handles backend/Prisma representation.
 */

export type SaveAssessmentInput = {
  diagnosis?: SaveDiagnosisInput;

  investigations?: SaveInvestigationsInput;

  procedures?: SaveProceduresInput;

  referrals?: SaveReferralsInput;

  prescription?: SavePrescriptionInput;
};

/**
 * Save only the assessment sections that are supplied.
 *
 * This does NOT make one artificial backend endpoint.
 * Each section is persisted through its own API.
 */
export async function saveAssessment(
  visitId: string,
  assessment: SaveAssessmentInput,
) {
  const requests: Promise<unknown>[] =
    [];

  if (
    assessment.diagnosis !==
    undefined
  ) {
    requests.push(
      saveDiagnosis(
        visitId,
        assessment.diagnosis,
      ),
    );
  }

  if (
    assessment.investigations !==
    undefined
  ) {
    requests.push(
      saveInvestigations(
        visitId,
        assessment.investigations,
      ),
    );
  }

  if (
    assessment.procedures !==
    undefined
  ) {
    requests.push(
      saveProcedures(
        visitId,
        assessment.procedures,
      ),
    );
  }

  if (
    assessment.referrals !==
    undefined
  ) {
    requests.push(
      saveReferrals(
        visitId,
        assessment.referrals,
      ),
    );
  }

  if (
    assessment.prescription !==
    undefined
  ) {
    requests.push(
      savePrescription(
        visitId,
        assessment.prescription,
      ),
    );
  }

  return Promise.all(
    requests,
  );
}