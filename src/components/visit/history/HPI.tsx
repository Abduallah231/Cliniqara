import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import CollapsibleSection from "@/components/common/CollapsibleSection";

import AbdominalPain from "./complaints/AbdominalPain";
import AnalysisOfComplaint from "./hpi/AnalysisOfComplaint";
import RelatedSystemSymptoms from "./hpi/RelatedSystemSymptoms";
import SystematicReview from "./hpi/SystematicReview";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  chiefComplaint: string;
};

export default function HPI({
  chiefComplaint,
}: Props) {
  return (
    <View style={styles.container}>
  <View style={styles.header}>
    <Ionicons
      name="document-text-outline"
      size={20}
      color={COLORS.primary}
    />

    <Text style={styles.title}>
      History of Present Illness
    </Text>
  </View>

  <View style={styles.content}>
    <CollapsibleSection
      title="Analysis of Complaint"
      icon={
        <Ionicons
          name="analytics-outline"
          size={20}
          color={COLORS.primary}
        />
      }
    >
      {chiefComplaint === "Abdominal Pain" ? (
        <AbdominalPain />
      ) : (
        <AnalysisOfComplaint
          chiefComplaint={chiefComplaint}
        />
      )}
    </CollapsibleSection>

    <CollapsibleSection
      title="Related System Symptoms"
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

    <CollapsibleSection
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
    </CollapsibleSection>
  </View>
</View>
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