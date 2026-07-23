import { StyleSheet, View } from "react-native";
import { useVisitStore } from "@/store/visitStore";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import chronicDiseases from "@/data/chronicDiseases";

export default function FamilyHistory() {
  const {
    visit,
    updateFamilyHistoryField,
  } = useVisitStore();

  const getValue = (fieldId: string) =>
    visit.history.familyHistory.fields.find(
      (field) => field.fieldId === fieldId
    )?.value ?? null;

  const updateField = (
    fieldId: string,
    fieldLabel: string,
    value: any
  ) => {
    updateFamilyHistoryField(
      fieldId,
      fieldLabel,
      value
    );
  };

  const toggleDisease = (
    disease: string
  ) => {
    const current =
      (getValue(
        "familyDiseases"
      ) as string[]) ?? [];

    if (current.includes(disease)) {
      updateFamilyHistoryField(
        "familyDiseases",
        "Family Diseases",
        current.filter(
          (d) => d !== disease
        )
      );
    } else {
      updateFamilyHistoryField(
        "familyDiseases",
        "Family Diseases",
        [...current, disease]
      );
    }
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Family Diseases" />

      <View style={styles.row}>
        {chronicDiseases.map((disease) => (
          <AppChip
            key={disease}
            label={disease}
            selected={(
              (getValue(
                "familyDiseases"
              ) as string[]) ?? []
            ).includes(disease)}
            onPress={() =>
              toggleDisease(disease)
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Other family disease..."
        value={
          (getValue(
            "otherDisease"
          ) as string) ?? ""
        }
        onChangeText={(v) =>
          updateField(
            "otherDisease",
            "Other Disease",
            v
          )
        }
      />

      <AppTextField
        placeholder="Affected family member"
        value={
          (getValue(
            "affectedMember"
          ) as string) ?? ""
        }
        onChangeText={(v) =>
          updateField(
            "affectedMember",
            "Affected Family Member",
            v
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
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
});