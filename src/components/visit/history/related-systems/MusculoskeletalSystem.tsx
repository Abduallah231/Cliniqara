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

export default function MusculoskeletalSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Musculoskeletal"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "MusculoskeletalOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Musculoskeletal",
      "Musculoskeletal",
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
        Musculoskeletal
      </Text>

            <Section
        title="Core"
        items={[
          "Joint Pain",
          "Joint Swelling",
          "Stiffness",
          "Limited Movement",
        ]}
      />

      <Section
        title="Inflammatory"
        items={[
          "Morning Stiffness",
          "Warmth",
          "Redness",
        ]}
      />

      <Section
        title="Mechanical"
        items={[
          "Pain On Movement",
          "Crepitus",
          "Reduced Function",
        ]}
      />

      <Section
        title="Muscle"
        items={[
          "Myalgia",
          "Muscle Weakness",
          "Muscle Cramps",
          "Muscle Stiffness",
        ]}
      />

      <Section
        title="Spine"
        items={[
          "Back Pain",
          "Neck Pain",
          "Radicular Pain",
        ]}
      />

      <Section
        title="Functional"
        items={[
          "Reduced Mobility",
          "Difficulty Walking",
        ]}
      />

      <Section
        title="Peripheral Vascular"
        items={[
          "Claudication",
          "Rest Pain",
          "Cold Extremities",
          "Raynaud's Phenomenon",
        ]}
      />

      <Section
        title="Structural"
        items={[
          "Joint Deformity",
          "Instability",
          "Locking",
          "Clicking",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemField(
            "MusculoskeletalOther",
            "Musculoskeletal Other",
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