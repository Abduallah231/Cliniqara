import { ComplaintTemplate } from "../models/ComplaintTemplate";

export type ValidationError = {
  fieldCode: string;
  message: string;
};

export default function validateComplaint(
  template: ComplaintTemplate,
  values: Record<string, any>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const section of template.sections) {
    for (const field of section.fields) {
      if (!field.required) continue;

      const value = values[field.code];

      let empty = false;

      if (
        value === undefined ||
        value === null
      ) {
        empty = true;
      } else if (
        typeof value === "string" &&
        value.trim() === ""
      ) {
        empty = true;
      } else if (
        Array.isArray(value) &&
        value.length === 0
      ) {
        empty = true;
      }

      if (empty) {
        errors.push({
          fieldCode: field.code,
          message: `${field.label} is required.`,
        });
      }
    }
  }

  return errors;
}