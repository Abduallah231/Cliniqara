import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function GeneralSystem() {
  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [otherFinding, setOtherFinding] =
    useState("");

  const symptoms = [
    "Fever",
    "Chills / Rigors",
    "Weight Loss",
    "Appetite Change",
    "Malaise",
    "Fatigue",
    "Night Sweats",
  ];

  const toggleSymptom = (
    symptom: string
  ) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(
        selectedSymptoms.filter(
          (item) => item !== symptom
        )
      );
    } else {
      setSelectedSymptoms([
        ...selectedSymptoms,
        symptom,
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        General / Constitutional
      </Text>

      <View style={styles.row}>
        {symptoms.map((symptom) => (
          <AppChip
            key={symptom}
            label={symptom}
            selected={selectedSymptoms.includes(
              symptom
            )}
            onPress={() =>
              toggleSymptom(symptom)
            }
          />
        ))}
      </View>

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={setOtherFinding}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },
});