import { MaterialIcons } from "@expo/vector-icons";
import {
  useState,
} from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  FamilyDisease,
  FamilyRelation,
} from "@/models/VisitForm/history";

import { useVisitStore } from "@/store/visitStore";

import useFamilyHistoryAutoSave from "@/hooks/useFamilyHistoryAutoSave";

import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import chronicDiseases from "@/data/chronicDiseases";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

const familyRelatives: {
  label: string;
  value: FamilyRelation;
}[] = [
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Brother", value: "BROTHER" },
  { label: "Sister", value: "SISTER" },
  { label: "Son", value: "SON" },
  { label: "Daughter", value: "DAUGHTER" },
  { label: "Grandfather", value: "GRANDFATHER" },
  { label: "Grandmother", value: "GRANDMOTHER" },
  { label: "Uncle", value: "UNCLE" },
  { label: "Aunt", value: "AUNT" },
  { label: "Cousin", value: "COUSIN" },
  { label: "Other", value: "OTHER" },
];
// ======================================================
// Component
// ======================================================

export default function FamilyHistory() {
  const {
    visit,
    addFamilyDisease,
    updateFamilyDisease,
  } = useVisitStore();

  const patientId =
    visit.metadata.patientId;

  const {
    isHydrating,
    isSaving,
    isDeleting,
    deletingFamilyDiseaseId,
    saveFamilyHistory,
    deleteFamilyDisease,
  } =
    useFamilyHistoryAutoSave({
      patientId,
    });

  // ======================================================
  // Form State
  // ======================================================

  const [
    relationship,
    setRelationship,
  ] =
    useState<FamilyRelation | "">("");

  const [
    otherRelative,
    setOtherRelative,
  ] = useState("");

  const [
    diseases,
    setDiseases,
  ] = useState<string[]>([]);

  const [
    otherDisease,
    setOtherDisease,
  ] = useState("");

  const [
    alive,
    setAlive,
  ] = useState(true);

  const [
    ageAtDeath,
    setAgeAtDeath,
  ] = useState("");

  const [
    causeOfDeath,
    setCauseOfDeath,
  ] = useState("");

  const [
    notes,
    setNotes,
  ] = useState("");

  const [
    editingRecordId,
    setEditingRecordId,
  ] =
    useState<string | null>(null);

  // ======================================================
  // Helpers
  // ======================================================

  const clearForm = () => {
    setRelationship("");
    setOtherRelative("");
    setDiseases([]);
    setOtherDisease("");
    setAlive(true);
    setAgeAtDeath("");
    setCauseOfDeath("");
    setNotes("");
    setEditingRecordId(null);
  };

  const toggleDisease = (
    disease: string,
  ) => {
    setDiseases((prev) =>
      prev.includes(disease)
        ? prev.filter(
            (item) =>
              item !== disease,
          )
        : [...prev, disease],
    );
  };

  const isActionRunning =
    isSaving || isDeleting;

  // ======================================================
  // Add / Update Family History
  //
  // MANUAL SAVE
  // ======================================================

  const handleAddFamilyHistory =
    async () => {
      if (
        isHydrating ||
        isActionRunning
      ) {
        return;
      }

      // ==================================================
      // Relationship validation
      // ==================================================

      if (!relationship) {
        Alert.alert(
          "Relationship Required",
          "Please select the family member relationship.",
        );
        return;
      }

      if (
        relationship === "OTHER" &&
        !otherRelative.trim()
      ) {
        Alert.alert(
          "Relationship Required",
          "Please specify the family relationship.",
        );
        return;
      }

      // ==================================================
      // Diseases
      // ==================================================

      const finalDiseases = [
        ...diseases,
      ];

      const trimmedOtherDisease =
        otherDisease.trim();

      if (
        trimmedOtherDisease &&
        !finalDiseases.includes(
          trimmedOtherDisease,
        )
      ) {
        finalDiseases.push(
          trimmedOtherDisease,
        );
      }

      if (
        finalDiseases.length === 0
      ) {
        Alert.alert(
          "Disease Required",
          "Please select or enter at least one disease.",
        );
        return;
      }

      // ==================================================
      // Death information validation
      // ==================================================

      let parsedAgeAtDeath:
        | number
        | null = null;

      if (!alive) {
        const trimmedAge =
          ageAtDeath.trim();

        if (trimmedAge) {
          const parsed =
            Number(trimmedAge);

          if (
            !Number.isFinite(parsed) ||
            !Number.isInteger(parsed) ||
            parsed < 0
          ) {
            Alert.alert(
              "Invalid Age",
              "Please enter a valid age at death.",
            );
            return;
          }

          parsedAgeAtDeath =
            parsed;
        }

        if (
          !trimmedAge &&
          !causeOfDeath.trim()
        ) {
          Alert.alert(
            "Death Information Required",
            "Please enter either age at death or cause of death.",
          );
          return;
        }
      }

      // ==================================================
      // Build Store record
      // ==================================================

      const familyDisease: FamilyDisease =
        {
          id:
            editingRecordId ??
            `temp-${Date.now()}`,

          relation:
            relationship,

          otherRelation:
            relationship === "OTHER"
              ? otherRelative.trim() ||
                null
              : null,

          diseases:
            finalDiseases,

          alive,

          ageAtDeath:
            alive
              ? null
              : parsedAgeAtDeath,

          causeOfDeath:
            alive
              ? null
              : causeOfDeath.trim() ||
                null,

          notes:
            notes.trim() || null,
        };

      // ==================================================
      // Keep previous Store state for rollback
      // ==================================================

      const previousFamilyDiseases =
        [
          ...useVisitStore
            .getState()
            .visit
            .history
            .familyHistory
            .familyDiseases,
        ];

      try {
        // ==================================================
        // UPDATE
        // ==================================================

        if (editingRecordId) {
          updateFamilyDisease(
            editingRecordId,
            familyDisease,
          );
        }

        // ==================================================
        // ADD
        // ==================================================

        else {
          addFamilyDisease(
            familyDisease,
          );
        }

        // ==================================================
        // Persist complete Family History
        // ==================================================

        await saveFamilyHistory();

        // ==================================================
        // Success
        // ==================================================

        clearForm();
      } catch (error) {
        // ==================================================
        // Restore previous Store state
        // ==================================================

        const currentFamilyDiseases =
          useVisitStore
            .getState()
            .visit
            .history
            .familyHistory
            .familyDiseases;

        currentFamilyDiseases.forEach(
          (item) => {
            useVisitStore
              .getState()
              .removeFamilyDisease(
                item.id,
              );
          },
        );

        previousFamilyDiseases.forEach(
          (item) => {
            useVisitStore
              .getState()
              .addFamilyDisease(
                item,
              );
          },
        );

        console.error(
          "FAILED TO SAVE FAMILY HISTORY",
          error,
        );

        Alert.alert(
          "Save Failed",
          "Family history could not be saved. The previous data has been restored.",
        );
      }
    };

  // ======================================================
  // Delete Family History
  //
  // MANUAL SAVE
  // ======================================================

  const handleRemoveFamilyDisease =
    async (
      familyDiseaseId: string,
    ) => {
      if (
        isHydrating ||
        isActionRunning
      ) {
        return;
      }

      Alert.alert(
        "Delete Family History",
        "Are you sure you want to remove this family history record?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteFamilyDisease(
                  familyDiseaseId,
                );

                if (
                  editingRecordId ===
                  familyDiseaseId
                ) {
                  clearForm();
                }
              } catch (error) {
                console.error(
                  "FAILED TO DELETE FAMILY HISTORY",
                  error,
                );

                Alert.alert(
                  "Delete Failed",
                  "Family history could not be deleted. The previous data has been restored.",
                );
              }
            },
          },
        ],
      );
    };

  // ======================================================
  // Current Store Data
  // ======================================================

  const familyDiseases =
    visit.history.familyHistory
      .familyDiseases;

  // ======================================================
  // Render
  // ======================================================

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
          Loading family history...
        </Text>
      )}

      {/* ==================================================
          FORM
      ================================================== */}

      <SectionHeader
        title="Family History"
      />

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Relationship
        </Text>

        <View style={styles.row}>
          {familyRelatives.map((relative) => (
            <AppChip
              key={relative.value}
              label={relative.label}
              selected={
                relationship === relative.value
              }
              onPress={() =>
                setRelationship(relative.value)
              }
            />
          ))}
        </View>

        {relationship ===
          "OTHER" && (
          <AppTextField
            placeholder="Specify Relative"
            value={
              otherRelative
            }
            editable={
              !isHydrating &&
              !isActionRunning
            }
            onChangeText={
              setOtherRelative
            }
          />
        )}

        <Divider />

        {/* ==================================================
            Diseases
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Diseases
        </Text>

        <View style={styles.row}>
          {chronicDiseases.map(
            (disease) => (
              <AppChip
                key={
                  disease.code
                }
                label={
                  disease.name
                }
                selected={diseases.includes(
                  disease.code,
                )}
                disabled={
                  isHydrating ||
                  isActionRunning
                }
                onPress={() =>
                  toggleDisease(
                    disease.code,
                  )
                }
              />
            ),
          )}
        </View>

        <AppTextField
          label="Other Disease"
          placeholder="Type disease and it will be added"
          value={otherDisease}
          editable={
            !isHydrating &&
            !isActionRunning
          }
          onChangeText={
            setOtherDisease
          }
        />

        <Divider />

        {/* ==================================================
            Alive
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Alive
        </Text>

        <View style={styles.row}>
          <AppChip
            label="Yes"
            selected={alive}
            disabled={
              isHydrating ||
              isActionRunning
            }
            onPress={() =>
              setAlive(true)
            }
          />

          <AppChip
            label="No"
            selected={!alive}
            disabled={
              isHydrating ||
              isActionRunning
            }
            onPress={() =>
              setAlive(false)
            }
          />
        </View>

        {!alive && (
          <>
            <AppTextField
              placeholder="Age at Death"
              keyboardType="numeric"
              value={ageAtDeath}
              editable={
                !isHydrating &&
                !isActionRunning
              }
              onChangeText={
                setAgeAtDeath
              }
            />

            <AppTextField
              placeholder="Cause of Death"
              value={causeOfDeath}
              editable={
                !isHydrating &&
                !isActionRunning
              }
              onChangeText={
                setCauseOfDeath
              }
            />
          </>
        )}

        <AppTextField
          placeholder="Additional Notes..."
          value={notes}
          editable={
            !isHydrating &&
            !isActionRunning
          }
          onChangeText={setNotes}
        />

        {/* ==================================================
            ADD / UPDATE
            MANUAL SAVE
        ================================================== */}

        <AppButton
          title={
            isSaving
              ? "Saving..."
              : editingRecordId
                ? "Update Family History"
                : "Add Family History"
          }
          onPress={
            handleAddFamilyHistory
          }
          disabled={
            isHydrating ||
            isActionRunning
          }
        />
      </View>

      {/* ==================================================
          FAMILY HISTORY LIST
      ================================================== */}

      {familyDiseases.map(
        (item) => {
          const isDeleting =
            deletingFamilyDiseaseId ===
            item.id;

          return (
            <View
              key={item.id}
              style={
                styles.recordCard
              }
            >
              <Text
                style={
                  styles.recordTitle
                }
              >
                {item.relation ===
                "OTHER"
                  ? item.otherRelation
                  : item.relation}
              </Text>

              <Text
                style={
                  styles.recordText
                }
              >
                Diseases:
              </Text>

              {item.diseases.map(
                (disease) => (
                  <Text
                    key={disease}
                    style={
                      styles.recordText
                    }
                  >
                    • {disease}
                  </Text>
                ),
              )}

              <Text
                style={
                  styles.recordText
                }
              >
                Alive:{" "}
                {item.alive
                  ? "Yes"
                  : "No"}
              </Text>

              {!item.alive && (
                <>
                  {item.ageAtDeath !==
                    null &&
                    item.ageAtDeath !==
                      undefined && (
                      <Text
                        style={
                          styles.recordText
                        }
                      >
                        Age at Death:{" "}
                        {
                          item.ageAtDeath
                        }
                      </Text>
                    )}

                  {!!item.causeOfDeath && (
                    <Text
                      style={
                        styles.recordText
                      }
                    >
                      Cause:{" "}
                      {
                        item.causeOfDeath
                      }
                    </Text>
                  )}
                </>
              )}

              {!!item.notes && (
                <Text
                  style={
                    styles.recordText
                  }
                >
                  Notes:{" "}
                  {item.notes}
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

                    setEditingRecordId(
                      item.id,
                    );

                    setRelationship(
                      item.relation,
                    );

                    setOtherRelative(
                      item.otherRelation ??
                        "",
                    );

                    setDiseases(
                      item.diseases,
                    );

                    setOtherDisease(
                      "",
                    );

                    setAlive(
                      item.alive,
                    );

                    setAgeAtDeath(
                      item.ageAtDeath !=
                        null
                        ? String(
                            item.ageAtDeath,
                          )
                        : "",
                    );

                    setCauseOfDeath(
                      item.causeOfDeath ??
                        "",
                    );

                    setNotes(
                      item.notes ??
                        "",
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
                    handleRemoveFamilyDisease(
                      item.id,
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

      {/* ==================================================
          SAVE STATUS
      ================================================== */}

      {isSaving && (
        <Text
          style={
            styles.savingText
          }
        >
          Saving family history...
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

    card: {
      gap: SPACING.sm,
    },

    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.xs,
    },

    sectionTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "700",
      color: COLORS.text,
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

    recordCard: {
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

    recordTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "700",
      color: COLORS.text,
    },

    recordText: {
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