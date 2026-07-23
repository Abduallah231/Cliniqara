export function getAgeInYears(
  age: string,
  ageUnit: "Days" | "Months" | "Years"
): number {
  const value = Number(age);

  if (isNaN(value)) {
    return 0;
  }

  switch (ageUnit) {
    case "Days":
      return value / 365;

    case "Months":
      return value / 12;

    case "Years":
    default:
      return value;
  }
}

export function isPediatric(
  age: string,
  ageUnit: "Days" | "Months" | "Years"
): boolean {
  return getAgeInYears(age, ageUnit) < 18;
}

export function shouldShowMenstrualHistory(
  gender: "male" | "female",
  age: string,
  ageUnit: "Days" | "Months" | "Years"
): boolean {
  return (
    gender === "female" &&
    getAgeInYears(age, ageUnit) >= 8
  );
}