import { useMemo, useState } from "react";

import { ComplaintTemplate } from "../models/ComplaintTemplate";

type ComplaintValues = Record<string, any>;

export default function useComplaintForm(
  template: ComplaintTemplate
) {
  const initialValues = useMemo<ComplaintValues>(() => {
    const values: ComplaintValues = {};

    template.sections.forEach((section) => {
      section.fields.forEach((field) => {
        switch (field.type) {
          case "MULTI_SELECT":
            values[field.code] = [];
            break;

          case "BOOLEAN":
            values[field.code] = false;
            break;

          default:
            values[field.code] = "";
        }
      });
    });

    return values;
  }, [template]);

  const [values, setValues] =
    useState<ComplaintValues>(initialValues);

  const setValue = (
    fieldCode: string,
    value: any
  ) => {
    setValues((previous) => ({
      ...previous,
      [fieldCode]: value,
    }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  return {
    values,
    setValue,
    reset,
  };
}