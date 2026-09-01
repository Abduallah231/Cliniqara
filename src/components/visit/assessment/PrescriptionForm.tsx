import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTextField from "@/components/common/AppTextField";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export type PrescriptionDurationUnit =
  | "DAYS"
  | "WEEKS"
  | "MONTHS"
  | "YEARS";

export type PrescriptionFormMedication = {
  medication: string;
  instructions: string;
  durationValue: string;
  durationUnit: PrescriptionDurationUnit;
};

export type PrescriptionFormProps = {
  medications: PrescriptionFormMedication[];
  advice: string;
  notes: string;
  followUp: string;

  onAddMedication: () => void;

  onUpdateMedication: (
    index: number,
    updates: Partial<PrescriptionFormMedication>
  ) => void;

  onRemoveMedication: (
    index: number
  ) => void;

  onUpdateAdvice: (
    value: string
  ) => void;

  onUpdateNotes: (
    value: string
  ) => void;

  onUpdateFollowUp: (
    value: string
  ) => void;
};

const followUpOptions = [
  "3 Days",
  "2 Weeks",
  "1 Month",
  "3 Months",
  "PRN",
];

const durationUnits = [
  {
    label: "Days",
    value: "DAYS",
  },
  {
    label: "Weeks",
    value: "WEEKS",
  },
  {
    label: "Months",
    value: "MONTHS",
  },
  {
    label: "Years",
    value: "YEARS",
  },
] as const;

export default function PrescriptionForm({
  medications,
  advice,
  notes,
  followUp,
  onAddMedication,
  onUpdateMedication,
  onRemoveMedication,
  onUpdateAdvice,
  onUpdateNotes,
  onUpdateFollowUp,
}: PrescriptionFormProps) {
  return (
    <View style={styles.container}>
      {/* ==================================================
          Medications
      ================================================== */}

      {medications.map(
        (
          medication,
          index
        ) => (
          <View
            key={index}
            style={styles.card}
          >
            {/* Medication Header */}

            <View
              style={
                styles.cardHeader
              }
            >
              <Ionicons
                name="medical-outline"
                size={20}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.cardTitle
                }
              >
                Medication{" "}
                {index + 1}
              </Text>

              <Pressable
                onPress={() => {
                  if (
                    medications.length ===
                    1
                  ) {
                    return;
                  }

                  onRemoveMedication(
                    index
                  );
                }}
                hitSlop={8}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#ef4444"
                />
              </Pressable>
            </View>

            {/* Medication */}

            <AppTextField
              label="Medication"
              placeholder="Paracetamol 500mg tab"
              value={
                medication.medication
              }
              onChangeText={(
                text
              ) =>
                onUpdateMedication(
                  index,
                  {
                    medication:
                      text,
                  }
                )
              }
            />

            {/* Instructions */}

            <AppTextField
              multiline
              label="Instructions"
              placeholder="قرص كل ٨ ساعات بعد الاكل لمدة ٥ ايام"
              value={
                medication.instructions
              }
              onChangeText={(
                text
              ) =>
                onUpdateMedication(
                  index,
                  {
                    instructions:
                      text,
                  }
                )
              }
            />

            {/* Duration */}

            <Text
              style={
                styles.durationLabel
              }
            >
              Duration
            </Text>

            <View
              style={
                styles.durationRow
              }
            >
              <View
                style={
                  styles.durationValue
                }
              >
                <AppTextField
                  placeholder="Duration"
                  value={
                    medication.durationValue ??
                    ""
                  }
                  onChangeText={(
                    text
                  ) =>
                    onUpdateMedication(
                      index,
                      {
                        durationValue:
                          text,
                      }
                    )
                  }
                  keyboardType="numeric"
                />
              </View>

              <View
                style={
                  styles.durationUnits
                }
              >
                {durationUnits.map(
                  (unit) => (
                    <Pressable
                      key={
                        unit.value
                      }
                      style={[
                        styles.durationChip,
                        medication.durationUnit ===
                          unit.value &&
                          styles.selectedDurationChip,
                      ]}
                      onPress={() =>
                        onUpdateMedication(
                          index,
                          {
                            durationUnit:
                              unit.value,
                          }
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.durationChipText,
                          medication.durationUnit ===
                            unit.value &&
                            styles.selectedDurationChipText,
                        ]}
                      >
                        {
                          unit.label
                        }
                      </Text>
                    </Pressable>
                  )
                )}
              </View>
            </View>
          </View>
        )
      )}

      {/* ==================================================
          Add Medication
      ================================================== */}

      <Pressable
        style={styles.addButton}
        onPress={
          onAddMedication
        }
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={
            COLORS.white
          }
        />

        <Text
          style={
            styles.addButtonText
          }
        >
          Add Medication
        </Text>
      </Pressable>

      {/* ==================================================
          Advice
      ================================================== */}

      <Text style={styles.title}>
        Advice
      </Text>

      <AppTextField
        multiline
        value={advice}
        onChangeText={
          onUpdateAdvice
        }
        placeholder="Patient advice..."
      />

      {/* ==================================================
          Notes
      ================================================== */}

      <Text style={styles.title}>
        Notes
      </Text>

      <AppTextField
        multiline
        value={notes}
        onChangeText={
          onUpdateNotes
        }
        placeholder="Additional notes..."
      />

      {/* ==================================================
          Follow Up
      ================================================== */}

      <Text style={styles.title}>
        Follow Up
      </Text>

      <View
        style={styles.chips}
      >
        {followUpOptions.map(
          (item) => (
            <Pressable
              key={item}
              style={[
                styles.chip,
                followUp ===
                  item &&
                  styles.selectedChip,
              ]}
              onPress={() =>
                onUpdateFollowUp(
                  item
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  followUp ===
                    item && {
                      color:
                        COLORS.white,
                    },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )
        )}
      </View>

      <AppTextField
        placeholder="Custom follow up..."
        value={followUp}
        onChangeText={
          onUpdateFollowUp
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  title: {
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor:
      COLORS.card,
    borderRadius:
      RADIUS.xl,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding:
      SPACING.md,
    gap: SPACING.md,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection:
      "row",
    alignItems:
      "center",
    gap: SPACING.sm,
  },

  cardTitle: {
    flex: 1,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  addButton: {
    height: 52,
    borderRadius:
      RADIUS.lg,
    backgroundColor:
      COLORS.primary,
    flexDirection:
      "row",
    alignItems:
      "center",
    justifyContent:
      "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  addButtonText: {
    color:
      COLORS.white,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
  },

  chips: {
    flexDirection:
      "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  selectedChip: {
    backgroundColor:
      COLORS.primary,
    borderColor:
      COLORS.primary,
  },

  chipText: {
    color:
      COLORS.text,
    fontWeight: "600",
    fontSize:
      TYPOGRAPHY.small,
  },

  durationLabel: {
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  durationRow: {
    flexDirection:
      "row",
    alignItems:
      "flex-start",
    gap: SPACING.sm,
  },

  durationValue: {
    width: 100,
  },

  durationUnits: {
    flex: 1,
    flexDirection:
      "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    paddingTop:
      SPACING.xs,
  },

  durationChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  selectedDurationChip: {
    backgroundColor:
      COLORS.primary,
    borderColor:
      COLORS.primary,
  },

  durationChipText: {
    color:
      COLORS.text,
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "600",
  },

  selectedDurationChipText: {
    color:
      COLORS.white,
  },
});