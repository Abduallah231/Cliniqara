import CollapsibleSection from "@/components/common/CollapsibleSection";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AISuggestionsSection from "./assessment/AISuggestionsSection";
import DiagnosisSection from "./assessment/DiagnosisSection";
import InvestigationResultsScreen from "./assessment/InvestigationResultsScreen";
import InvestigationSection from "./assessment/InvestigationSection";
import PrescriptionSection from "./assessment/PrescriptionSection";
import ProceduresReferralsSection from "./assessment/ProceduresReferrals";

interface Props {
  visitId?: string;
}
export default function AssessmentTab({
  visitId,
}: Props) {

  const [
  showInvestigationResults,
  setShowInvestigationResults,
] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.aiButton}
      >
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={COLORS.white}
        />
        <Text
          style={styles.aiButtonText}
        >
          Generate AI Suggestions
        </Text>
      </Pressable>

      <View style={styles.aiCard}>
        <View
          style={styles.aiHeader}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.aiTitle}>
            AI Clinical Decision
            Support
          </Text>
        </View>

        <Text style={styles.aiText}>
          AI-generated diagnoses,
          investigations, and
          treatment suggestions are
          provided solely as
          clinical decision
          support. They may be
          incomplete or inaccurate
          and must not be relied
          upon as a substitute for
          professional medical
          judgment. The treating
          physician is solely
          responsible for all
          clinical decisions and
          patient care.
        </Text>
      </View>

      <CollapsibleSection
        title="AI Suggestions"
        icon={
          <Ionicons
            name="sparkles-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <AISuggestionsSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Diagnosis"
        icon={
          <Ionicons
            name="pulse-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded
      >
        <DiagnosisSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Investigations"
        icon={
          <Ionicons
            name="flask-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <InvestigationSection
          onOpenResults={() =>
            setShowInvestigationResults(
              !showInvestigationResults
            )
          }
        />

        {showInvestigationResults && (
          <InvestigationResultsScreen visitId={visitId} />
        )}
      </CollapsibleSection>

            <CollapsibleSection
        title="Procedures & Referrals"
        icon={
          <Ionicons
            name="construct-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <ProceduresReferralsSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Prescription"
        icon={
          <Ionicons
            name="document-text-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <PrescriptionSection />
      </CollapsibleSection>

      <View style={{ height: 50 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.md,   
  },

  patientBanner: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    ...SHADOW,
  },

  patientName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientInfo: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  assessmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
  },

  assessmentText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    marginHorizontal: SPACING.xs,
  },

  aiButton: {
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  aiButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  aiCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOW,
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  aiTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  aiText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
  },
});