import AppChip from "@/components/common/AppChip";
import { View } from "react-native";

type Props = {
  value?: number;
  onChange: (value: number) => void;
};

export default function SeverityField({
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
      {Array.from({ length: 11 }, (_, i) => (
        <AppChip
          key={i}
          label={i.toString()}
          selected={value === i}
          onPress={() => onChange(i)}
        />
      ))}
    </View>
  );
}