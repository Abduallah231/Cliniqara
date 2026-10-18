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

export default function RenalSystem() {
  const {
    visit,
    updateRelatedSystem,
  } = useVisitStore();

  const system =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "RENAL"
    );

  const selected = system?.symptoms ?? [];
  const otherFinding = system?.otherFinding ?? "";

  const toggle = (item: string) => {
    const symptoms = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystem("RENAL", { symptoms });
  };

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: string[];
  }) => (
    <>
      <AppText style={styles.sectionTitle}>{title}</AppText>

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
      <AppText style={styles.title}>Renal</AppText>

      <Section
        title="Core"
        items={[
          "Dysuria",
          "Frequency",
          "Urgency",
          "Haematuria",
          "Incontinence",
          "Retention",
        ]}
      />

      <Section
        title="LUTS"
        items={[
          "Nocturia",
          "Hesitancy",
          "Weak Stream",
          "Straining",
          "Dribbling",
          "Incomplete Emptying",
        ]}
      />

      <Section
        title="Urine"
        items={[
          "Polyuria",
          "Oliguria",
          "Anuria",
          "Cloudy Urine",
          "Dark Urine",
          "Foul Smell",
        ]}
      />

      <Section
        title="Pain"
        items={[
          "Loin Pain",
          "Renal Colic",
          "Suprapubic Pain",
        ]}
      />

      <Section
        title="Renal / Systemic"
        items={[
          "Edema",
          "Pruritus",
        ]}
      />

      <Section
        title="Uremic Symptoms"
        items={[
          "Loss Of Appetite",
          "Confusion",
          "Drowsiness",
        ]}
      />

      <Section
        title="Special"
        items={[
          "Pneumaturia",
          "Chyluria",
        ]}
      />

      <Section
        title="Male GU"
        items={[
          "Erectile Dysfunction",
          "Testicular Pain",
          "Urethral Discharge",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystem("RENAL", {
            otherFinding: text,
          })
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