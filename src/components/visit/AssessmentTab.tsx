import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CollapsibleSection from "@/components/common/CollapsibleSection";

import DiagnosisSection from "./assessment/DiagnosisSection";
import ExaminationSummary from "./assessment/ExaminationSummary";
import HistorySummary from "./assessment/HistorySummary";
import InvestigationResultsScreen from "./assessment/InvestigationResultsScreen";
import InvestigationSection from "./assessment/InvestigationSection";
import PrescriptionSection from "./assessment/PrescriptionSection";
import ProceduresReferralsSection from "./assessment/ProceduresReferrals";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function AssessmentTab() {
  const [
    showInvestigationResults,
    setShowInvestigationResults,
  ] = useState(false);

  const [
    selectedInvestigations,
    setSelectedInvestigations,
  ] = useState<any[]>([]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.patientBanner}>
        <Text style={styles.patientName}>
          Mohamed Ahmed
        </Text>

        <Text style={styles.patientInfo}>
          32 Years • Male
        </Text>
</View>

        <View style={styles.assessmentRow}>
          <Ionicons
            name="clipboard-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.assessmentText}>
            Assessment
          </Text>
        </View>
      <HistorySummary />

      <ExaminationSummary />

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
              AI-generated diagnoses, investigations, and treatment
    suggestions are provided solely as clinical decision support.
    They may be incomplete or inaccurate and must not be relied
    upon as a substitute for professional medical judgment.
    The treating physician is solely responsible for all clinical
    decisions and patient care.
        </Text>
      </View>

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
          selectedInvestigations={
            selectedInvestigations
          }
          setSelectedInvestigations={
            setSelectedInvestigations
          }
          onOpenResults={() =>
            setShowInvestigationResults(
              !showInvestigationResults
            )
          }
        />

        {showInvestigationResults && (
          <InvestigationResultsScreen
            investigations={
              selectedInvestigations
            }
          />
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
          </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: 70,
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