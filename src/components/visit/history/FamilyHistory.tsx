import { useState } from "react";
import { StyleSheet, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function FamilyHistory() {
  const [selectedDiseases, setSelectedDiseases] =
    useState<string[]>([]);

  const [otherDisease, setOtherDisease] =
    useState("");

  const [affectedMember, setAffectedMember] =
    useState("");

  const diseases = [
    "Diabetes",
    "Hypertension",
    "IHD",
    "Stroke",
    "Cancer",
    "Asthma",
    "Thyroid Disease",
    "CKD",
  ];

  const toggleDisease = (disease: string) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases(
        selectedDiseases.filter(
          (d) => d !== disease
        )
      );
    } else {
      setSelectedDiseases([
        ...selectedDiseases,
        disease,
      ]);
    }
  };

  return (
    <View style={styles.container}>
<SectionHeader title="Family Diseases" />
      <View style={styles.row}>
        {diseases.map((disease) => (
          <AppChip
            key={disease}
            label={disease}
            selected={selectedDiseases.includes(
              disease
            )}
            onPress={() =>
              toggleDisease(disease)
            }
          />
        ))}
      </View>

      <AppTextField

        placeholder="Other family disease..."
        value={otherDisease}
        onChangeText={setOtherDisease}
      />

      <AppTextField

        placeholder="Affected family member"
        value={affectedMember}
        onChangeText={setAffectedMember}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
});