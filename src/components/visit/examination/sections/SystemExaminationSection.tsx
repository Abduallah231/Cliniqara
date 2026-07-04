import { useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import AppChip from "@/components/common/AppChip";
import CollapsibleSection from "@/components/common/CollapsibleSection";

import {
  COLORS,
  SPACING
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
  { id: "cvs", label: "CVS" },
  { id: "chest", label: "Chest" },
  { id: "abdomen", label: "Abdomen" },
  { id: "neurology", label: "Neurology" },
  {
    id: "musculoskeletal",
    label: "Musculoskeletal",
  },
  {
    id: "endocrine",
    label: "Endocrine",
  },
  { id: "skin", label: "Skin" },
  {
    id: "gynecology",
    label: "Gynecology",
  },
  {
    id: "obstetric",
    label: "Obstetric",
  },
  { id: "ent", label: "ENT" },
  {
    id: "ophthalmology",
    label: "Ophthalmology",
  },
] as const;

type SystemId =
  (typeof SYSTEMS)[number]["id"];

const SYSTEM_COMPONENTS = {
  cvs: CVSExam,
  chest: ChestExam,
  abdomen: AbdomenExam,
  neurology: NeurologyExam,
  musculoskeletal: MusculoskeletalExam,
  endocrine: EndocrineExam,
  skin: SkinExam,
  gynecology: GynecologyExam,
  obstetric: ObstetricExam,
  ent: ENTExam,
  ophthalmology: OphthalmologyExam,
} as const;

export default function SystemExaminationSection() {
  const [selectedSystem, setSelectedSystem] =
  useState<SystemId>("cvs");
  const SelectedSystem =
  SYSTEM_COMPONENTS[selectedSystem];
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
                selectedSystem === system.id
              }
              onPress={() =>
                setSelectedSystem(system.id)
              }
            />
          ))}
        </View>

        <View
          style={{
            height: SPACING.md,
          }}
        />

        {SelectedSystem && <SelectedSystem />}
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