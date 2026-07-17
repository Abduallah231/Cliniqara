import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  View
} from "react-native";

import CollapsibleSection from "@/components/common/CollapsibleSection";

import { SelectionOption } from "@/models/selection";
import { COLORS, SPACING, TYPOGRAPHY, } from "@/theme";
import AllergyHistory from "./history/AllergyHistory";
import ChiefComplaint from "./history/ChiefComplaint";
import DrugHistory from "./history/DrugHistory";
import FamilyHistory from "./history/FamilyHistory";
import HPI from "./history/HPI";
import PastHistory from "./history/PastHistory";
import SocialHistory from "./history/SocialHistory";
import VisitHeaderCard from "./VisitHeaderCard";

export default function HistoryTab() {
const [chiefComplaint, setChiefComplaint] =
  useState<SelectionOption | undefined>();

  return (
    <AppKeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
        paddingTop: SPACING.xs,
      }}
    >
              <VisitHeaderCard
  sectionTitle="Medical History"
  icon="document-text-outline"
/>

      <CollapsibleSection
        title="Chief Complaint"
        icon={
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded
      >
        <ChiefComplaint
          complaint={chiefComplaint}
          setComplaint={setChiefComplaint}
        />
      </CollapsibleSection>

      <HPI chiefComplaint={chiefComplaint} />

      <CollapsibleSection
        title="Past History"
        icon={
          <Ionicons
            name="time-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <PastHistory />
      </CollapsibleSection>

      <CollapsibleSection
        title="Social History"
        icon={
          <Ionicons
            name="people-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        
      >
        <SocialHistory />
      </CollapsibleSection>

      <CollapsibleSection
        title="Drug History"
        icon={
          <Ionicons
            name="medical-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <DrugHistory />
      </CollapsibleSection>

      <CollapsibleSection
        title="Allergy History"
        icon={
          <Ionicons
            name="warning-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <AllergyHistory />
      </CollapsibleSection>

      <CollapsibleSection
        title="Family History"
        icon={
          <Ionicons
            name="people-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <FamilyHistory />
      </CollapsibleSection>
      <View style={{ height: 50 }} />
    </AppKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  sectionTitle: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientName: {
  fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientInfo: {
    marginTop: SPACING.xs,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
  },

  patientCard: {
  paddingVertical: SPACING.md,
},
});