import type { AgeUnit, Gender } from "@/types/patient";

export function getAgeInYears(
  age: number | null | undefined,
  ageUnit: AgeUnit | null | undefined
): number {
  if (age == null || ageUnit == null || Number.isNaN(age)) {
    return 0;
  }

  switch (ageUnit) {
    case "DAYS":
      return age / 365;

    case "MONTHS":
      return age / 12;

    case "YEARS":
      return age;

    default:
      return 0;
  }
}

export function isPediatric(
  age: number | null | undefined,
  ageUnit: AgeUnit | null | undefined
): boolean {
  return getAgeInYears(age, ageUnit) < 18;
}

export function shouldShowMenstrualHistory(
  gender: Gender | null | undefined,
  age: number | null | undefined,
  ageUnit: AgeUnit | null | undefined
): boolean {
  return (
    gender === "FEMALE" &&
    getAgeInYears(age, ageUnit) >= 8
  );
}