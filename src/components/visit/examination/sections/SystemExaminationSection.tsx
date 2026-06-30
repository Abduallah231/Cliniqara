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
export default function SystemExaminationSection() {
  const [selectedSystem, setSelectedSystem] =
    useState("CVS");

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
          {[
            "CVS",
            "Chest",
            "Abdomen",
            "Neurology",
            "Musculoskeletal",
            "Endocrine",
            "Skin",
            "Gynecology",
            "Obstetric",
            "ENT",
            "Ophthalmology",
          ].map((system) => (
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

        <View
          style={{
            height: SPACING.md,
          }}
        />

        {selectedSystem === "CVS" && (
          <CVSExam />
        )}

        {selectedSystem === "Chest" && (
          <ChestExam />
        )}

        {selectedSystem ===
          "Abdomen" && (
          <AbdomenExam />
        )}

        {selectedSystem ===
          "Neurology" && (
          <NeurologyExam />
        )}

        {selectedSystem ===
          "Musculoskeletal" && (
          <MusculoskeletalExam />
        )}

        {selectedSystem ===
          "Endocrine" && (
          <EndocrineExam />
        )}

        {selectedSystem === "Skin" && (
          <SkinExam />
        )}

        {selectedSystem ===
          "Gynecology" && (
          <GynecologyExam />
        )}

        {selectedSystem ===
          "Obstetric" && (
          <ObstetricExam />
        )}

        {selectedSystem === "ENT" && (
          <ENTExam />
        )}

        {selectedSystem ===
          "Ophthalmology" && (
          <OphthalmologyExam />
        )}
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