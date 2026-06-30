import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import { useState } from "react";
import { ScrollView } from "react-native";

import CollapsibleSection from "@/components/common/CollapsibleSection";

import AllergyHistory from "./history/AllergyHistory";
import ChiefComplaint from "./history/ChiefComplaint";
import DrugHistory from "./history/DrugHistory";
import FamilyHistory from "./history/FamilyHistory";
import HPI from "./history/HPI";
import PastHistory from "./history/PastHistory";
import PersonalHistory from "./history/PersonalHistory";

import { COLORS, SPACING, TYPOGRAPHY, } from "@/theme";

export default function HistoryTab() {
  const [chiefComplaint, setChiefComplaint] = useState("");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
  paddingBottom: 70,
  paddingTop: SPACING.xs,
}}
    >
              <AppCard style={styles.patientCard}>
                <Text style={styles.patientName}>
                  Mohamed Ahmed
                </Text>
      
                <Text style={styles.patientInfo}>
                  32 Years • Male
                </Text>
              </AppCard>
      
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={COLORS.primary}
                />
      
                <Text style={styles.sectionTitle}>
                  Medical History
                </Text>
              </View>
      
      <CollapsibleSection
        title="Personal History"
        icon={
          <Ionicons
            name="person-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded
      >
        <PersonalHistory />
      </CollapsibleSection>

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
    </ScrollView>
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