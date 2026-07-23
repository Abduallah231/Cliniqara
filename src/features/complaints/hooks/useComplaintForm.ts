import { useMemo } from "react";
import { ComplaintTemplate } from "../models/ComplaintTemplate";
import { useVisitStore } from "@/store/visitStore";

type ComplaintValues = Record<string, any>;

export default function useComplaintForm(
  template?: ComplaintTemplate
) {
  const {
    visit,
    updateAnalysisField,
  } = useVisitStore();

  const values = useMemo<ComplaintValues>(() => {
    if (!template) {
      return {};
    }

    const result: ComplaintValues = {};

    template.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const saved =
          visit.history.hpi.analysis.fields.find(
            (item) => item.fieldId === field.code
          );

        if (saved) {
          result[field.code] = saved.value;
        } else {
          switch (field.type) {
            case "MULTI_SELECT":
              result[field.code] = [];
              break;

            case "BOOLEAN":
              result[field.code] = false;
              break;

            default:
              result[field.code] = "";
          }
        }
      });
    });

    return result;
  }, [template, visit.history.hpi.analysis.fields]);

  const setValue = (
    fieldCode: string,
    value: any
  ) => {
    if (!template) return;

    let label = fieldCode;

    for (const section of template.sections) {
      const field = section.fields.find(
        (f) => f.code === fieldCode
      );

      if (field) {
        label = field.label;
        break;
      }
    }

    updateAnalysisField(
      fieldCode,
      label,
      value
    );
  };

  const reset = () => {};

  return {
    values,
    setValue,
    reset,
  };
}