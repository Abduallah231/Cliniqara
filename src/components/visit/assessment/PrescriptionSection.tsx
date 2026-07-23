import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTextField from "@/components/common/AppTextField";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function PrescriptionSection() {
  const prescription = useVisitStore(
    (state) => state.visit.assessment.prescription
  );

  const addPrescriptionMedication =
    useVisitStore(
      (state) =>
        state.addPrescriptionMedication
    );

  const updatePrescriptionMedication =
    useVisitStore(
      (state) =>
        state.updatePrescriptionMedication
    );

  const removePrescriptionMedication =
    useVisitStore(
      (state) =>
        state.removePrescriptionMedication
    );

  const updatePrescriptionAdvice =
    useVisitStore(
      (state) =>
        state.updatePrescriptionAdvice
    );

  const updatePrescriptionNotes =
    useVisitStore(
      (state) =>
        state.updatePrescriptionNotes
    );

  const updatePrescriptionFollowUp =
    useVisitStore(
      (state) =>
        state.updatePrescriptionFollowUp
    );

  const followUpOptions = [
    "3 Days",
    "1 Week",
    "2 Weeks",
    "1 Month",
    "3 Months",
    "PRN",
  ];

  const addMedication = () =>
    addPrescriptionMedication({
      medication: "",
      instructions: "",
    });

  const removeMedication = (
    index: number
  ) => {
    if (
      prescription.medications
        .length === 1
    )
      return;

    removePrescriptionMedication(
      index
    );
  };

  const updateMedication = (
    text: string,
    index: number
  ) => {
    updatePrescriptionMedication(
      index,
      {
        medication: text,
      }
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.templateButton}
      >
        <Ionicons
          name="library-outline"
          size={20}
          color={COLORS.primary}
        />
        <Text
          style={styles.templateText}
        >
          Import Prescription Template
        </Text>
      </Pressable>

      {prescription.medications.map(
        (
          medication,
          index
        ) => (
          <View
            key={index}
            style={styles.card}
          >
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
                onPress={() =>
                  removeMedication(
                    index
                  )
                }
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#ef4444"
                />
              </Pressable>
            </View>

            <AppTextField
            label="Medication"
              placeholder="Paracetamol 500mg tab"
              value={medication.medication}
              onChangeText={(text) =>
                updatePrescriptionMedication(index, {
                  medication: text,
                })
              }
            />

            <AppTextField
              multiline
              label="Instructions"
              placeholder="قرص كل ٨ ساعات بعد الاكل لمدة ٥ ايام"
              value={medication.instructions}
              onChangeText={(text) =>
                updatePrescriptionMedication(index, {
                  instructions: text,
                })
              }
            />

          </View>
        )
      )}

      <Pressable
        style={styles.addButton}
        onPress={addMedication}
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={COLORS.white}
        />
        <Text
          style={styles.addButtonText}
        >
          Add Medication
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Advice
      </Text>

      <AppTextField
        multiline
        value={prescription.advice}
        onChangeText={
          updatePrescriptionAdvice
        }
        placeholder="Patient advice..."
      />

      <Text style={styles.title}>
        Notes
      </Text>

      <AppTextField
        multiline
        value={prescription.notes}
        onChangeText={
          updatePrescriptionNotes
        }
        placeholder="Additional notes..."
      />

      <Text style={styles.title}>
        Follow Up
      </Text>

      <View style={styles.chips}>
        {followUpOptions.map(
          (item) => (
            <Pressable
              key={item}
              style={[
                styles.chip,
                prescription.followUp ===
                  item &&
                  styles.selectedChip,
              ]}
              onPress={() =>
                updatePrescriptionFollowUp(
                  item
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  prescription.followUp ===
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
        value={prescription.followUp}
        onChangeText={
          updatePrescriptionFollowUp
        }
      />

      <Pressable
        style={styles.printButton}
        onPress={() => {
          // TODO: Open prescription preview / print
        }}
      >
        <Ionicons
          name="print-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.printButtonText}>
          Print Prescription
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  templateButton: {
    height: 54,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  templateText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  cardTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  addButton: {
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  chipText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.small,
  },

  printButton: {
  height: 52,
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.primary,
  backgroundColor: COLORS.card,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: SPACING.sm,
  ...SHADOW,
},

printButtonText: {
  color: COLORS.primary,
  fontSize: TYPOGRAPHY.body,
  fontWeight: "700",
},
});