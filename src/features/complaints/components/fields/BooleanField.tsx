import AppChip from "@/components/common/AppChip";
import { View } from "react-native";
import { ComplaintField } from "../../models/ComplaintField";

type Props = {
  field: ComplaintField;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
};

export default function BooleanField({
  value,
  onChange,
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <AppChip
        label="Yes"
        selected={value === true}
        onPress={() => onChange(true)}
        style={{ flex: 0 }}
      />

      <AppChip
        label="No"
        selected={value === false}
        onPress={() => onChange(false)}
        style={{ flex: 0 }}
      />
    </View>
  );
}