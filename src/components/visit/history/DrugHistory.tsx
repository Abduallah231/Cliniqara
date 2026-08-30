import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import { Medication } from "@/models/VisitForm/history";
import { useVisitStore } from "@/store/visitStore";
import useDrugHistoryAutoSave from "@/hooks/useDrugHistoryAutoSave";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function DrugHistory() {
  const {
    visit,
    addMedication,
    updateMedication,
    removeMedication,
    updateCompliance,
    updateSelfMedication,
    updateSelfMedicationDetails,
    updateSupplements,
    updateSupplementDetails,
  } = useVisitStore();

  const patientId =
    visit.patient?.id;

  const {
    isHydrating,
    isSavingMedications,
    isAutoSaving,
    saveMedications,
  } =
    useDrugHistoryAutoSave(
      patientId ?? "",
    );

  const [
    medicationName,
    setMedicationName,
  ] = useState("");

  const [dose, setDose] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [
    durationValue,
    setDurationValue,
  ] = useState("");

  const [
    durationUnit,
    setDurationUnit,
  ] = useState<
    | "HOURS"
    | "DAYS"
    | "WEEKS"
    | "MONTHS"
    | "YEARS"
  >("DAYS");

  const [
    editingMedicationId,
    setEditingMedicationId,
  ] = useState<string | null>(
    null,
  );

  /**
   * ======================================================
   * Delete loading state
   * ======================================================
   *
   * Prevents two delete requests from running
   * simultaneously.
   */
  const [
    deletingMedicationId,
    setDeletingMedicationId,
  ] = useState<string | null>(
    null,
  );

  const clearMedicationForm =
    () => {
      setMedicationName("");
      setDose("");
      setDurationValue("");
      setDurationUnit("DAYS");
      setNotes("");
      setEditingMedicationId(null);
    };

  /**
   * ======================================================
   * Medication action state
   * ======================================================
   */
  const isMedicationActionRunning =
    isSavingMedications ||
    deletingMedicationId !== null;

  /**
   * ======================================================
   * Add / Update Medication
   *
   * MANUAL SAVE
   * ======================================================
   */
  const handleAddMedication =
    async () => {
      /**
       * Prevent duplicate presses.
       */
      if (
        isMedicationActionRunning
      ) {
        return;
      }

      /**
       * Validate medication name.
       */
      if (!medicationName.trim()) {
        Alert.alert(
          "Medication Required",
          "Please enter the medication name.",
        );

        return;
      }

      /**
       * Parse duration.
       */
      const parsedDuration =
        durationValue.trim()
          ? Number(durationValue)
          : null;

      /**
       * Validate numeric duration.
       */
      if (
        durationValue.trim() &&
        !Number.isFinite(
          parsedDuration,
        )
      ) {
        Alert.alert(
          "Invalid Duration",
          "Please enter a valid duration.",
        );

        return;
      }

      try {
        /**
         * ==================================================
         * UPDATE
         * ==================================================
         */
        if (editingMedicationId) {
          updateMedication(
            editingMedicationId,
            {
              medicationName:
                medicationName.trim(),

              dose:
                dose.trim() || null,

              durationValue:
                parsedDuration,

              durationUnit:
                parsedDuration !== null
                  ? durationUnit
                  : null,

              notes:
                notes.trim() || null,
            },
          );
        } else {
          /**
           * ==================================================
           * ADD
           * ==================================================
           */
          const medication: Medication =
            {
              /**
               * Temporary frontend ID.
               *
               * Backend ID replaces this after
               * successful save.
               */
              id: Date.now().toString(),

              medicationName:
                medicationName.trim(),

              dose:
                dose.trim() || null,

              durationValue:
                parsedDuration,

              durationUnit:
                parsedDuration !== null
                  ? durationUnit
                  : null,

              notes:
                notes.trim() || null,
            };

          addMedication(
            medication,
          );
        }

        /**
         * Zustand mutation is synchronous.
         *
         * saveMedications() reads the latest Store
         * and persists the complete medication list.
         */
        await saveMedications();

        /**
         * Clear only after successful backend save.
         */
        clearMedicationForm();
      } catch (error) {
        Alert.alert(
          "Save Failed",
          "Medication changes could not be saved. Please try again.",
        );
      }
    };

  /**
   * ======================================================
   * Delete Medication
   *
   * MANUAL SAVE
   * ======================================================
   */
  const handleRemoveMedication =
    async (
      medicationId: string,
    ) => {
      /**
       * Prevent concurrent actions.
       */
      if (
        isMedicationActionRunning
      ) {
        return;
      }

      try {
        /**
         * Show deleting state immediately.
         */
        setDeletingMedicationId(
          medicationId,
        );

        /**
         * Remove from Zustand first.
         */
        removeMedication(
          medicationId,
        );

        /**
         * Persist the complete medication list.
         */
        await saveMedications();

        /**
         * If the deleted medication was
         * currently being edited, close the form.
         */
        if (
          editingMedicationId ===
          medicationId
        ) {
          clearMedicationForm();
        }
      } catch (error) {
        Alert.alert(
          "Delete Failed",
          "Medication could not be deleted. The previous medication list has been restored.",
        );
      } finally {
        setDeletingMedicationId(
          null,
        );
      }
    };

  const medications =
    visit.history.drugHistory
      .currentMedications;

  return (
    <View style={styles.container}>
      {/* ==================================================
          HYDRATION
      ================================================== */}
      {isHydrating && (
        <Text
          style={styles.statusText}
        >
          Loading drug history...
        </Text>
      )}

      {/* ==================================================
          CURRENT MEDICATION
      ================================================== */}
      <SectionHeader
        title="Current Medication"
      />

      <View style={styles.card}>
        <AppTextField
          placeholder="Medication Name"
          value={medicationName}
          onChangeText={
            setMedicationName
          }
          editable={
            !isMedicationActionRunning &&
            !isHydrating
          }
        />

        <AppTextField
          placeholder="Dose Per day"
          value={dose}
          onChangeText={setDose}
          editable={
            !isMedicationActionRunning &&
            !isHydrating
          }
        />
        
        <View
          style={styles.inlineRow}
        >
          <View
            style={{ flex: 1 }}
          >
            <AppTextField
              placeholder="Duration"
              keyboardType="numeric"
              value={durationValue}
              onChangeText={
                setDurationValue
              }
              editable={
                !isMedicationActionRunning &&
                !isHydrating
              }
            />
          </View>

          <View
            style={[
              styles.row,
              {
                flex: 1,
                justifyContent:
                  "center",
              },
            ]}
          >
            <AppChip
              label="Days"
              selected={
                durationUnit ===
                "DAYS"
              }
              onPress={() => {
                if (
                  !isMedicationActionRunning &&
                  !isHydrating
                ) {
                  setDurationUnit(
                    "DAYS",
                  );
                }
              }}
            />

            <AppChip
              label="Months"
              selected={
                durationUnit ===
                "MONTHS"
              }
              onPress={() => {
                if (
                  !isMedicationActionRunning &&
                  !isHydrating
                ) {
                  setDurationUnit(
                    "MONTHS",
                  );
                }
              }}
            />

            <AppChip
              label="Years"
              selected={
                durationUnit ===
                "YEARS"
              }
              onPress={() => {
                if (
                  !isMedicationActionRunning &&
                  !isHydrating
                ) {
                  setDurationUnit(
                    "YEARS",
                  );
                }
              }}
            />
          </View>
        </View>

        <AppTextField
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          editable={
            !isMedicationActionRunning &&
            !isHydrating
          }
        />

        <Text
          style={styles.helperText}
        >
          {editingMedicationId
            ? "Tap Update Medication to save your changes."
            : 'Tap "Add Medication" to save this medication.'}
        </Text>

        <AppButton
          title={
            isSavingMedications
              ? "Saving..."
              : editingMedicationId
                ? "Update Medication"
                : "Add Medication"
          }
          onPress={
            handleAddMedication
          }
          disabled={
            isMedicationActionRunning ||
            isHydrating
          }
        />
      </View>

      {/* ==================================================
          MEDICATION LIST
      ================================================== */}
      {medications.map(
        (medication) => {
          const isDeleting =
            deletingMedicationId ===
            medication.id;

          return (
            <View
              key={
                medication.id
              }
              style={
                styles.medicationCard
              }
            >
              <Text
                style={
                  styles.medicationName
                }
              >
                {
                  medication.medicationName
                }
              </Text>

              {!!medication.dose && (
                <Text
                  style={
                    styles.medicationText
                  }
                >
                  Dose:{" "}
                  {
                    medication.dose
                  }
                </Text>
              )}

              {medication.durationValue !=
                null && (
                <Text
                  style={
                    styles.medicationText
                  }
                >
                  Duration:{" "}
                  {
                    medication.durationValue
                  }{" "}
                  {
                    medication.durationUnit
                  }
                </Text>
              )}

              {!!medication.notes && (
                <Text
                  style={
                    styles.medicationText
                  }
                >
                  Notes:{" "}
                  {medication.notes}
                </Text>
              )}

              <View
                style={
                  styles.actionRow
                }
              >
                {/* ==================================================
                    EDIT
                ================================================== */}
                <TouchableOpacity
                  style={
                    styles.iconButton
                  }
                  disabled={
                    isMedicationActionRunning ||
                    isHydrating
                  }
                  onPress={() => {
                    if (
                      isMedicationActionRunning ||
                      isHydrating
                    ) {
                      return;
                    }

                    setEditingMedicationId(
                      medication.id,
                    );

                    setMedicationName(
                      medication.medicationName,
                    );

                    setDose(
                      medication.dose ??
                        "",
                    );

                    setNotes(
                      medication.notes ??
                        "",
                    );

                    setDurationValue(
                      medication.durationValue !=
                        null
                        ? String(
                            medication.durationValue,
                          )
                        : "",
                    );

                    setDurationUnit(
                      medication.durationUnit ??
                        "DAYS",
                    );
                  }}
                >
                  <MaterialIcons
                    name="edit"
                    size={22}
                    color={
                      isMedicationActionRunning ||
                      isHydrating
                        ? COLORS.secondaryText
                        : "#1976D2"
                    }
                  />
                </TouchableOpacity>

                {/* ==================================================
                    DELETE
                ================================================== */}
                <TouchableOpacity
                  style={
                    styles.iconButton
                  }
                  disabled={
                    isMedicationActionRunning ||
                    isHydrating
                  }
                  onPress={() =>
                    handleRemoveMedication(
                      medication.id,
                    )
                  }
                >
                  <MaterialIcons
                    name={
                      isDeleting
                        ? "hourglass-top"
                        : "delete"
                    }
                    size={22}
                    color={
                      isMedicationActionRunning ||
                      isHydrating
                        ? COLORS.secondaryText
                        : "#D32F2F"
                    }
                  />
                </TouchableOpacity>
              </View>

              {isDeleting && (
                <Text
                  style={
                    styles.savingText
                  }
                >
                  Deleting...
                </Text>
              )}
            </View>
          );
        },
      )}

      <Divider />

      {/* ==================================================
          COMPLIANCE
          AUTO SAVE
      ================================================== */}
      <SectionHeader
        title="Compliance"
      />

      <View style={styles.row}>
        <AppChip
          label="Good"
          selected={
            visit.history
              .drugHistory
              .compliance ===
            "GOOD"
          }
          onPress={() =>
            updateCompliance(
              "GOOD",
            )
          }
        />

        <AppChip
          label="Poor"
          selected={
            visit.history
              .drugHistory
              .compliance ===
            "POOR"
          }
          onPress={() =>
            updateCompliance(
              "POOR",
            )
          }
        />

        <AppChip
          label="Irregular"
          selected={
            visit.history
              .drugHistory
              .compliance ===
            "IRREGULAR"
          }
          onPress={() =>
            updateCompliance(
              "IRREGULAR",
            )
          }
        />
      </View>

      {/* ==================================================
          SELF MEDICATION
          AUTO SAVE
      ================================================== */}
      {/* <Divider />

      <SectionHeader
        title="Self Medication"
      />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            visit.history
              .drugHistory
              .selfMedication ===
            true
          }
          onPress={() =>
            updateSelfMedication(
              true,
            )
          }
        />

        <AppChip
          label="No"
          selected={
            visit.history
              .drugHistory
              .selfMedication ===
            false
          }
          onPress={() =>
            updateSelfMedication(
              false,
            )
          }
        />
      </View>

      {visit.history.drugHistory
        .selfMedication && (
        <AppTextField
          placeholder="Specify"
          value={
            visit.history
              .drugHistory
              .selfMedicationDetails ??
            ""
          }
          onChangeText={
            updateSelfMedicationDetails
          }
        />
      )} */}

      {/* ==================================================
          HERBAL / SUPPLEMENTS
          AUTO SAVE
      ================================================== */}
      {/* <Divider />

      <SectionHeader
        title="Herbal / Supplements"
      />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            visit.history
              .drugHistory
              .supplements ===
            true
          }
          onPress={() =>
            updateSupplements(
              true,
            )
          }
        />

        <AppChip
          label="No"
          selected={
            visit.history
              .drugHistory
              .supplements ===
            false
          }
          onPress={() =>
            updateSupplements(
              false,
            )
          }
        />
      </View>

      {visit.history.drugHistory
        .supplements && (
        <AppTextField
          placeholder="Specify"
          value={
            visit.history
              .drugHistory
              .supplementDetails ??
            ""
          }
          onChangeText={
            updateSupplementDetails
          }
        />
      )} */}

      {/* ==================================================
          AUTO SAVE STATUS
      ================================================== */}
      {isAutoSaving && (
        <Text
          style={
            styles.savingText
          }
        >
          Saving changes...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  card: {
    gap: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  helperText: {
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
  },

  statusText: {
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
  },

  savingText: {
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
  },

  medicationCard: {
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.xs,
    backgroundColor:
      COLORS.white,
  },

  medicationName: {
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  medicationText: {
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent:
      "flex-end",
    alignItems: "center",
    gap: SPACING.md,
    marginTop:
      SPACING.sm,
  },

  iconButton: {
    padding: 6,
  },
});