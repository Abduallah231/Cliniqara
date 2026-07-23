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

export default function SkinSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Skin"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "SkinOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Skin",
      "Skin",
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
        Skin
      </Text>
            <Section
        title="Core"
        items={[
          "Rash",
          "Pruritus",
          "Skin Lesions",
          "Color Change",
        ]}
      />

      <Section
        title="Lesions"
        items={[
          "Macules",
          "Papules",
          "Nodules",
          "Vesicles",
          "Ulcers",
        ]}
      />

      <Section
        title="Color"
        items={[
          "Pallor",
          "Cyanosis",
          "Jaundice",
          "Hyperpigmentation",
          "Hypopigmentation",
        ]}
      />

      <Section
        title="Hair"
        items={[
          "Alopecia",
          "Hirsutism",
        ]}
      />

      <Section
        title="Nails"
        items={[
          "Nail Changes",
          "Deformity",
        ]}
      />

      <Section
        title="Sweat"
        items={[
          "Hyperhidrosis",
          "Anhidrosis",
        ]}
      />

      <Section
        title="Sensory"
        items={[
          "Pain",
          "Burning",
          "Tingling",
        ]}
      />

      <Section
        title="Inflammatory"
        items={[
          "Redness",
          "Swelling",
          "Warmth",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemField(
            "SkinOther",
            "Skin Other",
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