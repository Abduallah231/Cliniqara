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

export default function ENTSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "ENT"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "ENTOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "ENT",
      "ENT",
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
        ENT
      </Text>
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
          updateRelatedSystemField(
            "ENTOther",
            "ENT Other",
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