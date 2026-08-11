export type EgyptianNationalIdData = {
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE';
};

export function parseEgyptianNationalId(
  nationalId: string,
): EgyptianNationalIdData {
  const value = nationalId.trim();

  if (!/^\d{14}$/.test(value)) {
    throw new Error(
      'Egyptian National ID must contain exactly 14 digits.',
    );
  }

  const centuryDigit = Number(value[0]);

  if (centuryDigit !== 2 && centuryDigit !== 3) {
    throw new Error(
      'Invalid Egyptian National ID century.',
    );
  }

  const year = Number(value.slice(1, 3));
  const month = Number(value.slice(3, 5));
  const day = Number(value.slice(5, 7));

  const fullYear =
    (centuryDigit === 2 ? 1900 : 2000) + year;

  const date = new Date(
    Date.UTC(
      fullYear,
      month - 1,
      day,
    ),
  );

  if (
    date.getUTCFullYear() !== fullYear ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(
      'Invalid birth date in Egyptian National ID.',
    );
  }

  const serialGenderDigit = Number(value[12]);

  return {
    dateOfBirth: date,
    gender:
      serialGenderDigit % 2 === 0
        ? 'FEMALE'
        : 'MALE',
  };
}