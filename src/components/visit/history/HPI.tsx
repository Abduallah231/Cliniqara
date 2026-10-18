import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

import AnalysisOfComplaint from "./hpi/AnalysisOfComplaint";
import RelatedSystemSymptoms from "./hpi/RelatedSystemSymptoms";
import SystematicReview from "./hpi/SystematicReview";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function HPI() {
  return (
    <AppView style={styles.container}>
    <AppView style={styles.header}>
    <Ionicons
      name="document-text-outline"
      size={20}
      color={COLORS.primary}
    />

    <AppText style={styles.title}>
      History of Present Illness
    </AppText>
  </AppView>

  <AppView style={styles.content}>
    <CollapsibleSection
      title="Analysis of Complaint"
      keepMounted
      icon={
        <Ionicons
          name="analytics-outline"
          size={20}
          color={COLORS.primary}
        />
      }
    >
      <AnalysisOfComplaint/>
    </CollapsibleSection>

    <CollapsibleSection
      title="Systems Symptoms"
      icon={
        <Ionicons
          name="body-outline"
          size={20}
          color={COLORS.primary}
        />
      }
    >
      <RelatedSystemSymptoms />
    </CollapsibleSection>

    {/* <CollapsibleSection
      title="Systematic Review"
      icon={
        <Ionicons
          name="clipboard-outline"
          size={20}
          color={COLORS.primary}
        />
      }
    >
      <SystematicReview />
    </CollapsibleSection> */}
  </AppView>
</AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

content: {
  gap: SPACING.xs,

  paddingHorizontal: SPACING.sm,
  paddingTop: SPACING.sm,
  paddingBottom: SPACING.xs,

  borderRadius: 25,
  backgroundColor: "#DCEBFF",
  borderColor: "#A8C7FF",
  borderWidth: 1,

  marginBottom: SPACING.sm,
},

});
