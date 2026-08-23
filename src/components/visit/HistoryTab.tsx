import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import CollapsibleSection from "@/components/common/CollapsibleSection";

import { usePatientStore } from "@/store/patientStore";
import { COLORS, SPACING } from "@/theme";
import {
  isPediatric,
  shouldShowMenstrualHistory,
} from "@/utils/patient";

import AllergyHistory from "./history/AllergyHistory";
import ChiefComplaint from "./history/ChiefComplaint";
import DrugHistory from "./history/DrugHistory";
import FamilyHistory from "./history/FamilyHistory";
import HPI from "./history/HPI";
import MenstrualHistory from "./history/MenstrualHistory";
import PastHistory from "./history/PastHistory";
import PediatricHistory from "./history/PediatricHistory";
import SocialHistory from "./history/SocialHistory";
import VaccinationHistory from "./history/VaccinationHistory";

export default function HistoryTab() {
  const patient = usePatientStore(
    (state) => state.currentPatient
  );

    const pediatric = isPediatric(
    patient?.estimatedAgeValue ?? null,
    patient?.estimatedAgeUnit ?? null
  );

  const showMenstrual =
    shouldShowMenstrualHistory(
      patient?.gender ?? null,
      patient?.estimatedAgeValue ?? null,
      patient?.estimatedAgeUnit ?? null
    );

  return (
    <View style={styles.container}>
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
        <ChiefComplaint />
      </CollapsibleSection>

      <HPI />

      

      {pediatric && (
        <>
          <CollapsibleSection
            title="Pediatric History"
            icon={
              <Ionicons
                name="happy-outline"
                size={20}
                color={COLORS.primary}
              />
            }
          >
            <PediatricHistory />
          </CollapsibleSection>

          <CollapsibleSection
            title="Vaccination History"
            icon={
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={COLORS.primary}
              />
            }
          >
            <VaccinationHistory />
          </CollapsibleSection>
        </>
      )}

      {showMenstrual && (
        <CollapsibleSection
          title="Menstrual History"
          icon={
            <Ionicons
              name="calendar-outline"
              size={20}
              color={COLORS.primary}
            />
          }
        >
          <MenstrualHistory />
        </CollapsibleSection>
      )}

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

      {!pediatric && (
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
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.md,
  },
});