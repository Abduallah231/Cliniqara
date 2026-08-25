import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import AppChip from "@/components/common/AppChip";
import { SPACING } from "@/theme";
import { useVisitStore } from "@/store/visitStore";
import {
  saveRelatedSystems,
  type RelatedSystemType,
} from "@/services/visitApi";

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

const systems: {
  key: RelatedSystemType;
  label: string;
}[] = [
  { key: "GENERAL", label: "General" },
  { key: "CVS", label: "CVS" },
  { key: "CHEST", label: "Chest" },
  { key: "GIT", label: "GIT" },
  { key: "RENAL", label: "Renal" },
  { key: "NEURO", label: "Neuro" },
  {
    key: "MUSCULOSKELETAL",
    label: "Musculoskeletal",
  },
  { key: "ENDOCRINE", label: "Endocrine" },
  { key: "HEMATOLOGY", label: "Hematology" },
  { key: "SKIN", label: "Skin" },
  { key: "GYNECOLOGY", label: "Gynecology" },
  { key: "OBSTETRIC", label: "Obstetric" },
  { key: "ENT", label: "ENT" },
  {
    key: "OPHTHALMOLOGY",
    label: "Ophthalmology",
  },
];

const SYSTEM_COMPONENTS: Record<
  RelatedSystemType,
  React.ComponentType
> = {
  GENERAL: GeneralSystem,
  CVS: CVSSystem,
  CHEST: ChestSystem,
  GIT: GITSystem,
  RENAL: RenalSystem,
  NEURO: NeuroSystem,
  MUSCULOSKELETAL: MusculoskeletalSystem,
  ENDOCRINE: EndocrineSystem,
  HEMATOLOGY: HematologySystem,
  SKIN: SkinSystem,
  GYNECOLOGY: GynecologySystem,
  OBSTETRIC: ObstetricSystem,
  ENT: ENTSystem,
  OPHTHALMOLOGY: OphthalmologySystem,
};

export default function RelatedSystemSymptoms() {
  const [selectedSystem, setSelectedSystem] =
    useState<RelatedSystemType>("GENERAL");

  const { visit } = useVisitStore();

  const systemsData =
    visit.history.hpi.relatedSystemSymptoms.systems;

  const visitId = visit.metadata.id;

  const skipNextSave = useRef(true);

  useEffect(() => {
    if (!visitId) {
      return;
    }

    // Don't save immediately after loading the visit.
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveRelatedSystems(visitId, {
        systems: systemsData,
      }).catch((error) => {
        console.error(
          "RELATED SYSTEMS AUTOSAVE FAILED:",
          error,
        );
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    JSON.stringify(systemsData),
  ]);

  const SelectedSystem =
    SYSTEM_COMPONENTS[selectedSystem];

  return (
    <View style={styles.container}>
      <View style={styles.systemContainer}>
        {systems.map((system) => (
          <AppChip
            key={system.key}
            label={system.label}
            selected={
              selectedSystem === system.key
            }
            onPress={() =>
              setSelectedSystem(system.key)
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