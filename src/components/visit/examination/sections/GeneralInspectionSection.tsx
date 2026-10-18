import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import AppChip from "@/components/common/AppChip";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS, SPACING, TYPOGRAPHY, } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getGeneralInspection,
} from "@/services/visitApi";

import useGeneralInspectionAutoSave, {
  mapGeneralInspectionFromBackend,
} from "@/hooks/useGeneralInspectionAutoSave";

export default function GeneralInspectionSection() {
  const generalInspection =
    useVisitStore(
      (state) =>
        state.visit.examination
          .generalInspection
    );

  const updateGeneralInspection =
    useVisitStore(
      (state) =>
        state.updateGeneralInspection
    );

  const toggleGeneralFinding =
    useVisitStore(
      (state) =>
        state.toggleGeneralFinding
    );

  const toggleEdemaLocation =
    useVisitStore(
      (state) =>
        state.toggleEdemaLocation
    );

  const visitId = useVisitStore(
    (state) => state.visit.metadata.id,
  );

  const [isHydrating, setIsHydrating] =
    useState(false);

  const loadedVisitId = useRef<string | null>(
    null,
  );

  useGeneralInspectionAutoSave({
    visitId,
    generalInspection,
    isHydrating,
  });

  useEffect(() => {
    if (
      !visitId ||
      loadedVisitId.current === visitId
    ) {
      return;
    }

    const loadGeneralInspection =
      async () => {
        try {
          setIsHydrating(true);

          const data =
            await getGeneralInspection(
              visitId,
            );

          if (!data) {
            loadedVisitId.current =
              visitId;
            return;
          }

          const values =
            mapGeneralInspectionFromBackend(
              data as Record<string, unknown>,
            );

          updateGeneralInspection(values);

          loadedVisitId.current =
            visitId;
        } catch (error) {
          console.error(
            "Failed to load general inspection:",
            error,
          );
        } finally {
          setIsHydrating(false);
        }
      };

    loadGeneralInspection();
  }, [
    visitId,
    updateGeneralInspection,
  ]);

  return (
    <AppView style={styles.container}>
      <CollapsibleSection
        title="General Inspection"
        icon={
          <Ionicons
            name="eye-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded={false}
      >
        <SectionHeader title="Consciousness" />

        <AppView style={styles.row}>
          <AppChip
            label="Conscious"
            selected={
              generalInspection.consciousness ===
                "Conscious"
            }
            onPress={() =>
              updateGeneralInspection({
                consciousness:
                  "Conscious",
              })
            }
          />

          <AppChip
            label="Drowsy"
            selected={
              generalInspection.consciousness ===
              "Drowsy"
            }
            onPress={() =>
              updateGeneralInspection({
                consciousness:
                  "Drowsy",
              })
            }
          />

          <AppChip
            label="Confused"
            selected={
              generalInspection.consciousness ===
              "Confused"
            }
            onPress={() =>
              updateGeneralInspection({
                consciousness:
                  "Confused",
              })
            }
          />

          <AppChip
            label="Comatose"
            selected={
              generalInspection.consciousness ===
              "Comatose"
            }
            onPress={() =>
              updateGeneralInspection({
                consciousness:
                  "Comatose",
              })
            }
          />
        </AppView>

        <Divider />

        <SectionHeader title="Appearance" />

        <AppView style={styles.row}>
          <AppChip
            label="Normal"
            selected={
              generalInspection.appearance ===
                "Normal"
            }
            onPress={() =>
              updateGeneralInspection({
                appearance:
                  "Normal",
              })
            }
          />

          <AppChip
            label="Ill"
            selected={
              generalInspection.appearance ===
              "Ill"
            }
            onPress={() =>
              updateGeneralInspection({
                appearance: "Ill",
              })
            }
          />

          <AppChip
            label="Toxic"
            selected={
              generalInspection.appearance ===
              "Toxic"
            }
            onPress={() =>
              updateGeneralInspection({
                appearance:
                  "Toxic",
              })
            }
          />

          <AppChip
            label="Distressed"
            selected={
              generalInspection.appearance ===
              "Distressed"
            }
            onPress={() =>
              updateGeneralInspection({
                appearance:
                  "Distressed",
              })
            }
          />
        </AppView>

        <Divider />

                <SectionHeader title="Hydration" />

        <AppView style={styles.row}>
          <AppChip
            label="Normal"
            selected={
              generalInspection.hydration ===
                "Normal"
            }
            onPress={() =>
              updateGeneralInspection({
                hydration: "Normal",
              })
            }
          />

          <AppChip
            label="Mild"
            selected={
              generalInspection.hydration ===
              "Mild"
            }
            onPress={() =>
              updateGeneralInspection({
                hydration: "Mild",
              })
            }
          />

          <AppChip
            label="Moderate"
            selected={
              generalInspection.hydration ===
              "Moderate"
            }
            onPress={() =>
              updateGeneralInspection({
                hydration:
                  "Moderate",
              })
            }
          />

          <AppChip
            label="Severe"
            selected={
              generalInspection.hydration ===
              "Severe"
            }
            onPress={() =>
              updateGeneralInspection({
                hydration: "Severe",
              })
            }
          />
        </AppView>

        <Divider />

        <SectionHeader title="Body Build" />

        <AppView style={styles.row}>
          <AppChip
            label="Average"
            selected={
              generalInspection.bodyBuild ===
                "Average"
            }
            onPress={() =>
              updateGeneralInspection({
                bodyBuild: "Average",
              })
            }
          />

          <AppChip
            label="Thin"
            selected={
              generalInspection.bodyBuild ===
              "Thin"
            }
            onPress={() =>
              updateGeneralInspection({
                bodyBuild: "Thin",
              })
            }
          />

          <AppChip
            label="Obese"
            selected={
              generalInspection.bodyBuild ===
              "Obese"
            }
            onPress={() =>
              updateGeneralInspection({
                bodyBuild: "Obese",
              })
            }
          />

          <AppChip
            label="Athletic"
            selected={
              generalInspection.bodyBuild ===
              "Athletic"
            }
            onPress={() =>
              updateGeneralInspection({
                bodyBuild:
                  "Athletic",
              })
            }
          />
        </AppView>

        <Divider />

        <SectionHeader title="Nourishment" />

        <AppView style={styles.row}>
          <AppChip
            label="Well Nourished"
            selected={
              generalInspection.nourishment ===
                "Well Nourished"
            }
            onPress={() =>
              updateGeneralInspection({
                nourishment:
                  "Well Nourished",
              })
            }
          />

          <AppChip
            label="Malnourished"
            selected={
              generalInspection.nourishment ===
              "Malnourished"
            }
            onPress={() =>
              updateGeneralInspection({
                nourishment:
                  "Malnourished",
              })
            }
          />
        </AppView>

        <Divider />

        <SectionHeader title="Findings" />

        <AppView style={styles.row}>
          {[
            "Pallor",
            "Jaundice",
            "Cyanosis",
            "Clubbing",
            "Lymphadenopathy",
            "Edema",
          ].map((item) => (
            <AppChip
              key={item}
              label={item}
              selected={generalInspection.findings.includes(
                item
              )}
              onPress={() =>
                toggleGeneralFinding(
                  item
                )
              }
            />
          ))}
        </AppView>

        {generalInspection.findings.includes(
          "Edema"
        ) && (
          <AppView style={styles.box}>
            <AppText
              style={styles.sectionTitle}
            >
              Edema Location
            </AppText>

            <AppView style={styles.row}>
              {[
                "Periorbital",
                "Upper Limb",
                "Lower Limb",
                "Sacral",
                "Generalized",
              ].map((item) => (
                <AppChip
                  key={item}
                  label={item}
                  selected={generalInspection.edemaLocations.includes(
                    item
                  )}
                  onPress={() =>
                    toggleEdemaLocation(
                      item
                    )
                  }
                />
              ))}
            </AppView>
          </AppView>
        )}
      </CollapsibleSection>
    </AppView>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    
  },

  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  box: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
});