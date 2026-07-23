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

export default function OphthalmologySystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Ophthalmology"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "OphthalmologyOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Ophthalmology",
      "Ophthalmology",
      updated
    );
  };

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: string[];
  }) => (
    <>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.row}>
        {items.map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={selected.includes(item)}
            onPress={() => toggle(item)}
          />
        ))}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Ophthalmology
      </Text>
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
          updateRelatedSystemField(
            "OphthalmologyOther",
            "Ophthalmology Other",
            text
          )
        }
        multiline
      />
    </View>
  );}

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