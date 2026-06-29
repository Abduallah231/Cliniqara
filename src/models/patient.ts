export type Gender = "Male" | "Female";

export type PatientSummary = {
  id: string;

  fullName: string;

  age: number;

  gender: Gender;

  phone?: string;

  lastVisit?: string;

  isFavorite?: boolean;
};

export type PatientDetails = PatientSummary & {
  nationalId?: string;

  dateOfBirth?: string;

  occupation?: string;

  maritalStatus?: string;

  address?: string;

  bloodGroup?: string;

  emergencyContact?: string;
};