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

export default function GynecologySystem() {
  const {
    visit,
    updateRelatedSystem,
  } = useVisitStore();

  const system =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "GYNECOLOGY"
    );

  const selected = system?.symptoms ?? [];
  const otherFinding = system?.otherFinding ?? "";

  const toggle = (item: string) => {
    const symptoms = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystem("GYNECOLOGY", {
      symptoms,
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
        Gynecology
      </AppText>

      <Section
        title="Menstrual"
        items={[
          "Amenorrhea",
          "Oligomenorrhea",
          "Menorrhagia",
          "Dysmenorrhea",
          "Intermenstrual Bleeding",
          "Postcoital Bleeding",
        ]}
      />

      <Section
        title="Vaginal"
        items={[
          "Discharge",
          "Vaginal Itching",
          "Dryness",
          "Vulval Pain",
        ]}
      />

      <Section
        title="Pain"
        items={[
          "Pelvic Pain",
          "Dyspareunia",
        ]}
      />

      <Section
        title="Fertility"
        items={[
          "Subfertility",
        ]}
      />

      <Section
        title="Hormonal"
        items={[
          "Hirsutism",
          "Acne",
          "Galactorrhea",
          "Hot Flushes",
        ]}
      />

      <Section
        title="Structural"
        items={[
          "Pelvic Mass",
          "Pelvic Pressure",
          "Prolapse",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystem("GYNECOLOGY", {
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