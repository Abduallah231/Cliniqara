import { useCallback } from "react";
import { DynamicValue } from "@/models/VisitForm/assessment";

type ComplaintAnswer = {
  fieldId: string;
  fieldLabel: string;
  value: DynamicValue;
  unit?: string;
};

type ComplaintValues = Record<string, DynamicValue>;

type Props = {
  values: ComplaintValues;
  onChange: (
    fieldId: string,
    fieldLabel: string,
    value: DynamicValue,
    unit?: string
  ) => void;
};

export default function useComplaintForm({
  values,
  onChange,
}: Props) {
  const setValue = useCallback(
    (
      fieldId: string,
      fieldLabel: string,
      value: DynamicValue,
      unit?: string
    ) => {
      onChange(
        fieldId,
        fieldLabel,
        value,
        unit
      );
    },
    [onChange]
  );

  return {
    values,
    setValue,
  };
}