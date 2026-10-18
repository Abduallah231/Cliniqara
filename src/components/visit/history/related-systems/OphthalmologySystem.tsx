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

export default function OphthalmologySystem() {
  const {
    visit,
    updateRelatedSystem,
  } = useVisitStore();

  const system =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "OPHTHALMOLOGY"
    );

  const selected = system?.symptoms ?? [];
  const otherFinding = system?.otherFinding ?? "";

  const toggle = (item: string) => {
    const symptoms = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystem("OPHTHALMOLOGY", {
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
        Ophthalmology
      </AppText>

      <Section
        title="Core"
        items={[
          "Visual Disturbance",
          "Eye Pain",
          "Redness",
          "Discharge",
          "Photophobia",
        ]}
      />

      <Section
        title="Vision"
        items={[
          "Blurred Vision",
          "Diplopia",
          "Visual Field Loss",
        ]}
      />

      <Section
        title="Light"
        items={[
          "Photophobia",
          "Night Blindness",
        ]}
      />

      <Section
        title="Sensory"
        items={[
          "Foreign Body Sensation",
          "Burning",
          "Grittiness",
        ]}
      />

      <Section
        title="Tears"
        items={[
          "Epiphora",
          "Dry Eyes",
        ]}
      />

      <Section
        title="Retina"
        items={[
          "Floaters",
          "Flashes",
        ]}
      />

      <Section
        title="Structural"
        items={[
          "Proptosis",
          "Ptosis",
          "Squint",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystem("OPHTHALMOLOGY", {
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