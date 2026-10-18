import AppView from "@/components/common/AppView";
import AppChip from "@/components/common/AppChip";



import { ComplaintField } from "../../models/ComplaintField";

type Props = {
  field: ComplaintField;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function MultiSelectField({
  field,
  value = [],
  onChange,
}: Props) {
  const toggle = (code: string) => {
    if (value.includes(code)) {
      onChange(value.filter((x) => x !== code));
    } else {
      onChange([...value, code]);
    }
  };

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
            selected={value.includes(option.code)}
            onPress={() => toggle(option.code)}
          />
        ))}
      </AppView>
    </>
  );
}