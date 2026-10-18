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

export default function GITSystem() {
  const {
    visit,
    updateRelatedSystem,
  } = useVisitStore();

  const system =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "GIT"
    );

  const selected = system?.symptoms ?? [];
  const otherFinding = system?.otherFinding ?? "";

  const toggle = (item: string) => {
    const symptoms = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystem("GIT", { symptoms });
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
      <AppText style={styles.title}>GIT</AppText>

      <Section
        title="Core"
        items={[
          "Abdominal Pain",
          "Nausea",
          "Vomiting",
          "Dyspepsia",
        ]}
      />

      <Section
        title="Upper GI"
        items={[
          "Anorexia",
          "Dysphagia",
          "Odynophagia",
          "Water Brash",
          "Polyphagia",
          "Halitosis",
          "Hiccough",
          "Early Satiety",
          "Hematemesis",
          "Heartburn",
        ]}
      />

      <Section
        title="Lower GI"
        items={[
          "Diarrhea",
          "Constipation",
          "Bloating",
          "Tenesmus",
          "Urgency",
          "Incontinence",
        ]}
      />

      <Section
        title="Stool"
        items={[
          "Melena",
          "Hematochezia",
          "Mucus",
          "Steatorrhea",
          "Change In Caliber",
        ]}
      />

      <Section
        title="Hepatobiliary"
        items={[
          "RUQ Pain",
          "Jaundice",
          "Pruritus",
          "Ascites",
          "Dark Urine",
          "Pale Stool",
          "Leg Edema",
          "Sleep Reversal",
          "Easy Bruising",
          "Bleeding Tendency",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystem("GIT", {
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