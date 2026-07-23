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

export default function GynecologySystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Gynecology"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "GynecologyOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Gynecology",
      "Gynecology",
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
        Gynecology
      </Text>

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
          updateRelatedSystemField(
            "GynecologyOther",
            "Gynecology Other",
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