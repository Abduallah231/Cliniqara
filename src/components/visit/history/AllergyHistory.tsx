import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import { useVisitStore } from "@/store/visitStore";

import {
  Allergy,
  AllergySeverity,
  AllergyType,
} from "@/models/VisitForm/history";

import useAllergyHistoryAutoSave from "@/hooks/useAllergyHistoryAutoSave";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

// ======================================================
// Labels
// ======================================================

const allergyTypeLabel = (
  type: AllergyType,
) => {
  switch (type) {
    case "DRUG":
      return "Drug";

    case "FOOD":
      return "Food";

    case "ENVIRONMENTAL":
      return "Environmental";

    case "OTHER":
      return "Other";

    default:
      return type;
  }
};

const allergySeverityLabel = (
  severity: AllergySeverity,
) => {
  switch (severity) {
    case "MILD":
      return "Mild";

    case "MODERATE":
      return "Moderate";

    case "SEVERE":
      return "Severe";

    case "ANAPHYLAXIS":
      return "Anaphylaxis";

    default:
      return severity;
  }
};

// ======================================================
// Component
// ======================================================

export default function AllergyHistory() {
  const {
    visit,
    updateHasAllergy,
    addAllergy,
    updateAllergy,
    removeAllergy,
  } = useVisitStore();

  const patientId =
    visit.metadata.patientId;

  const {
    isHydrating,
    isSaving,
    isAutoSaving,
    saveAllergyHistory,
  } =
    useAllergyHistoryAutoSave({
      patientId,
    });

  // ======================================================
  // Form State
  // ======================================================

  const [type, setType] =
    useState<AllergyType>("DRUG");

  const [allergen, setAllergen] =
    useState("");

  const [reaction, setReaction] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [severity, setSeverity] =
    useState<AllergySeverity>(
      "MODERATE",
    );

  const [
    editingAllergyId,
    setEditingAllergyId,
  ] = useState<string | null>(
    null,
  );

  // ======================================================
  // Delete Loading
  // ======================================================

  const [
    deletingAllergyId,
    setDeletingAllergyId,
  ] = useState<string | null>(
    null,
  );

  // ======================================================
  // Form Helpers
  // ======================================================

  const clearForm = () => {
    setType("DRUG");
    setAllergen("");
    setReaction("");
    setNotes("");
    setSeverity("MODERATE");
    setEditingAllergyId(null);
  };

  const isActionRunning =
    isSaving ||
    deletingAllergyId !== null;

  // ======================================================
  // Add / Update
  //
  // MANUAL SAVE
  // ======================================================

  const handleAddAllergy =
    async () => {
      if (
        isHydrating ||
        isActionRunning
      ) {
        return;
      }

      if (!allergen.trim()) {
        Alert.alert(
          "Allergen Required",
          "Please enter the allergen.",
        );
        return;
      }

      /**
       * Snapshot current Store state.
       *
       * This allows us to restore the previous
       * state if the backend request fails.
       */
      const previousAllergies =
        visit.history.allergyHistory
          .allergies;

      try {
        /**
         * ==================================================
         * UPDATE
         * ==================================================
         */

        if (editingAllergyId) {
          const previousAllergy =
            previousAllergies.find(
              (item) =>
                item.id ===
                editingAllergyId,
            );

          updateAllergy(
            editingAllergyId,
            {
              type,
              allergen:
                allergen.trim(),
              reaction:
                reaction.trim() || null,
              notes:
                notes.trim() || null,
              severity,
            },
          );

          try {
            await saveAllergyHistory();
          } catch (error) {
            /**
             * Restore previous allergy.
             */
            if (previousAllergy) {
              updateAllergy(
                editingAllergyId,
                previousAllergy,
              );
            }

            throw error;
          }

          clearForm();
          return;
        }

        /**
         * ==================================================
         * ADD
         * ==================================================
         */

        const allergy: Allergy = {
          id: `temp-${Date.now()}`,
          type,
          allergen:
            allergen.trim(),
          reaction:
            reaction.trim() || null,
          notes:
            notes.trim() || null,
          severity,
        };

        addAllergy(allergy);

        try {
          await saveAllergyHistory();
        } catch (error) {
          /**
           * Remove the temporary allergy from
           * the Store because DB save failed.
           */
          removeAllergy(allergy.id);

          throw error;
        }

        clearForm();
      } catch (error) {
        console.error(
          "FAILED TO SAVE ALLERGY",
          error,
        );

        Alert.alert(
          "Save Failed",
          "Allergy changes could not be saved. Please try again.",
        );
      }
    };

  // ======================================================
  // Delete Allergy
  //
  // MANUAL SAVE
  // ======================================================

  const handleRemoveAllergy =
    async (
      allergyId: string,
    ) => {
      if (
        isHydrating ||
        isActionRunning
      ) {
        return;
      }

      const previousAllergies =
        visit.history.allergyHistory
          .allergies;

      const removedAllergy =
        previousAllergies.find(
          (item) =>
            item.id === allergyId,
        );

      if (!removedAllergy) {
        return;
      }

      setDeletingAllergyId(
        allergyId,
      );

      try {
        removeAllergy(allergyId);

        /**
         * If the last allergy was deleted,
         * hasAllergy must become false.
         *
         * Otherwise Backend would reject:
         *
         * hasAllergy=true
         * allergies=[]
         */
        const remainingAllergies =
          useVisitStore
            .getState()
            .visit.history
            .allergyHistory
            .allergies;

        if (
          remainingAllergies.length === 0
        ) {
          updateHasAllergy(false);
        }

        try {
          await saveAllergyHistory();
        } catch (error) {
          /**
           * Restore deleted allergy.
           */
          addAllergy(
            removedAllergy,
          );

          /**
           * Restore hasAllergy=true.
           */
          updateHasAllergy(true);

          throw error;
        }

        if (
          editingAllergyId ===
          allergyId
        ) {
          clearForm();
        }
      } catch (error) {
        console.error(
          "FAILED TO DELETE ALLERGY",
          error,
        );

        Alert.alert(
          "Delete Failed",
          "Allergy could not be deleted. The previous allergy data has been restored.",
        );
      } finally {
        setDeletingAllergyId(
          null,
        );
      }
    };

  // ======================================================
  // Allergy Status
  // ======================================================

  const handleHasAllergyChange =
    async (
      value: boolean,
    ) => {
      if (
        isHydrating ||
        isActionRunning
      ) {
        return;
      }

      const currentHistory =
        visit.history
          .allergyHistory;

      /**
       * No → No
       */
      if (
        currentHistory.hasAllergy ===
        value
      ) {
        return;
      }

      /**
       * ==================================================
       * YES
       * ==================================================
       *
       * Do NOT save immediately.
       *
       * Backend requires at least one allergy
       * when hasAllergy=true.
       */
      if (value === true) {
        updateHasAllergy(true);
        return;
      }

      /**
       * ==================================================
       * YES → NO
       * ==================================================
       *
       * This is destructive.
       */
      if (
        currentHistory.allergies
          .length > 0
      ) {
        Alert.alert(
          "Remove Allergy History?",
          "Changing Allergy status to No will permanently remove all recorded allergies and their details. Do you want to continue?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes, Remove All",
              style: "destructive",
              onPress: async () => {
                if (
                  isActionRunning ||
                  isHydrating
                ) {
                  return;
                }

                const previousAllergies =
                  [...currentHistory.allergies];

                try {
                  /**
                   * Clear ALL allergies from Store.
                   */
                  previousAllergies.forEach(
                    (allergy) => {
                      removeAllergy(
                        allergy.id,
                      );
                    },
                  );

                  /**
                   * Then change status to No.
                   */
                  updateHasAllergy(
                    false,
                  );

                  /**
                   * Persist:
                   *
                   * hasAllergy=false
                   * allergies=[]
                   */
                  try {
                    await saveAllergyHistory();
                  } catch (error) {
                    /**
                     * Restore previous state.
                     */
                    previousAllergies.forEach(
                      (allergy) => {
                        addAllergy(
                          allergy,
                        );
                      },
                    );

                    updateHasAllergy(
                      true,
                    );

                    throw error;
                  }
                } catch (error) {
                  console.error(
                    "FAILED TO REMOVE ALLERGY HISTORY",
                    error,
                  );

                  Alert.alert(
                    "Save Failed",
                    "Allergy history could not be removed. The previous data has been restored.",
                  );
                }
              },
            },
          ],
        );

        return;
      }

      /**
       * ==================================================
       * NO → NO ALLERGY DATA
       * ==================================================
       */

      updateHasAllergy(false);

      /**
       * Valid backend payload:
       *
       * {
       *   hasAllergy: false,
       *   allergies: []
       * }
       *
       * Auto-save will persist it.
       */
    };

  const allergies =
    visit.history
      .allergyHistory
      .allergies;

  const hasAllergy =
    visit.history
      .allergyHistory
      .hasAllergy;

  return (
    <View
      style={styles.container}
    >
      {/* ==================================================
          HYDRATION
      ================================================== */}

      {isHydrating && (
        <Text
          style={
            styles.statusText
          }
        >
          Loading allergy history...
        </Text>
      )}

      {/* ==================================================
          ANY ALLERGY
      ================================================== */}

      <SectionHeader
        title="Any Allergy?"
      />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            hasAllergy === true
          }
          onPress={() =>
            handleHasAllergyChange(
              true,
            )
          }
          disabled={
            isHydrating ||
            isActionRunning
          }
        />

        <AppChip
          label="No"
          selected={
            hasAllergy === false
          }
          onPress={() =>
            handleHasAllergyChange(
              false,
            )
          }
          disabled={
            isHydrating ||
            isActionRunning
          }
        />
      </View>

      {/* ==================================================
          ALLERGY FORM
      ================================================== */}

      {hasAllergy === true && (
        <>
          <Divider />

          <SectionHeader
            title="Type"
          />

          <View style={styles.row}>
            {[
              {
                label: "Drug",
                value: "DRUG",
              },
              {
                label: "Food",
                value: "FOOD",
              },
              {
                label:
                  "Environmental",
                value:
                  "ENVIRONMENTAL",
              },
              {
                label: "Other",
                value: "OTHER",
              },
            ].map((item) => (
              <AppChip
                key={item.value}
                label={item.label}
                selected={
                  type ===
                  item.value
                }
                disabled={
                  isHydrating ||
                  isActionRunning
                }
                onPress={() =>
                  setType(
                    item.value as AllergyType,
                  )
                }
              />
            ))}
          </View>

          <AppTextField
            label="Allergen"
            placeholder="Search Allergen"
            value={allergen}
            editable={
              !isHydrating &&
              !isActionRunning
            }
            onChangeText={
              setAllergen
            }
          />

          <AppTextField
            label="Reaction"
            placeholder="Reaction"
            value={reaction}
            editable={
              !isHydrating &&
              !isActionRunning
            }
            onChangeText={
              setReaction
            }
          />

          <AppTextField
            label="Notes"
            placeholder="Additional notes..."
            value={notes}
            editable={
              !isHydrating &&
              !isActionRunning
            }
            onChangeText={
              setNotes
            }
          />

          <Text
            style={styles.label}
          >
            Severity
          </Text>

          <View style={styles.row}>
            {[
              {
                label: "Mild",
                value: "MILD",
              },
              {
                label: "Moderate",
                value:
                  "MODERATE",
              },
              {
                label: "Severe",
                value: "SEVERE",
              },
              {
                label:
                  "Anaphylaxis",
                value:
                  "ANAPHYLAXIS",
              },
            ].map((item) => (
              <AppChip
                key={item.value}
                label={item.label}
                selected={
                  severity ===
                  item.value
                }
                disabled={
                  isHydrating ||
                  isActionRunning
                }
                onPress={() =>
                  setSeverity(
                    item.value as AllergySeverity,
                  )
                }
              />
            ))}
          </View>

          <Text
            style={styles.helperText}
          >
            {editingAllergyId
              ? "Tap Update Allergy to save your changes."
              : 'Tap "Add Allergy" to save this allergy.'}
          </Text>

          {/* ==================================================
              ADD / UPDATE
              MANUAL SAVE
          ================================================== */}

          <AppButton
            title={
              isSaving
                ? "Saving..."
                : editingAllergyId
                  ? "Update Allergy"
                  : "Add Allergy"
            }
            onPress={
              handleAddAllergy
            }
            disabled={
              isHydrating ||
              isActionRunning
            }
          />

          {/* ==================================================
              ALLERGY LIST
          ================================================== */}

          {allergies.map(
            (allergy) => {
              const isDeleting =
                deletingAllergyId ===
                allergy.id;

              return (
                <View
                  key={
                    allergy.id
                  }
                  style={
                    styles.allergyCard
                  }
                >
                  <Text
                    style={
                      styles.allergyTitle
                    }
                  >
                    {
                      allergy.allergen
                    }
                  </Text>

                  <Text
                    style={
                      styles.allergyText
                    }
                  >
                    Type:{" "}
                    {allergyTypeLabel(
                      allergy.type,
                    )}
                  </Text>

                  {!!allergy.reaction && (
                    <Text
                      style={
                        styles.allergyText
                      }
                    >
                      Reaction:{" "}
                      {
                        allergy.reaction
                      }
                    </Text>
                  )}

                  {!!allergy.notes && (
                    <Text
                      style={
                        styles.allergyText
                      }
                    >
                      Notes:{" "}
                      {allergy.notes}
                    </Text>
                  )}

                  <Text
                    style={
                      styles.allergyText
                    }
                  >
                    Severity:{" "}
                    {allergySeverityLabel(
                      allergy.severity,
                    )}
                  </Text>

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
                        isHydrating ||
                        isActionRunning
                      }
                      onPress={() => {
                        if (
                          isHydrating ||
                          isActionRunning
                        ) {
                          return;
                        }

                        setEditingAllergyId(
                          allergy.id,
                        );

                        setType(
                          allergy.type,
                        );

                        setAllergen(
                          allergy.allergen,
                        );

                        setReaction(
                          allergy.reaction ??
                            "",
                        );

                        setNotes(
                          allergy.notes ??
                            "",
                        );

                        setSeverity(
                          allergy.severity,
                        );
                      }}
                    >
                      <MaterialIcons
                        name="edit"
                        size={22}
                        color={
                          isHydrating ||
                          isActionRunning
                            ? COLORS.secondaryText
                            : COLORS.primary
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
                        isHydrating ||
                        isActionRunning
                      }
                      onPress={() =>
                        handleRemoveAllergy(
                          allergy.id,
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
                          isHydrating ||
                          isActionRunning
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
        </>
      )}

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

// ======================================================
// Styles
// ======================================================

const styles =
  StyleSheet.create({
    container: {
      gap: SPACING.md,
    },

    row: {
      flexDirection:
        "row",
      flexWrap: "wrap",
      gap: SPACING.xs,
    },

    label: {
      fontSize:
        TYPOGRAPHY.small,
      fontWeight: "600",
      color: COLORS.text,
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

    allergyCard: {
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius: 12,
      padding:
        SPACING.md,
      gap: SPACING.xs,
      backgroundColor:
        COLORS.white,
    },

    allergyTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "700",
      color: COLORS.text,
    },

    allergyText: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
    },

    actionRow: {
      flexDirection:
        "row",
      justifyContent:
        "flex-end",
      alignItems:
        "center",
      gap: SPACING.md,
      marginTop:
        SPACING.sm,
    },

    iconButton: {
      padding: 6,
    },
  });