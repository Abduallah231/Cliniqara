import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type AllergyCardProps = {
  title: string;
  type: string;
  allergen: Record<string, string>;
  setAllergen: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  reaction: Record<string, string>;
  setReaction: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  severity: Record<string, string>;
  setSeverity: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
};

function AllergyCard({
  title,
  type,
  allergen,
  setAllergen,
  reaction,
  setReaction,
  severity,
  setSeverity,
}: AllergyCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {title}
      </Text>

      <AppTextField
        label="Allergen"
        placeholder="Allergen"
        value={allergen[type] ?? ""}
        onChangeText={(text) =>
          setAllergen((prev) => ({
            ...prev,
            [type]: text,
          }))
        }
      />

      <AppTextField
        label="Reaction"
        placeholder="Reaction"
        value={reaction[type] ?? ""}
        onChangeText={(text) =>
          setReaction((prev) => ({
            ...prev,
            [type]: text,
          }))
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
            selected={severity[type] === item}
            onPress={() =>
              setSeverity((prev) => ({
                ...prev,
                [type]: item,
              }))
            }
          />
        ))}
      </View>
    </View>
  );
}

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
  return (
    <View style={styles.container}>
<SectionHeader title="Any Allergy?" />
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
<SectionHeader title="Allergy Types" />
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
  allergen={allergen}
  setAllergen={setAllergen}
  reaction={reaction}
  setReaction={setReaction}
  severity={severity}
  setSeverity={setSeverity}
/>
          )}

          {selectedTypes.includes("Food") && (
            <AllergyCard
  title="Food Allergy"
  type="Food"
  allergen={allergen}
  setAllergen={setAllergen}
  reaction={reaction}
  setReaction={setReaction}
  severity={severity}
  setSeverity={setSeverity}
/>
          )}

          {selectedTypes.includes(
            "Environmental"
          ) && (
            <AllergyCard
              title="Environmental Allergy"
              type="Environmental"
  allergen={allergen}
  setAllergen={setAllergen}
  reaction={reaction}
  setReaction={setReaction}
  severity={severity}
  setSeverity={setSeverity}
            />
          )}

          {selectedTypes.includes("Other") && (
            <AllergyCard
              title="Other Allergy"
              type="Other"
              allergen={allergen}
              setAllergen={setAllergen}
              reaction={reaction}
              setReaction={setReaction}
              severity={severity}
              setSeverity={setSeverity}
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