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

export default function GITSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "GIT"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "GITOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "GIT",
      "GIT",
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
        GIT
      </Text>

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
          updateRelatedSystemField(
            "GITOther",
            "GIT Other",
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