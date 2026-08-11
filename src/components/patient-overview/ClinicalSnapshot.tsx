import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import SectionHeader from "@/components/common/SectionHeader";

import type { Patient } from "@/types/patient";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  patient: Patient;
};

export default function ClinicalSnapshot({
  patient,
}: Props) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Clinical Snapshot" />

      <AppCard>
        <Text style={styles.emptyText}>
          Clinical history will appear here.
        </Text>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
    textAlign: "center",
    paddingVertical: SPACING.md,
  },
});