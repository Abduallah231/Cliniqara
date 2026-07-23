import { ScrollView, StyleSheet } from "react-native";

import ClinicalSnapshot from "./ClinicalSnapshot";
import LatestVisitCard from "./LatestVisitCard";

import { SPACING } from "@/theme";


export default function OverviewTab() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >


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