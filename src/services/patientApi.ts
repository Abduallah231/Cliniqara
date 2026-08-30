import { useClinicStore } from "@/store/clinicStore";
import type {
  CreatePatientInput,
  Patient,
  Gender,
  UpdatePatientInput,
} from "@/types/patient";
import { api } from "./api";

function getClinicId(): string {
  const clinicId =
    useClinicStore.getState().currentClinic?.clinic.id;

  if (!clinicId) {
    throw new Error("No active clinic selected");
  }

  return clinicId;
}

function clinicHeaders() {
  return {
    "X-Clinic-Id": getClinicId(),
  };
}

export async function getPatients(): Promise<Patient[]> {
  const { data } = await api.get("/patients", {
    headers: clinicHeaders(),
  });

  return data;
}

export async function getPatient(
  patientId: string,
): Promise<Patient> {
  const { data } = await api.get(
    `/patients/${patientId}`,
    {
      headers: clinicHeaders(),
    },
  );

  return data;
}

export async function searchPatients(
  query: string,
): Promise<Patient[]> {
  const { data } = await api.get(
    "/patients/search",
    {
      params: {
        q: query.trim(),
      },
      headers: clinicHeaders(),
    },
  );

  return data;
}

export async function createPatient(
  dto: CreatePatientInput,
): Promise<Patient> {
  const { data } = await api.post(
    "/patients",
    dto,
    {
      headers: clinicHeaders(),
    },
  );

  return data;
}

export async function updatePatient(
  patientId: string,
  dto: UpdatePatientInput,
): Promise<Patient> {
  const { data } = await api.patch(
    `/patients/${patientId}`,
    dto,
    {
      headers: clinicHeaders(),
    },
  );

  return data;
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
  const { data } = await api.post(
    "/patients/verify-national-id",
    {
      nationalId: nationalId.trim(),
    },
    {
      headers: clinicHeaders(),
    },
  );

  return data;
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
  const { data } = await api.put(
    `/patients/${patientId}/drug-history`,
    dto,
  );

  return data;
}

export async function getDrugHistory(
  patientId: string,
): Promise<DrugHistoryResponse | null> {
  const { data } = await api.get(
    `/patients/${patientId}/drug-history`,
  );

  return data;
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
  const { data } = await api.put(
    `/patients/${patientId}/allergy-history`,
    dto,
  );

  return data;
}

export async function getAllergyHistory(
  patientId: string,
): Promise<AllergyHistoryResponse | null> {
  const { data } = await api.get(
    `/patients/${patientId}/allergy-history`,
  );

  return data;
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
  const { data } = await api.put(
    `/patients/${patientId}/family-history`,
    dto,
  );

  return data;
}

export async function getFamilyHistory(
  patientId: string,
): Promise<FamilyHistoryResponse | null> {
  const { data } = await api.get(
    `/patients/${patientId}/family-history`,
  );

  return data;
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
  const { data } = await api.put(
    `/patients/${patientId}/social-history`,
    dto,
  );

  return data;
}

export async function getSocialHistory(
  patientId: string,
): Promise<SocialHistoryResponse | null> {
  const { data } = await api.get(
    `/patients/${patientId}/social-history`,
  );

  return data;
}