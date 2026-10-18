import { useClinicStore } from "@/store/clinicStore";
import type {
  CreatePatientInput,
  Patient,
  UpdatePatientInput,
} from "@/types/patient";
import {
  getLocalRecord,
  listLocalRecords,
  putLocalRecord,
} from "./localDatabase";

function getClinicId(): string {
  const clinicId =
    useClinicStore.getState().currentClinic?.clinic.id;

  if (!clinicId) {
    throw new Error("No active clinic selected");
  }

  return clinicId;
}

async function savePatientSection<T extends object>(
  collection: string,
  patientId: string,
  value: T,
): Promise<T> {
  const patient = await getPatient(patientId);
  await putLocalRecord({
    collection,
    id: patientId,
    parentId: patientId,
    clinicId: patient.clinicId,
    value,
  });
  return value;
}

async function getPatientSection<T>(
  collection: string,
  patientId: string,
): Promise<T | null> {
  const patient = await getLocalRecord<Patient>("patients", patientId);
  if (!patient || patient.clinicId !== getClinicId()) return null;
  return (await getLocalRecord<T>(collection, patientId))?.value ?? null;
}

function localChildIds<T extends { id?: string }>(items: T[]): Array<T & { id: string }> {
  return items.map((item) => ({
    ...item,
    id: item.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }));
}

export async function getPatients(): Promise<Patient[]> {
  const clinicId = getClinicId();
  return (await listLocalRecords<Patient>("patients", clinicId)).map((row) => row.value);
}

export async function getPatient(
  patientId: string,
): Promise<Patient> {
  const row = await getLocalRecord<Patient>("patients", patientId);
  if (!row || row.clinicId !== getClinicId()) throw new Error("Patient not found");
  return row.value;
}

export async function searchPatients(
  query: string,
): Promise<Patient[]> {
  const normalized = query.trim().toLocaleLowerCase();
  const patients = await getPatients();
  if (!normalized) return patients;
  return patients.filter((patient) =>
    [patient.fullName, patient.patientCode, patient.phone, patient.identifierNumber]
      .some((value) => value?.toLocaleLowerCase().includes(normalized)),
  );
}

