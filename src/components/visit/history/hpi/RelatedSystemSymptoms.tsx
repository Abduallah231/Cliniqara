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
    useState("General");

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
  ];

  const renderSystem = () => {
    switch (selectedSystem) {
      case "General":
        return <GeneralSystem />;

      case "CVS":
        return <CVSSystem />;

      case "Chest":
        return <ChestSystem />;

      case "GIT":
        return <GITSystem />;

      case "Renal":
        return <RenalSystem />;

      case "Neuro":
        return <NeuroSystem />;

      case "Musculoskeletal":
        return <MusculoskeletalSystem />;

      case "Endocrine":
        return <EndocrineSystem />;

      case "Hematology":
        return <HematologySystem />;

      case "Skin":
        return <SkinSystem />;

      case "Gynecology":
        return <GynecologySystem />;

      case "Obstetric":
        return <ObstetricSystem />;

      case "ENT":
        return <ENTSystem />;

      case "Ophthalmology":
        return <OphthalmologySystem />;

      default:
        return <GeneralSystem />;
    }
  };

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
        {renderSystem()}
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