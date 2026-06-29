import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function AllergyHistory() {
  const [hasAllergy, setHasAllergy] =
    useState("No");

  const [selectedTypes, setSelectedTypes] =
    useState<string[]>([]);

  const [severity, setSeverity] =
    useState<Record<string, string>>({});

  const [allergen, setAllergen] =
    useState<Record<string, string>>({});

  const [reaction, setReaction] =
    useState<Record<string, string>>({});

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(
        selectedTypes.filter(
          (t) => t !== type
        )
      );
    } else {
      setSelectedTypes([
        ...selectedTypes,
        type,
      ]);
    }
  };

  const setAllergySeverity = (
    type: string,
    value: string
  ) => {
    setSeverity({
      ...severity,
      [type]: value,
    });
  };

  const AllergyCard = ({
    title,
    type,
  }: {
    title: string;
    type: string;
  }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {title}
      </Text>

      <AppTextField
        label="Allergen"
        placeholder="Allergen"
        value={allergen[type] ?? ""}
        onChangeText={(text) =>
          setAllergen({
            ...allergen,
            [type]: text,
          })
        }
      />

      <AppTextField
        label="Reaction"
        placeholder="Reaction"
        value={reaction[type] ?? ""}
        onChangeText={(text) =>
          setReaction({
            ...reaction,
            [type]: text,
          })
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
              severity[type] === item
            }
            onPress={() =>
              setAllergySeverity(
                type,
                item
              )
            }
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Any Allergy?
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={hasAllergy === "Yes"}
          onPress={() =>
            setHasAllergy("Yes")
          }
        />

        <AppChip
          label="No"
          selected={hasAllergy === "No"}
          onPress={() =>
            setHasAllergy("No")
          }
        />
      </View>

      {hasAllergy === "Yes" && (
        <>
          <Text style={styles.sectionTitle}>
            Allergy Types
          </Text>

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
                selected={selectedTypes.includes(
                  item
                )}
                onPress={() =>
                  toggleType(item)
                }
              />
            ))}
          </View>

          {selectedTypes.includes("Drug") && (
            <AllergyCard
              title="Drug Allergy"
              type="Drug"
            />
          )}

          {selectedTypes.includes("Food") && (
            <AllergyCard
              title="Food Allergy"
              type="Food"
            />
          )}

          {selectedTypes.includes(
            "Environmental"
          ) && (
            <AllergyCard
              title="Environmental Allergy"
              type="Environmental"
            />
          )}

          {selectedTypes.includes("Other") && (
            <AllergyCard
              title="Other Allergy"
              type="Other"
            />
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

  card: {
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
});