export async function createPatient(
  dto: CreatePatientInput,
): Promise<Patient> {
  const clinicId = getClinicId();
  const now = new Date().toISOString();
  const id = `local-patient-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const patient: Patient = {
    ...dto,
    id,
    patientCode: `L-${Date.now().toString().slice(-8)}`,
    clinicId,
    identifierNumber: dto.identifierNumber ?? null,
    documentType: dto.documentType ?? null,
    dateOfBirth: dto.dateOfBirth ?? null,
    estimatedAgeValue: dto.estimatedAgeValue ?? null,
    estimatedAgeUnit: dto.estimatedAgeUnit ?? null,
    maritalStatus: dto.maritalStatus,
    childrenCount: dto.childrenCount ?? null,
    governorate: dto.governorate ?? null,
    otherGovernorate: dto.otherGovernorate ?? null,
    city: dto.city ?? null,
    otherCity: dto.otherCity ?? null,
    district: dto.district ?? null,
    streetAddress: dto.streetAddress ?? null,
    gender: dto.gender ?? "MALE",
    phone: dto.phone ?? null,
    occupation: dto.occupation ?? null,
    otherOccupation: dto.otherOccupation ?? null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await putLocalRecord({ collection: "patients", id, clinicId, value: patient });
  return patient;
}

export async function updatePatient(
  patientId: string,
  dto: UpdatePatientInput,
): Promise<Patient> {
  const patient = await getPatient(patientId);
  const updated = { ...patient, ...dto, updatedAt: new Date().toISOString() };
  await putLocalRecord({ collection: "patients", id: patientId, clinicId: patient.clinicId, value: updated });
  return updated;
}

export type VerifyNationalIdResponse = {
  valid: boolean;
  alreadyExists: boolean;
  existingPatient: {
    id: string;
    patientCode: string;
    fullName: string;
  } | null;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
};

export async function verifyNationalId(
  nationalId: string,
): Promise<VerifyNationalIdResponse> {
  const value = nationalId.trim();
  const existing = (await getPatients()).find((patient) => patient.identifierNumber === value);
  const valid = /^\d{14}$/.test(value);
  return {
    valid,
    alreadyExists: Boolean(existing),
    existingPatient: existing ? { id: existing.id, patientCode: existing.patientCode, fullName: existing.fullName } : null,
    dateOfBirth: existing?.dateOfBirth ?? "",
    gender: existing?.gender ?? "MALE",
  };
}

// ======================================================
// Drug History
// ======================================================

export type SaveDrugHistoryInput = {
  medications: {
    medicationName: string;
    dose?: string | null;
    durationValue?: number | null;
    durationUnit?:
      | "HOURS"
      | "DAYS"
      | "WEEKS"
      | "MONTHS"
      | "YEARS"
      | null;
    notes?: string | null;
  }[];

  medicationCompliance?:
    | "GOOD"
    | "POOR"
    | "IRREGULAR"
    | null;

  selfMedication: boolean;
  selfMedicationDetails?: string | null;

  takesSupplements: boolean;
  supplementDetails?: string | null;
};

export type DrugHistoryResponse = {
  medications: {
    id: string;
    medicationName: string;
    dose?: string | null;
    durationValue?: number | null;
    durationUnit?:
      | "HOURS"
      | "DAYS"
      | "WEEKS"
      | "MONTHS"
      | "YEARS"
      | null;
    notes?: string | null;
  }[];

  medicationCompliance:
    | "GOOD"
    | "POOR"
    | "IRREGULAR"
    | null;

  selfMedication: boolean;
  selfMedicationDetails: string | null;

  takesSupplements: boolean;
  supplementDetails: string | null;
};

export async function saveDrugHistory(
  patientId: string,
  dto: SaveDrugHistoryInput,
): Promise<DrugHistoryResponse> {
  return savePatientSection("patient_drug_history", patientId, {
    ...dto,
    medications: localChildIds(dto.medications),
  }) as Promise<DrugHistoryResponse>;
}

export async function getDrugHistory(
  patientId: string,
): Promise<DrugHistoryResponse | null> {
  return getPatientSection<DrugHistoryResponse>("patient_drug_history", patientId);
}


// ======================================================
// Allergy History
// ======================================================

export type SaveAllergyHistoryInput = {
  hasAllergy: boolean;

  allergies: {
    type:
      | "DRUG"
      | "FOOD"
      | "ENVIRONMENTAL"
      | "OTHER";

    allergen: string;
    reaction?: string | null;

    severity:
      | "MILD"
      | "MODERATE"
      | "SEVERE"
      | "ANAPHYLAXIS";

    notes?: string | null;
  }[];
};

export type AllergyHistoryResponse = {
  hasAllergy: boolean;

  allergies: {
    id: string;
    type:
      | "DRUG"
      | "FOOD"
      | "ENVIRONMENTAL"
      | "OTHER";

    allergen: string;
    reaction: string | null;

    severity:
      | "MILD"
      | "MODERATE"
      | "SEVERE"
      | "ANAPHYLAXIS";

    notes: string | null;
  }[];
};

export async function saveAllergyHistory(
  patientId: string,
  dto: SaveAllergyHistoryInput,
): Promise<AllergyHistoryResponse> {
  return savePatientSection("patient_allergy_history", patientId, {
    ...dto,
    allergies: localChildIds(dto.allergies),
  }) as Promise<AllergyHistoryResponse>;
}

export async function getAllergyHistory(
  patientId: string,
): Promise<AllergyHistoryResponse | null> {
  return getPatientSection<AllergyHistoryResponse>("patient_allergy_history", patientId);
}


// ======================================================
// Family History
// ======================================================

export type SaveFamilyHistoryInput = {
  familyHistory: {
    relation:
      | "FATHER"
      | "MOTHER"
      | "BROTHER"
      | "SISTER"
      | "SON"
      | "DAUGHTER"
      | "GRANDFATHER"
      | "GRANDMOTHER"
      | "UNCLE"
      | "AUNT"
      | "COUSIN"
      | "OTHER";

    otherRelation?: string | null;

    diseases: string[];

    alive: boolean;

    ageAtDeath?: number | null;

    causeOfDeath?: string | null;

    notes?: string | null;
  }[];
};

export type FamilyHistoryResponse = {
  familyHistory: {
    id: string;

    relation:
      | "FATHER"
      | "MOTHER"
      | "BROTHER"
      | "SISTER"
      | "SON"
      | "DAUGHTER"
      | "GRANDFATHER"
      | "GRANDMOTHER"
      | "UNCLE"
      | "AUNT"
      | "COUSIN"
      | "OTHER";

    otherRelation: string | null;

    diseases: string[];

    alive: boolean;

    ageAtDeath: number | null;

    causeOfDeath: string | null;

    notes: string | null;
  }[];
};

export async function saveFamilyHistory(
  patientId: string,
  dto: SaveFamilyHistoryInput,
): Promise<FamilyHistoryResponse> {
  return savePatientSection("patient_family_history", patientId, {
    familyHistory: localChildIds(dto.familyHistory),
  }) as Promise<FamilyHistoryResponse>;
}

export async function getFamilyHistory(
  patientId: string,
): Promise<FamilyHistoryResponse | null> {
  return getPatientSection<FamilyHistoryResponse>("patient_family_history", patientId);
}


// ======================================================
// Social History
// ======================================================

export type SmokingStatus =
  | "NEVER"
  | "CURRENT"
  | "FORMER";

export type AlcoholStatus =
  | "NO"
  | "CURRENT"
  | "FORMER";

export type AlcoholFrequency =
  | "OCCASIONAL"
  | "WEEKLY"
  | "DAILY"
  | "HEAVY";

export type LivingCondition =
  | "LIVES_ALONE"
  | "LIVES_WITH_FAMILY"
  | "NURSING_HOME"
  | "HOMELESS"
  | "OTHER";

export type PhysicalActivityLevel =
  | "SEDENTARY"
  | "LIGHT"
  | "MODERATE"
  | "HEAVY";

export type SleepDuration =
  | "LESS_THAN_5"
  | "HOURS_5_TO_7"
  | "HOURS_7_TO_9"
  | "MORE_THAN_9";

export type SocialSupportLevel =
  | "GOOD"
  | "LIMITED"
  | "NO_SUPPORT"
  | "CAREGIVER_AVAILABLE";

export type SexualHistoryStatus =
  | "NOT_DISCUSSED"
  | "SEXUALLY_ACTIVE"
  | "NOT_ACTIVE";

export type SaveSocialHistoryInput = {
  smoking?: SmokingStatus | null;

  cigarettesPerDay?: number | null;
  yearsSmoking?: number | null;
  yearsSinceQuitting?: number | null;

  alcohol?: AlcoholStatus | null;

  alcoholFrequency?:
    | AlcoholFrequency
    | null;

  yearsSinceStopping?: number | null;

  livingCondition?:
    | LivingCondition
    | null;

  livingConditionNotes?: string | null;

  substanceUse: string[];

  substanceNotes?: string | null;

  physicalActivity?:
    | PhysicalActivityLevel
    | null;

  physicalActivityNotes?: string | null;

  sleepDuration?:
    | SleepDuration
    | null;

  sleepNotes?: string | null;

  socialSupport?:
    | SocialSupportLevel
    | null;

  socialSupportNotes?: string | null;

  sexualHistory?:
    | SexualHistoryStatus
    | null;

  sexualHistoryNotes?: string | null;
};

export type SocialHistoryResponse = {
  id: string;
  patientId: string;

  smoking: SmokingStatus | null;

  cigarettesPerDay: number | null;
  yearsSmoking: number | null;
  yearsSinceQuitting: number | null;

  alcohol: AlcoholStatus | null;

  alcoholFrequency:
    | AlcoholFrequency
    | null;

  yearsSinceStopping: number | null;

  livingCondition:
    | LivingCondition
    | null;

  livingConditionNotes: string | null;

  substanceUse: string[];

  substanceNotes: string | null;

  physicalActivity:
    | PhysicalActivityLevel
    | null;

  physicalActivityNotes: string | null;

  sleepDuration:
    | SleepDuration
    | null;

  sleepNotes: string | null;

  socialSupport:
    | SocialSupportLevel
    | null;

  socialSupportNotes: string | null;

  sexualHistory:
    | SexualHistoryStatus
    | null;

  sexualHistoryNotes: string | null;
};

export async function saveSocialHistory(
  patientId: string,
  dto: SaveSocialHistoryInput,
): Promise<SocialHistoryResponse> {
  const result: SocialHistoryResponse = {
    ...dto,
    id: `local-social-${patientId}`,
    patientId,
    smoking: dto.smoking ?? null,
    cigarettesPerDay: dto.cigarettesPerDay ?? null,
    yearsSmoking: dto.yearsSmoking ?? null,
    yearsSinceQuitting: dto.yearsSinceQuitting ?? null,
    alcohol: dto.alcohol ?? null,
    alcoholFrequency: dto.alcoholFrequency ?? null,
    yearsSinceStopping: dto.yearsSinceStopping ?? null,
    livingCondition: dto.livingCondition ?? null,
    livingConditionNotes: dto.livingConditionNotes ?? null,
    substanceNotes: dto.substanceNotes ?? null,
    physicalActivity: dto.physicalActivity ?? null,
    physicalActivityNotes: dto.physicalActivityNotes ?? null,
    sleepDuration: dto.sleepDuration ?? null,
    sleepNotes: dto.sleepNotes ?? null,
    socialSupport: dto.socialSupport ?? null,
    socialSupportNotes: dto.socialSupportNotes ?? null,
    sexualHistory: dto.sexualHistory ?? null,
    sexualHistoryNotes: dto.sexualHistoryNotes ?? null,
  };
  await savePatientSection("patient_social_history", patientId, result);
  return result;
}

export async function getSocialHistory(
  patientId: string,
): Promise<SocialHistoryResponse | null> {
  return getPatientSection<SocialHistoryResponse>("patient_social_history", patientId);
}
