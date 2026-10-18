import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useVisitStore } from "@/store/visitStore";
import { StyleSheet } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function ChestSystem() {
  const {
    visit,
    updateRelatedSystem,
  } = useVisitStore();

  const system =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "CHEST"
    );

  const selected = system?.symptoms ?? [];
  const otherFinding = system?.otherFinding ?? "";

  const toggle = (item: string) => {
    const symptoms = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystem("CHEST", {
      symptoms,
    });
  };

  const updateOtherFinding = (text: string) => {
    updateRelatedSystem("CHEST", {
      otherFinding: text,
    });
  };

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: string[];
  }) => (
    <>
      <AppText style={styles.sectionTitle}>
        {title}
      </AppText>

      <AppView style={styles.row}>
        {items.map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={selected.includes(item)}
            onPress={() => toggle(item)}
          />
        ))}
      </AppView>
    </>
  );

  return (
    <AppView style={styles.container}>
      <AppText style={styles.title}>
        Chest
      </AppText>

      <Section
        title="Core"
        items={[
          "Cough",
          "Dyspnea",
          "Orthopnea",
          "PND",
          "Chest Pain",
          "Expectoration",
          "Haemoptysis",
        ]}
      />

      <Section
        title="Airway"
        items={[
          "Wheeze",
          "Stridor",
          "Noisy Breathing",
        ]}
      />

      <Section
        title="Constitutional"
        items={[
          "Exercise Intolerance",
        ]}
      />

      <Section
        title="Upper Airway"
        items={[
          "Hoarseness",
          "Sore Throat",
          "Nasal Discharge",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={updateOtherFinding}
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

  sectionTitle: {
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