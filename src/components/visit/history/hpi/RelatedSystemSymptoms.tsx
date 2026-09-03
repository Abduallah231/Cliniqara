import AppChip from "@/components/common/AppChip";
import {
  getRelatedSystems,
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

  const { visit, setRelatedSystems } =
    useVisitStore();

  const systemsData =
    visit.history.hpi.relatedSystemSymptoms.systems;

  const visitId = visit.metadata.id;

  /**
   * Prevent loading the same visit more than once
   * while this component instance is mounted.
   */
  const loadedVisitId = useRef<string | null>(
    null,
  );

  /**
   * Indicates that we are currently hydrating
   * the Zustand store from the backend.
   *
   * Changes caused by hydration must NOT trigger
   * autosave.
   */
  const isHydrating = useRef(false);

  /**
   * Used to skip the very first render.
   */
  const isFirstRender = useRef(true);

  /**
   * Signature of the state that came from backend.
   *
   * This prevents saving the exact same hydrated
   * state back to the backend.
   */
  const hydratedSignature = useRef<
    string | null
  >(null);

  /**
   * Always keep the latest state available
   * to the debounced save.
   */
  const latestSystemsRef =
    useRef<RelatedSystemItem[]>(
      systemsData,
    );

  useEffect(() => {
    latestSystemsRef.current =
      systemsData;
  }, [systemsData]);

  // ======================================================
  // Load Related Systems
  // ======================================================

  useEffect(() => {
    if (!visitId) {
      return;
    }

    if (loadedVisitId.current === visitId) {
      return;
    }

    let cancelled = false;

    const loadRelatedSystems =
      async () => {
        try {
          isHydrating.current = true;

          const data =
            await getRelatedSystems(
              visitId,
            );

          if (cancelled) {
            return;
          }

          const normalizedSystems =
            Array.isArray(data)
              ? data
              : [];

          /**
           * Replace the complete related-systems
           * state instead of adding individual items.
           *
           * This makes hydration idempotent and prevents
           * duplicate systems/symptoms when the section
           * is opened more than once.
           */
          setRelatedSystems(
            normalizedSystems,
          );

          latestSystemsRef.current =
            normalizedSystems;

          hydratedSignature.current =
            JSON.stringify(
              normalizedSystems,
            );

          loadedVisitId.current =
            visitId;
        } catch (error) {
          console.error(
            "RELATED SYSTEMS LOAD FAILED:",
            error,
          );
        } finally {
          if (!cancelled) {
            isHydrating.current =
              false;
          }
        }
      };

    loadRelatedSystems();

    return () => {
      cancelled = true;
    };
  }, [
    visitId,
    setRelatedSystems,
  ]);

  // ======================================================
  // Related Systems Autosave
  // ======================================================

  useEffect(() => {
    if (!visitId) {
      return;
    }

    const signature =
      JSON.stringify(
        systemsData,
      );

    /**
     * Don't save the initial Zustand state.
     */
    if (isFirstRender.current) {
      isFirstRender.current =
        false;

      return;
    }

    /**
     * Don't save while backend data is being
     * written into Zustand.
     */
    if (isHydrating.current) {
      hydratedSignature.current =
        signature;

      return;
    }

    /**
     * If the current state is exactly the same
     * state that came from backend, there is
     * nothing to save.
     */
    if (
      hydratedSignature.current ===
      signature
    ) {
      hydratedSignature.current =
        null;

      return;
    }

    /**
     * Same debounce approach used by the
     * other History autosave implementations.
     */
    const timer = setTimeout(() => {
      const latestSystems =
        latestSystemsRef.current;

// console.log(
//   "RELATED SYSTEMS SAVE PAYLOAD:",
//   {
//     visitId,
//     systems: latestSystems,
//   },
// );

      saveRelatedSystems(
        visitId,
        {
          systems:
            latestSystems,
        },
      ).catch((error) => {
        console.error(
          "RELATED SYSTEMS AUTOSAVE FAILED:",
          error?.response?.data ?? error,
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