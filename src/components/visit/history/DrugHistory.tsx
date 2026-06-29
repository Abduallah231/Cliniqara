import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function DrugHistory() {
  const [medicationName, setMedicationName] =
    useState("");

  const [dose, setDose] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [compliance, setCompliance] =
    useState("");

  const [selfMedication, setSelfMedication] =
    useState("No");

  const [selfMedicationDetails, setSelfMedicationDetails] =
    useState("");

  const [supplements, setSupplements] =
    useState("No");

  const [supplementDetails, setSupplementDetails] =
    useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Current Medication
      </Text>

      <View style={styles.card}>
        <AppTextField

          placeholder="Medication Name"
          value={medicationName}
          onChangeText={setMedicationName}
        />

        <View style={styles.inlineRow}>
          <View style={{ flex: 1 }}>
            <AppTextField

              placeholder="Dose"
              value={dose}
              onChangeText={setDose}
            />
          </View>

          <View style={{ flex: 1 }}>
            <AppTextField

              placeholder="Duration"
              value={duration}
              onChangeText={setDuration}
            />
          </View>
        </View>

        <AppButton
          title="Add Medication"
          onPress={() => {}}
        />
      </View>

      <Text style={styles.sectionTitle}>
        Compliance
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Good"
          selected={compliance === "Good"}
          onPress={() =>
            setCompliance("Good")
          }
        />

        <AppChip
          label="Poor"
          selected={compliance === "Poor"}
          onPress={() =>
            setCompliance("Poor")
          }
        />

        <AppChip
          label="Irregular"
          selected={compliance === "Irregular"}
          onPress={() =>
            setCompliance("Irregular")
          }
        />
      </View>

      <Text style={styles.sectionTitle}>
        Self Medication
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={selfMedication === "Yes"}
          onPress={() =>
            setSelfMedication("Yes")
          }
        />

        <AppChip
          label="No"
          selected={selfMedication === "No"}
          onPress={() =>
            setSelfMedication("No")
          }
        />
      </View>

      {selfMedication === "Yes" && (
        <AppTextField

          placeholder="Specify"
          value={selfMedicationDetails}
          onChangeText={
            setSelfMedicationDetails
          }
        />
      )}

      <Text style={styles.sectionTitle}>
        Herbal / Supplements
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={supplements === "Yes"}
          onPress={() =>
            setSupplements("Yes")
          }
        />

        <AppChip
          label="No"
          selected={supplements === "No"}
          onPress={() =>
            setSupplements("No")
          }
        />
      </View>

      {supplements === "Yes" && (
        <AppTextField

          placeholder="Specify"
          value={supplementDetails}
          onChangeText={
            setSupplementDetails
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  card: {
    gap: SPACING.sm,
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

  inlineRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
});