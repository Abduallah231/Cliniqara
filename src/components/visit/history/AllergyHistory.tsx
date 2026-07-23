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

export default function AllergyHistory() {
  const {
    visit,
    updateHasAllergy,
    addAllergy,
    updateAllergy,
    removeAllergy,
  } = useVisitStore();

  const [type, setType] =
    useState<AllergyType>("Drug");

  const [allergen, setAllergen] =
    useState("");

  const [reaction, setReaction] =
    useState("");

  const [severity, setSeverity] =
    useState<AllergySeverity>(
      "Moderate"
    );

  const [
    editingAllergyId,
    setEditingAllergyId,
  ] = useState<string | null>(
    null
  );

  const clearForm = () => {
    setType("Drug");
    setAllergen("");
    setReaction("");
    setSeverity("Moderate");
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
              .hasAllergy ===
            "Yes"
          }
          onPress={() =>
            updateHasAllergy("Yes")
          }
        />

        <AppChip
          label="No"
          selected={
            visit.history
              .allergyHistory
              .hasAllergy ===
            "No"
          }
          onPress={() =>
            updateHasAllergy("No")
          }
        />
      </View>

      {visit.history
        .allergyHistory
        .hasAllergy === "Yes" && (
        <>
          <Divider />

          <SectionHeader title="Type" />

          <View style={styles.row}>
            {[
              "Drug",
              "Food",
              "Environmental",
              "Other",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  type === item
                }
                onPress={() =>
                  setType(
                    item as AllergyType
                  )
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

          <Text style={styles.label}>
            Severity
          </Text>

          <View style={styles.row}>
            {[
              "Mild",
              "Moderate",
              "Severe",
              "Anaphylaxis",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  severity === item
                }
                onPress={() =>
                  setSeverity(
                    item as AllergySeverity
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
                  Type: {allergy.type}
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

                <Text
                  style={
                    styles.allergyText
                  }
                >
                  Severity:{" "}
                  {allergy.severity}
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
                        allergy.reaction
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