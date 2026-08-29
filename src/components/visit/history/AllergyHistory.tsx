import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

const allergyTypeLabel = (
  type: AllergyType
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
  severity: AllergySeverity
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

export default function AllergyHistory() {
  const {
    visit,
    updateHasAllergy,
    addAllergy,
    updateAllergy,
    removeAllergy,
  } = useVisitStore();

  const [type, setType] =
    useState<AllergyType>("DRUG");

  const [allergen, setAllergen] =
    useState("");

  const [reaction, setReaction] =
    useState("");

  const [notes, setNotes] = useState("");

  const [severity, setSeverity] =
    useState<AllergySeverity>(
      "MODERATE"
    );

  const [
    editingAllergyId,
    setEditingAllergyId,
  ] = useState<string | null>(
    null
  );

  const clearForm = () => {
    setType("DRUG");
    setAllergen("");
    setReaction("");
    setNotes("");
    setSeverity("MODERATE");
    setEditingAllergyId(null);
  };

  const handleAddAllergy = () => {
    if (!allergen.trim()) return;

    if (editingAllergyId) {
      updateAllergy(
        editingAllergyId,
        {
          type,
          allergen:
            allergen.trim(),
          reaction:
            reaction.trim(),
          notes: notes.trim(),
          severity,
        }
      );
    } else {
      const allergy: Allergy = {
        id: Date.now().toString(),
        type,
        allergen:
          allergen.trim(),
        reaction:
          reaction.trim(),
        notes: notes.trim(),
        severity,
      };

      addAllergy(allergy);
    }

    clearForm();
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Any Allergy?" />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            visit.history
              .allergyHistory
              .hasAllergy === true
          }
          onPress={() =>
            updateHasAllergy(true)
          }          
        />

        <AppChip
          label="No"
          selected={
            visit.history
              .allergyHistory
              .hasAllergy === false
          }
          onPress={() =>
            updateHasAllergy(false)
          }
        />
      </View>

      {visit.history
        .allergyHistory
        .hasAllergy === true && (
        <>
          <Divider />

          <SectionHeader title="Type" />

          <View style={styles.row}>
            {[
              { label: "Drug", value: "DRUG" },
              { label: "Food", value: "FOOD" },
              {
                label: "Environmental",
                value: "ENVIRONMENTAL",
              },
              { label: "Other", value: "OTHER" },
            ].map((item) => (
              <AppChip
                key={item.value}
                label={item.label}
                selected={type === item.value}
                onPress={() =>
                  setType(item.value as AllergyType)
                }
              />
            ))}
          </View>

          <AppTextField
            label="Allergen"
            placeholder="Search Allergen"
            value={allergen}
            onChangeText={
              setAllergen
            }
          />

          <AppTextField
            label="Reaction"
            placeholder="Reaction"
            value={reaction}
            onChangeText={
              setReaction
            }
          />

          <AppTextField
            label="Notes"
            placeholder="Additional notes..."
            value={notes}
            onChangeText={setNotes}
          />

          <Text style={styles.label}>
            Severity
          </Text>

          <View style={styles.row}>
            {[
              { label: "Mild", value: "MILD" },
              { label: "Moderate", value: "MODERATE" },
              { label: "Severe", value: "SEVERE" },
              {
                label: "Anaphylaxis",
                value: "ANAPHYLAXIS",
              },
            ].map((item) => (
              <AppChip
                key={item.value}
                label={item.label}
                selected={severity === item.value}
                onPress={() =>
                  setSeverity(
                    item.value as AllergySeverity
                  )
                }
              />
            ))}
          </View>

          <AppButton
            title={
              editingAllergyId
                ? "Update Allergy"
                : "Add Allergy"
            }
            onPress={
              handleAddAllergy
            }
          />

                    {visit.history.allergyHistory.allergies.map(
            (allergy) => (
              <View
                key={allergy.id}
                style={styles.allergyCard}
              >
                <Text
                  style={
                    styles.allergyTitle
                  }
                >
                  {allergy.allergen}
                </Text>

                <Text
                  style={
                    styles.allergyText
                  }
                >
                  Type: {allergyTypeLabel(allergy.type)}
                </Text>

                {!!allergy.reaction && (
                  <Text
                    style={
                      styles.allergyText
                    }
                  >
                    Reaction:{" "}
                    {allergy.reaction}
                  </Text>
                )}

                {!!allergy.notes && (
                  <Text style={styles.allergyText}>
                    Notes: {allergy.notes}
                  </Text>
                )}

                <Text
                  style={
                    styles.allergyText
                  }
                >
                  Severity:{" "}
                  {allergySeverityLabel(
                    allergy.severity
                  )}
                </Text>

                <View
                  style={
                    styles.actionRow
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.iconButton
                    }
                    onPress={() => {
                      setEditingAllergyId(
                        allergy.id
                      );

                      setType(
                        allergy.type
                      );

                      setAllergen(
                        allergy.allergen
                      );

                      setReaction(
                        allergy.reaction ?? ""
                      );

                      setNotes(
                        allergy.notes ?? ""
                      );

                      setSeverity(
                        allergy.severity
                      );
                    }}
                  >
                    <MaterialIcons
                      name="edit"
                      size={22}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.iconButton
                    }
                    onPress={() =>
                      removeAllergy(
                        allergy.id
                      )
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  allergyCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
  },

  allergyTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  allergyText: {
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