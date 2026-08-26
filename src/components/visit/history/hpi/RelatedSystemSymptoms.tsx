import AppChip from "@/components/common/AppChip";
import {
  saveRelatedSystems,
  type RelatedSystemItem,
  type RelatedSystemType,
} from "@/services/visitApi";
import { useVisitStore } from "@/store/visitStore";
import { SPACING } from "@/theme";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
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
  { key: "MUSCULOSKELETAL", label: "Musculoskeletal" },
  { key: "ENDOCRINE", label: "Endocrine" },
  { key: "HEMATOLOGY", label: "Hematology" },
  { key: "SKIN", label: "Skin" },
  { key: "GYNECOLOGY", label: "Gynecology" },
  { key: "OBSTETRIC", label: "Obstetric" },
  { key: "ENT", label: "ENT" },
  { key: "OPHTHALMOLOGY", label: "Ophthalmology" },
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

  /*
   * Prevent saving immediately after loading
   * the visit from the backend.
   */
  const skipNextSave = useRef(true);

  /*
   * Serialization state.
   *
   * Only ONE save request is allowed
   * to run at a time.
   */
  const isSavingRef = useRef(false);

  /*
   * Indicates that the data changed while
   * another save request was still running.
   */
  const pendingSaveRef = useRef(false);

  /*
   * Always keep the latest version of systems data.
   */
  const latestSystemsRef =
    useRef<RelatedSystemItem[]>(systemsData);

  /*
   * Keep the latest data available to the
   * asynchronous save function.
   */
  useEffect(() => {
    latestSystemsRef.current = systemsData;
  }, [systemsData]);

  /*
   * Serialized autosave function.
   */
  const runSave = async () => {
    if (!visitId) {
      return;
    }

    /*
     * If another save is already running,
     * don't start a second request.
     */
    if (isSavingRef.current) {
      pendingSaveRef.current = true;
      return;
    }

    isSavingRef.current = true;
    pendingSaveRef.current = false;

    /*
     * Take a snapshot of the latest data
     * before starting the request.
     */
    const snapshot = latestSystemsRef.current;

    try {
      await saveRelatedSystems(visitId, {
        systems: snapshot,
      });
    } catch (error) {
      console.error(
        "RELATED SYSTEMS AUTOSAVE FAILED:",
        error,
      );
    } finally {
      isSavingRef.current = false;

      /*
       * If the user changed anything while the
       * previous request was running, schedule
       * one more save for the latest state.
       */
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;

        setTimeout(() => {
          runSave();
        }, 750);
      }
    }
  };

  useEffect(() => {
    if (!visitId) {
      return;
    }

    /*
     * Don't save immediately after loading
     * the visit.
     */
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    /*
     * Debounce:
     * wait 750ms after the last change.
     */
    const timer = setTimeout(() => {
      runSave();
    }, 750);

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