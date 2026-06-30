import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  SPACING,
} from "@/theme";

type Props = {
  age: string;
  setAge: (value: string) => void;
  ageUnit: string;
  setAgeUnit: (
    value: "Years" | "Months" | "Days"
  ) => void;
};

const AGE_UNITS = [
  "Years",
  "Months",
  "Days",
] as const;

export default function AgeField({
  age,
  setAge,
  ageUnit,
  setAgeUnit,
}: Props) {
  return (
    <View style={styles.container}>
      <AppTextField

        placeholder="Enter age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        {AGE_UNITS.map((unit) => (
          <AppChip
            key={unit}
            label={unit}
            selected={ageUnit === unit}
            onPress={() =>
              setAgeUnit(unit)
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
    marginBottom: 16
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
});