import AppTextField from "@/components/common/AppTextField";
import { ComplaintField } from "../../models/ComplaintField";

type Props = {
  field: ComplaintField;
  value: string;
  onChange: (value: string) => void;
};

export default function DecimalField({
  field,
  value,
  onChange,
}: Props) {
  return (
    <AppTextField
      label={field.label}
      value={value ?? ""}
      placeholder={field.placeholder}
      keyboardType="decimal-pad"
      onChangeText={onChange}
    />
  );
}