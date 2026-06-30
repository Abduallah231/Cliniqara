import { StyleSheet, Text, View } from "react-native";

import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import SectionHeader from "@/components/common/SectionHeader";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

export default function ClinicalSnapshot() {
  const chronicDiseases = [
    "Diabetes",
    "Hypertension",
    "CKD",
  ];

  const medications = [
    "Metformin",
    "Amlodipine",
    "Aspirin",
  ];

  const allergies = [
    "Penicillin",
  ];

  return (
    <View style={styles.container}>
      <SectionHeader title="Clinical Snapshot" />

      <AppCard>
        <View style={styles.section}>
          <Text style={styles.label}>
            Chronic Diseases
          </Text>

          <View style={styles.chips}>
            {chronicDiseases.map((item) => (
              <AppChip
                key={item}
                label={item}
                selected
              />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>
            Current Medications
          </Text>

          <View style={styles.chips}>
            {medications.map((item) => (
              <AppChip
                key={item}
                label={item}
              />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>
            Allergies
          </Text>

          <View style={styles.chips}>
            {allergies.map((item) => (
              <AppChip
                key={item}
                label={item}
              />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.vitals}>
          <View style={styles.item}>
            <Text style={styles.value}>
              150/90
            </Text>

            <Text style={styles.caption}>
              Last BP
            </Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.value}>
              82
            </Text>

            <Text style={styles.caption}>
              Pulse
            </Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.value}>
              28.4
            </Text>

            <Text style={styles.caption}>
              BMI
            </Text>
          </View>
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  section: {
    gap: SPACING.sm,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.secondaryText,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },

  vitals: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },

  value: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.primary,
  },

  caption: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
});