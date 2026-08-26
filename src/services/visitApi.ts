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
  visitId: string,
  dto: SaveVaccinationHistoryInput,
) {
  const { data } = await api.post(
    `/visits/${visitId}/vaccination-history`,
    dto,
  );

  return data;
}

export async function getVaccinationHistory(
  visitId: string,
) {
  const { data } = await api.get(
    `/visits/${visitId}/vaccination-history`,
  );

  return data;
}