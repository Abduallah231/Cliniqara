import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { useVisitStore } from "@/store/visitStore";

export default function GeneralSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selectedSymptoms =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "General"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "GeneralOther"
    )?.value as string) ?? "";

  const symptoms = [
    "Fever",
    "Chills / Rigors",
    "Weight Loss",
    "Appetite Change",
    "Malaise",
    "Fatigue",
    "Night Sweats",
  ];

  const toggleSymptom = (
    symptom: string
  ) => {
    const updated =
      selectedSymptoms.includes(symptom)
        ? selectedSymptoms.filter(
            (item) => item !== symptom
          )
        : [
            ...selectedSymptoms,
            symptom,
          ];

    updateRelatedSystemField(
      "General",
      "General",
      updated
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        General / Constitutional
      </Text>

      <View style={styles.row}>
        {symptoms.map((symptom) => (
          <AppChip
            key={symptom}
            label={symptom}
            selected={selectedSymptoms.includes(
              symptom
            )}
            onPress={() =>
              toggleSymptom(symptom)
            }
          />
        ))}
      </View>

            <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemField(
            "GeneralOther",
            "General Other",
            text
          )
        }
        multiline
      />
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

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },
});