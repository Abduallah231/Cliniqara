import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import { useVisitStore } from "@/store/visitStore";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { useEffect, useRef, useState } from "react";
import { getVitalSigns } from "@/services/visitApi";
import useVitalSignsAutoSave, {
  mapVitalSignsFromBackend,
} from "@/hooks/useVitalSignsAutoSave";

export default function VitalSignsSection() {
  const vitalSigns = useVisitStore(
    (state) => state.visit.examination.vitalSigns
  );

  const updateVitalSigns = useVisitStore(
    (state) => state.updateVitalSigns
  );

  const updateBloodPressure = useVisitStore(
    (state) => state.updateBloodPressure
  );

  const visitId = useVisitStore(
    (state) => state.visit.metadata.id,
  );

  const [isHydrating, setIsHydrating] =
    useState(false);

  const loadedVisitId = useRef<string | null>(
    null,
  );

  useVitalSignsAutoSave({
    visitId,
    vitalSigns,
    isHydrating,
  });

  useEffect(() => {
    if (
      !visitId ||
      loadedVisitId.current === visitId
    ) {
      return;
    }

    const loadVitalSigns = async () => {
      try {
        setIsHydrating(true);

        const data = await getVitalSigns(
          visitId,
        );

        if (!data) {
          loadedVisitId.current = visitId;
          return;
        }

        const values =
          mapVitalSignsFromBackend(
            data as Record<string, unknown>,
          );

        updateVitalSigns(values);

        loadedVisitId.current = visitId;
      } catch (error) {
        console.error(
          "Failed to load vital signs:",
          error,
        );
      } finally {
        setIsHydrating(false);
      }
    };

    loadVitalSigns();
  }, [
    visitId,
    updateVitalSigns,
  ]);

  return (
    <AppView style={styles.container}>
      <CollapsibleSection
        title="Vital Signs"
        icon={
          <Ionicons
            name="pulse-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded
      >
        <AppText style={styles.sectionTitle}>
          Blood Pressure
        </AppText>

        <AppView style={styles.row}>
          <AppView style={styles.half}>
            <AppTextField
              value={vitalSigns.systolicBP}
              onChangeText={(value) =>
                updateBloodPressure(
                  value,
                  vitalSigns.diastolicBP
                )
              }
              keyboardType="numeric"
              placeholder="Systolic"
            />
          </AppView>

          <AppView style={styles.half}>
            <AppTextField
              value={vitalSigns.diastolicBP}
              onChangeText={(value) =>
                updateBloodPressure(
                  vitalSigns.systolicBP,
                  value
                )
              }
              keyboardType="numeric"
              placeholder="Diastolic"
            />
          </AppView>
        </AppView>

        <AppView style={styles.row}>
          <AppView style={styles.half}>
            <AppTextField
              label="Heart Rate"
              value={vitalSigns.heartRate}
              onChangeText={(value) =>
                updateVitalSigns({
                  heartRate: value,
                })
              }
              keyboardType="numeric"
              placeholder="bpm"
            />

            <AppView style={styles.chipRow}>
              <AppChip
                label="Regular"
                selected={
                  vitalSigns.pulseRhythm === "Regular"
                }
                onPress={() =>
                  updateVitalSigns({
                    pulseRhythm: "Regular",
                  })
                }
              />

              <AppChip
                label="Irregular"
                selected={
                  vitalSigns.pulseRhythm ===
                  "Irregular"
                }
                onPress={() =>
                  updateVitalSigns({
                    pulseRhythm:
                      "Irregular",
                  })
                }
              />
            </AppView>
          </AppView>

          <AppView style={styles.half}>
            <AppTextField
              label="SpO₂"
              value={vitalSigns.spo2}
              onChangeText={(value) =>
                updateVitalSigns({
                  spo2: value,
                })
              }
              keyboardType="numeric"
              placeholder="%"
            />

            <AppView style={styles.chipRow}>
              <AppChip
                label="Room Air"
                selected={
                  vitalSigns.oxygenSource === "Room Air"
                }
                onPress={() =>
                  updateVitalSigns({
                    oxygenSource:
                      "Room Air",
                  })
                }
              />

              <AppChip
                label="Oxygen"
                selected={
                  vitalSigns.oxygenSource ===
                  "Oxygen"
                }
                onPress={() =>
                  updateVitalSigns({
                    oxygenSource:
                      "Oxygen",
                  })
                }
              />
            </AppView>
          </AppView>
        </AppView>

        <AppTextField
          label="Temperature"
          value={vitalSigns.temperature}
          onChangeText={(value) =>
            updateVitalSigns({
              temperature: value,
            })
          }
          keyboardType="numeric"
          placeholder="°C"
        />

        <AppView style={styles.chipRow}>
          {[
            "Oral",
            "Axillary",
            "Tympanic",
            "Temporal",
            "Rectal",
          ].map((item) => (
            <AppChip
              key={item}
              label={item}
              selected={
                vitalSigns.temperatureRoute ===
                item
              }
              onPress={() =>
                updateVitalSigns({
                  temperatureRoute:
                    item,
                })
              }
            />
          ))}
        </AppView>

        <AppView style={styles.row}>
          <AppView style={styles.half}>
            <AppTextField
              label="Respiratory Rate"
              value={vitalSigns.respiratoryRate}
              onChangeText={(value) =>
                updateVitalSigns({
                  respiratoryRate: value,
                })
              }
              keyboardType="numeric"
              placeholder="breaths/min"
            />
          </AppView>

          <AppView style={styles.half}>
            <AppTextField
              label="Blood Glucose"
              value={vitalSigns.bloodGlucose}
              onChangeText={(value) =>
                updateVitalSigns({
                  bloodGlucose: value,
                })
              }
              keyboardType="numeric"
              placeholder="mg/dL"
            />
          </AppView>
        </AppView>

        <AppView style={styles.row}>
          <AppView style={styles.half}>
            <AppTextField
              label="Weight"
              value={vitalSigns.weight}
              onChangeText={(value) =>
                updateVitalSigns({
                  weight: value,
                })
              }
              keyboardType="numeric"
              placeholder="kg"
            />
          </AppView>

          <AppView style={styles.half}>
            <AppTextField
              label="Height"
              value={vitalSigns.height}
              onChangeText={(value) =>
                updateVitalSigns({
                  height: value,
                })
              }
              keyboardType="numeric"
              placeholder="cm"
            />
          </AppView>
        </AppView>

        <AppText style={styles.sectionTitle}>
          BMI
        </AppText>

        <AppView style={styles.bmiBox}>
          <AppText style={styles.bmiText}>
            {vitalSigns.bmi || "--"}
          </AppText>
        </AppView>
      </CollapsibleSection>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  row: {
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "flex-start",
  },

  half: {
    flex: 1,
    marginTop: SPACING.sm,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },

  bmiBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },

  bmiText: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
});