import {
  StyleSheet,
  View,
} from "react-native";
import AppChip from "@/components/common/AppChip";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS,
  SPACING,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";

import AbdomenExam from "../systems/AbdomenExam";
import CVSExam from "../systems/CVSExam";
import ChestExam from "../systems/ChestExam";
import ENTExam from "../systems/ENTExam";
import EndocrineExam from "../systems/EndocrineExam";
import GynecologyExam from "../systems/GynecologyExam";
import MusculoskeletalExam from "../systems/MusculoskeletalExam";
import NeurologyExam from "../systems/NeurologyExam";
import ObstetricExam from "../systems/ObstetricExam";
import OphthalmologyExam from "../systems/OphthalmologyExam";
import SkinExam from "../systems/SkinExam";

const SYSTEMS = [
  { id: "abdomen", label: "Abdomen" },
  
  { id: "chest", label: "Chest" },
  { id: "cvs", label: "CVS" },
  { id: "endocrine", label: "Endocrine" },
  { id: "ent", label: "ENT" },
  { id: "gynecology", label: "Gynecology" },
  { id: "musculoskeletal", label: "Musculoskeletal" },
  { id: "neurology", label: "Neurology" },
  { id: "obstetric", label: "Obstetric" },
  { id: "ophthalmology", label: "Ophthalmology" },
  { id: "skin", label: "Skin" },
] as const;

type SystemId =
  (typeof SYSTEMS)[number]["id"];

const SYSTEM_COMPONENTS = {
  abdomen: AbdomenExam,
  chest: ChestExam,
  cvs: CVSExam,
  endocrine: EndocrineExam,
  ent: ENTExam,
  gynecology: GynecologyExam,
  musculoskeletal: MusculoskeletalExam,
  neurology: NeurologyExam,
  obstetric: ObstetricExam,  
  ophthalmology: OphthalmologyExam,
  skin: SkinExam,
} as const;

export default function SystemExaminationSection() {
  const selectedSystem =
    useVisitStore(
      (state) =>
        state.visit.examination
          .systemExamination
          .selectedSystem
    ) as SystemId;

  const updateSelectedSystem =
    useVisitStore(
      (state) =>
        state.updateSelectedSystem
    );

  const SelectedSystem =
    SYSTEM_COMPONENTS[
      selectedSystem
    ] ?? SYSTEM_COMPONENTS.cvs;

  return (
    <View style={styles.container}>
      <CollapsibleSection
        title="System Examination"
        icon={
          <Ionicons
            name="medkit-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded={false}
      >
        <View style={styles.row}>
          {SYSTEMS.map((system) => (
            <AppChip
              key={system.id}
              label={system.label}
              selected={
                selectedSystem ===
                system.id
              }
              onPress={() =>
                updateSelectedSystem(
                  system.id
                )
              }
            />
          ))}
        </View>

        <View
          style={{
            height: SPACING.md,
          }}
        />

        <SelectedSystem />
      </CollapsibleSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    paddingHorizontal:
      SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom:
      SPACING.xs,
    borderRadius: 25,
    backgroundColor: "#DCEBFF",
    borderColor: "#A8C7FF",
    borderWidth: 1,
    marginBottom:
      SPACING.sm,
  },
});