import { useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import AppChip from "@/components/common/AppChip";

import {
  SPACING
} from "@/theme";

import CVSSystem from "../related-systems/CVSSystem";
import ChestSystem from "../related-systems/ChestSystem";
import ENTSystem from "../related-systems/ENTSystem";
import EndocrineSystem from "../related-systems/EndocrineSystem";
import GITSystem from "../related-systems/GITSystem";
import GeneralSystem from "../related-systems/GeneralSystem";
import GynecologySystem from "../related-systems/GynecologySystem";
import HematologySystem from "../related-systems/HematologySystem";
import MusculoskeletalSystem from "../related-systems/MusculoskeletalSystem";
import NeuroSystem from "../related-systems/NeuroSystem";
import ObstetricSystem from "../related-systems/ObstetricSystem";
import OphthalmologySystem from "../related-systems/OphthalmologySystem";
import RenalSystem from "../related-systems/RenalSystem";
import SkinSystem from "../related-systems/SkinSystem";

export default function RelatedSystemSymptoms() {
  const [selectedSystem, setSelectedSystem] =
  useState<SystemType>("General");

  const systems = [
  "General",
  "CVS",
  "Chest",
  "GIT",
  "Renal",
  "Neuro",
  "Musculoskeletal",
  "Endocrine",
  "Hematology",
  "Skin",
  "Gynecology",
  "Obstetric",
  "ENT",
  "Ophthalmology",
] as const;

type SystemType = (typeof systems)[number];

  const SYSTEM_COMPONENTS = {
  General: GeneralSystem,
  CVS: CVSSystem,
  Chest: ChestSystem,
  GIT: GITSystem,
  Renal: RenalSystem,
  Neuro: NeuroSystem,
  Musculoskeletal: MusculoskeletalSystem,
  Endocrine: EndocrineSystem,
  Hematology: HematologySystem,
  Skin: SkinSystem,
  Gynecology: GynecologySystem,
  Obstetric: ObstetricSystem,
  ENT: ENTSystem,
  Ophthalmology: OphthalmologySystem,
};

const SelectedSystem =
  SYSTEM_COMPONENTS[selectedSystem];

  return (
    <View style={styles.container}>
      <View style={styles.systemContainer}>
        {systems.map((system) => (
          <AppChip
            key={system}
            label={system}
            selected={
              selectedSystem === system
            }
            onPress={() =>
              setSelectedSystem(system)
            }
          />
        ))}
      </View>

      <View style={styles.content}>
        <SelectedSystem />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  systemContainer: {
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

  content: {
    marginTop: SPACING.sm,
  },
});