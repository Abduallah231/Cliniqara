import axios from "axios";

const fieldLabels: Record<string, string> = {
  identifierNumber: "Identification number",
  identifierType: "Identification type",
  fullName: "Full name",
  dateOfBirth: "Date of birth",
  estimatedAgeValue: "Age",
  estimatedAgeUnit: "Age unit",
  gender: "Gender",
  maritalStatus: "Marital status",
  phone: "Phone number",
  occupation: "Occupation",
  governorate: "Governorate",
  city: "City",
  district: "District",
  street: "Street",
};

function formatValidationMessage(
  message: string,
): string {
  const match = message.match(
    /^([a-zA-Z0-9_]+)\s(.+)$/,
  );

  if (!match) {
    return message;
  }

  const [, field, rule] = match;

  const label =
    fieldLabels[field] ??
    field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) =>
        char.toUpperCase(),
      );

  if (rule === "should not be empty") {
    return `${label} is required.`;
  }

  if (rule === "must be a string") {
    return `${label} has an invalid value.`;
  }

  if (rule === "must be an integer number") {
    return `${label} must be a whole number.`;
  }

  if (rule.includes("must not be less than")) {
    return `${label} cannot be less than 0.`;
  }

  if (rule.includes("must be shorter than")) {
    return `${label} is too long.`;
  }

  if (rule.includes("must be a Date instance")) {
    return `${label} has an invalid date.`;
  }

  return `${label}: ${rule}`;
}

export function getErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message;

    if (Array.isArray(message)) {
      return [
        ...new Set(
          message.map((item) =>
            formatValidationMessage(
              String(item),
            ),
          ),
        ),
      ].join("\n");
    }

    if (typeof message === "string") {
      return formatValidationMessage(
        message,
      );
    }

    if (error.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }

    if (!error.response) {
      return "Unable to connect to the server. Please check your connection and try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}