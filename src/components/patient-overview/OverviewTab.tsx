import { ScrollView, StyleSheet } from "react-native";

import ClinicalAlerts from "./ClinicalAlerts";
import ClinicalSnapshot from "./ClinicalSnapshot";
import LatestVisitCard from "./LatestVisitCard";

import { SPACING } from "@/theme";

import PatientQuickActions from "@/components/patients/PatientQuickActions";

export default function OverviewTab() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <ClinicalAlerts />

      <ClinicalSnapshot />

      <LatestVisitCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: 120,
    gap: SPACING.md,
  },
});