import { Patient } from "@/models/VisitForm/patient";

export function mapPatientToCreateDto(patient: Patient) {
  return {
    identifierType: mapIdentifierType(patient.identifierType),

    identifierNumber:
      patient.identifierType === "Unknown"
        ? undefined
        : patient.identifierNumber,

    fullName: patient.fullName.trim(),

    estimatedAgeValue:
      patient.age === ""
        ? undefined
        : Number(patient.age),

    estimatedAgeUnit: mapAgeUnit(patient.ageUnit),

    gender: patient.gender.toUpperCase(),

    maritalStatus: patient.maritalStatus.toUpperCase(),

    phone: patient.phone || undefined,

    occupation:
      patient.occupation === "Other"
        ? patient.otherOccupation
        : patient.occupation || undefined,

    governorate:
      patient.governorate || undefined,

    city:
      patient.city || undefined,

    district:
      patient.district || undefined,

    streetAddress:
      patient.street || undefined,
  };
}

function mapIdentifierType(type: string) {
  switch (type) {
    case "National ID":
      return "NATIONAL_ID";

    case "Birth Certificate":
      return "BIRTH_CERTIFICATE";

    case "Passport":
      return "PASSPORT";

    case "Other":
      return "OTHER";

    case "Unknown":
      return "UNKNOWN";

    default:
      return "UNKNOWN";
  }
}

function mapAgeUnit(unit: string) {
  switch (unit) {
    case "Years":
      return "YEARS";

    case "Months":
      return "MONTHS";

    case "Days":
      return "DAYS";

    default:
      return "YEARS";
  }
}