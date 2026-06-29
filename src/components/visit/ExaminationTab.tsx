import { ScrollView, StyleSheet } from "react-native";

import {
  SPACING,
} from "@/theme";

import GeneralInspectionSection from "./examination/sections/GeneralInspectionSection";
import RegionalExaminationSection from "./examination/sections/RegionalExaminationSection";
import SystemExaminationSection from "./examination/sections/SystemExaminationSection";
import VitalSignsSection from "./examination/sections/VitalSignsSection";

export default function ExaminationTab() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <VitalSignsSection />
      <GeneralInspectionSection />
      <RegionalExaminationSection />
      <SystemExaminationSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 140,
    gap: SPACING.md,
  },
});