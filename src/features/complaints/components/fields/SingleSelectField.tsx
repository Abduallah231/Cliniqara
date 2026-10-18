import AppView from "@/components/common/AppView";
import AppChip from "@/components/common/AppChip";



import { ComplaintField } from "../../models/ComplaintField";

type Props = {
  field: ComplaintField;
  value: string;
  onChange: (value: string) => void;
};

export default function SingleSelectField({
  field,
  value,
  onChange,
}: Props) {
  return (
    <>
 

      <AppView
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {field.options?.map((option) => (
          <AppChip
            key={option.code}
            label={option.label}
            selected={value === option.code}
            onPress={() => onChange(option.code)}
          />
        ))}
      </AppView>
    </>
  );
}