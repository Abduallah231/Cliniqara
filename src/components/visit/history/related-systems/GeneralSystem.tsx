import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";
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
    toggleRelatedSystemSymptom,
    updateRelatedSystemOtherFinding,
  } = useVisitStore();

  const general =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "GENERAL"
    );

  const selectedSymptoms = general?.symptoms ?? [];
  const otherFinding = general?.otherFinding ?? "";

  const symptoms = [
    "Fever",
    "Chills / Rigors",
    "Weight Loss",
    "Appetite Change",
    "Malaise",
    "Fatigue",
    "Night Sweats",
  ];

  const toggleSymptom = (symptom: string) => {
    toggleRelatedSystemSymptom("GENERAL", symptom);
  };

  return (
    <AppView style={styles.container}>
      <AppText style={styles.title}>
        General / Constitutional
      </AppText>

      <AppView style={styles.row}>
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
      </AppView>

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemOtherFinding(
            "GENERAL",
            text
          )
        }
        multiline
      />
    </AppView>
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