import AppTextField from "@/components/common/AppTextField";
import { ComplaintField } from "../../models/ComplaintField";

type Props = {
  field: ComplaintField;
  value: string;
  onChange: (value: string) => void;
};

export default function TextField({
  field,
  value,
  onChange,
}: Props) {
  return (
    <AppTextField
      label={field.label}
      value={value ?? ""}
      placeholder={field.placeholder}
      onChangeText={onChange}
    />
  );
}