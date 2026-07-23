import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import CollapsibleSection from "@/components/common/CollapsibleSection";

import { COLORS, SPACING } from "@/theme";

import { useVisitStore } from "@/store/visitStore";
import {
  isPediatric,
  shouldShowMenstrualHistory,
} from "@/utils/patient";

import VisitHeaderCard from "./VisitHeaderCard";

import ChiefComplaint from "./history/ChiefComplaint";
import HPI from "./history/HPI";
import PastHistory from "./history/PastHistory";
import PediatricHistory from "./history/PediatricHistory";
import VaccinationHistory from "./history/VaccinationHistory";
import MenstrualHistory from "./history/MenstrualHistory";
import SocialHistory from "./history/SocialHistory";
import DrugHistory from "./history/DrugHistory";
import AllergyHistory from "./history/AllergyHistory";
import FamilyHistory from "./history/FamilyHistory";

export default function HistoryTab() {
  const patient = useVisitStore(
    (state) => state.visit.patient
  );

  const pediatric = isPediatric(
    patient.age,
    patient.ageUnit
  );

  const showMenstrual =
    shouldShowMenstrualHistory(
      patient.gender,
      patient.age,
      patient.ageUnit
    );

  return (
    <AppKeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: SPACING.xs,
        paddingBottom: 120,
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