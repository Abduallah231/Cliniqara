export type PatientIdentifierType =
  | "NATIONAL_ID"
  | "PASSPORT"
  | "OTHER"
  | "UNKNOWN";

export type AgeUnit =
  | "YEARS"
  | "MONTHS"
  | "DAYS";

export type Gender =
  | "MALE"
  | "FEMALE";

export type MaritalStatus =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED";

export type Patient = {
  id: string;
  patientCode: string;
  clinicId: string;
  fullName: string;
  identifierType: PatientIdentifierType;
  identifierNumber: string | null;
  documentType: string | null;
  dateOfBirth: string | null;
  estimatedAgeValue: number | null;
  estimatedAgeUnit: AgeUnit | null;
  maritalStatus: MaritalStatus;
  childrenCount: number | null;

  governorate: string | null;
  otherGovernorate: string | null;

  city: string | null;
  otherCity: string | null;

  district: string | null;
  streetAddress: string | null;

  gender: Gender;
  phone: string | null;

  occupation: string | null;
  otherOccupation: string | null;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePatientInput = {
  identifierType: PatientIdentifierType;
  identifierNumber?: string;
  documentType?: string;

  fullName: string;

  dateOfBirth?: string;
  estimatedAgeValue?: number;
  estimatedAgeUnit?: AgeUnit;

  gender?: Gender;

  maritalStatus: MaritalStatus;
  childrenCount?: number;

  phone?: string;
  occupation?: string;
  otherOccupation?: string;

  governorate?: string;
  otherGovernorate?: string;

  city?: string;
  otherCity?: string;

  district?: string;
  streetAddress?: string;

};

export type UpdatePatientInput = {
  phone?: string;
  occupation?: string;
  otherOccupation?: string;
  childrenCount?: number;

  governorate?: string;
  otherGovernorate?: string;

  city?: string;
  otherCity?: string;

  district?: string;
  streetAddress?: string;
};