import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import { Medication } from "@/models/VisitForm/history";
import { useVisitStore } from "@/store/visitStore";

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

  const [medicationName, setMedicationName] =
    useState("");

  const [dose, setDose] =
    useState("");

  const [durationValue, setDurationValue] =
    useState("");

  const [durationUnit, setDurationUnit] =
    useState("Days");

  const [
    editingMedicationId,
    setEditingMedicationId,
  ] = useState<string | null>(null);

  const clearMedicationForm = () => {
    setMedicationName("");
    setDose("");
    setDurationValue("");
    setDurationUnit("Days");
    setEditingMedicationId(null);
  };

  const handleAddMedication = () => {
    if (!medicationName.trim()) return;

    if (editingMedicationId) {
      updateMedication(
        editingMedicationId,
        {
          name: medicationName.trim(),
          dose: dose.trim(),
          durationValue:
            durationValue.trim(),
          durationUnit,
        }
      );
    } else {
      const medication: Medication = {
        id: Date.now().toString(),
        name: medicationName.trim(),
        dose: dose.trim(),
        durationValue:
          durationValue.trim(),
        durationUnit,
      };

      addMedication(medication);
    }

    clearMedicationForm();
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Current Medication" />

      <View style={styles.card}>
        <AppTextField
          placeholder="Medication Name"
          value={medicationName}
          onChangeText={setMedicationName}
        />

        <AppTextField
          placeholder="Dose"
          value={dose}
          onChangeText={setDose}
        />

        <View style={styles.inlineRow}>
          <View style={{ flex: 1 }}>
            <AppTextField
              placeholder="Duration"
              keyboardType="numeric"
              value={durationValue}
              onChangeText={
                setDurationValue
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
                "Days"
              }
              onPress={() =>
                setDurationUnit(
                  "Days"
                )
              }
            />

            <AppChip
              label="Months"
              selected={
                durationUnit ===
                "Months"
              }
              onPress={() =>
                setDurationUnit(
                  "Months"
                )
              }
            />

            <AppChip
              label="Years"
              selected={
                durationUnit ===
                "Years"
              }
              onPress={() =>
                setDurationUnit(
                  "Years"
                )
              }
            />
          </View>
        </View>

        <Text
          style={styles.helperText}
        >
          Tap "Add Medication" to
          save this medication.
        </Text>

        <AppButton
          title={
            editingMedicationId
              ? "Update Medication"
              : "Add Medication"
          }
          onPress={
            handleAddMedication
          }
        />
      </View>

            {visit.history.drugHistory.currentMedications.map(
        (medication) => (
          <View
            key={medication.id}
            style={styles.medicationCard}
          >
            <Text
              style={
                styles.medicationName
              }
            >
              {medication.name}
            </Text>

            {!!medication.dose && (
              <Text
                style={
                  styles.medicationText
                }
              >
                Dose: {medication.dose}
              </Text>
            )}

            {!!medication.durationValue && (
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

            <View style={styles.actionRow}>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {

                        setEditingMedicationId(medication.id);

                        setMedicationName(medication.name);

                        setDose(medication.dose);

                        setDurationValue(medication.durationValue);

                        setDurationUnit(medication.durationUnit);

                    }}
                >

                    <MaterialIcons
                        name="edit"
                        size={22}
                        color="#1976D2"
                    />

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() =>
                        removeMedication(medication.id)
                    }
                >

                    <MaterialIcons
                        name="delete"
                        size={22}
                        color="#D32F2F"
                    />

                </TouchableOpacity>

            </View>
          </View>
        )
      )}

      <Divider />

      <SectionHeader title="Compliance" />

      <View style={styles.row}>
        <AppChip
          label="Good"
          selected={
            visit.history
              .drugHistory
              .compliance ===
            "Good"
          }
          onPress={() =>
            updateCompliance(
              "Good"
            )
          }
        />

        <AppChip
          label="Poor"
          selected={
            visit.history
              .drugHistory
              .compliance ===
            "Poor"
          }
          onPress={() =>
            updateCompliance(
              "Poor"
            )
          }
        />

        <AppChip
          label="Irregular"
          selected={
            visit.history
              .drugHistory
              .compliance ===
            "Irregular"
          }
          onPress={() =>
            updateCompliance(
              "Irregular"
            )
          }
        />
      </View>

      <Divider />

      <SectionHeader title="Self Medication" />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            visit.history
              .drugHistory
              .selfMedication ===
            "Yes"
          }
          onPress={() =>
            updateSelfMedication(
              "Yes"
            )
          }
        />

        <AppChip
          label="No"
          selected={
            visit.history
              .drugHistory
              .selfMedication ===
            "No"
          }
          onPress={() =>
            updateSelfMedication(
              "No"
            )
          }
        />
      </View>

      {visit.history.drugHistory
        .selfMedication ===
        "Yes" && (
        <AppTextField
          placeholder="Specify"
          value={
            visit.history
              .drugHistory
              .selfMedicationDetails
          }
          onChangeText={
            updateSelfMedicationDetails
          }
        />
      )}

      <Divider />

      <SectionHeader title="Herbal / Supplements" />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            visit.history
              .drugHistory
              .supplements ===
            "Yes"
          }
          onPress={() =>
            updateSupplements(
              "Yes"
            )
          }
        />

        <AppChip
          label="No"
          selected={
            visit.history
              .drugHistory
              .supplements ===
            "No"
          }
          onPress={() =>
            updateSupplements(
              "No"
            )
          }
        />
      </View>

      {visit.history.drugHistory
        .supplements ===
        "Yes" && (
        <AppTextField
          placeholder="Specify"
          value={
            visit.history
              .drugHistory
              .supplementDetails
          }
          onChangeText={
            updateSupplementDetails
          }
        />
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

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
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
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  medicationCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
  },

  medicationName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  medicationText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },

  iconButton: {
    padding: 6,
  },
});