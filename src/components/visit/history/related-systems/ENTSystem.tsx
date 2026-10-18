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

export default function ENTSystem() {
  const {
    visit,
    updateRelatedSystem,
  } = useVisitStore();

  const system =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "ENT"
    );

  const selected = system?.symptoms ?? [];
  const otherFinding = system?.otherFinding ?? "";

  const toggle = (item: string) => {
    const symptoms = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystem("ENT", { symptoms });
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
      <AppText style={styles.title}>ENT</AppText>

      <Section
        title="Ear"
        items={[
          "Hearing Loss",
          "Tinnitus",
          "Vertigo",
          "Otalgia",
          "Otorrhea",
          "Ear Fullness",
        ]}
      />

      <Section
        title="Nose"
        items={[
          "Nasal Obstruction",
          "Mouth Breathing",
          "Rhinorrhea",
          "Post Nasal Drip",
          "Epistaxis",
          "Anosmia",
          "Hyposmia",
          "Sneezing",
          "Facial Pain",
        ]}
      />

      <Section
        title="Throat"
        items={[
          "Dysphagia",
          "Odynophagia",
          "Sore Throat",
          "Hoarseness",
          "Stridor",
          "Noisy Breathing",
        ]}
      />

      <Section
        title="Neck"
        items={[
          "Neck Swelling",
          "Neck Pain",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystem("ENT", {
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