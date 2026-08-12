import type { CreatePatientInput } from "@/types/patient";

export function mapPatientToCreateDto(
  patient: any,
): CreatePatientInput {
  const identifierTypeMap = {
    "National ID": "NATIONAL_ID",
    Passport: "PASSPORT",
    Other: "OTHER",
    Unknown: "UNKNOWN",
  } as const;

  const genderMap = {
    male: "MALE",
    female: "FEMALE",
  } as const;

  const maritalStatusMap = {
    Single: "SINGLE",
    Married: "MARRIED",
    Divorced: "DIVORCED",
    Widowed: "WIDOWED",
  } as const;

  const ageUnitMap = {
    Years: "YEARS",
    Months: "MONTHS",
    Days: "DAYS",
  } as const;

  const identifierType =
    identifierTypeMap[
      patient.identifierType as keyof typeof identifierTypeMap
    ];

  const dto: CreatePatientInput = {
    identifierType,

    fullName: patient.fullName.trim(),

    maritalStatus:
      maritalStatusMap[
        patient.maritalStatus as keyof typeof maritalStatusMap
      ],

    phone: patient.phone?.trim() || undefined,

    occupation:
      patient.occupation?.trim() || undefined,

    governorate:
      patient.governorate?.trim() || undefined,

    city:
      patient.city?.trim() || undefined,

    district:
      patient.district?.trim() || undefined,

    streetAddress:
      patient.street?.trim() || undefined,
  };

  if (patient.identifierNumber?.trim()) {
    dto.identifierNumber =
      patient.identifierNumber.trim();
  }

  // Document Type is meaningful only for OTHER.
  if (
    patient.identifierType === "Other" &&
    patient.documentType?.trim()
  ) {
    dto.documentType =
      patient.documentType.trim();
  }

  if (patient.age?.trim()) {
    const age = Number(patient.age);

    if (!Number.isNaN(age)) {
      dto.estimatedAgeValue = age;

      dto.estimatedAgeUnit =
        ageUnitMap[
          patient.ageUnit as keyof typeof ageUnitMap
        ];
    }
  }

  // Children count is stored as a number in Backend.
  if (
    patient.childrenCount !== undefined &&
    patient.childrenCount !== null &&
    String(patient.childrenCount).trim() !== ""
  ) {
    const childrenCount =
      Number(patient.childrenCount);

    if (
      Number.isInteger(childrenCount) &&
      childrenCount >= 0
    ) {
      dto.childrenCount = childrenCount;
    }
  }

  // Backend extracts gender from Egyptian National ID.
  if (
    patient.identifierType !== "National ID" &&
    patient.gender
  ) {
    dto.gender =
      genderMap[
        patient.gender as keyof typeof genderMap
      ];
  }

  return dto;
}