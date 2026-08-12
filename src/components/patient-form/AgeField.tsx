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

  ageUnit:
    | "Years"
    | "Months"
    | "Days";

  setAgeUnit: (
    value:
      | "Years"
      | "Months"
      | "Days",
  ) => void;

  disabled?: boolean;
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
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Age Value */}
      <View
        pointerEvents={
          disabled ? "none" : "auto"
        }
        style={
          disabled
            ? styles.disabledField
            : undefined
        }
      >
        <AppTextField
          placeholder="Enter age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      {/* Age Unit */}
      <View
        style={[
          styles.row,
          disabled &&
            styles.disabledUnits,
        ]}
        pointerEvents={
          disabled ? "none" : "auto"
        }
      >
        {AGE_UNITS.map((unit) => (
          <AppChip
            key={unit}
            label={unit}
            selected={
              ageUnit === unit
            }
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
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  disabledField: {
    opacity: 0.65,
  },

  disabledUnits: {
    opacity: 0.65,
  },
});