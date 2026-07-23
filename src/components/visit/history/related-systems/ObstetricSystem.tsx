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

export default function ObstetricSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Obstetric"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "ObstetricOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Obstetric",
      "Obstetric",
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
        Obstetric
      </Text>
            <Section
        title="Core"
        items={[
          "Amenorrhea",
          "Nausea",
          "Vomiting",
          "Breast Changes",
          "Fatigue",
        ]}
      />

      <Section
        title="Early Pregnancy"
        items={[
          "Morning Sickness",
          "Urinary Frequency",
          "Vaginal Discharge",
          "Food Cravings",
        ]}
      />

      <Section
        title="Late Pregnancy"
        items={[
          "Back Pain",
          "Dyspnea",
          "Edema",
          "Constipation",
        ]}
      />

      <Section
        title="Fetal"
        items={[
          "Quickening",
          "Reduced Fetal Movement",
        ]}
      />

      <Section
        title="Red Flags"
        items={[
          "Vaginal Bleeding",
          "Severe Pain",
          "Fluid Leakage",
          "Headache",
          "Visual Symptoms",
        ]}
      />

      <Section
        title="Labor"
        items={[
          "Contractions",
          "Show",
          "ROM",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemField(
            "ObstetricOther",
            "Obstetric Other",
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