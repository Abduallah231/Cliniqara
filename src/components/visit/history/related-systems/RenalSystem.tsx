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

export default function RenalSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Renal"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "RenalOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Renal",
      "Renal",
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
        Renal
      </Text>
            <Section
        title="Core"
        items={[
          "Dysuria",
          "Frequency",
          "Urgency",
          "Haematuria",
          "Incontinence",
          "Retention",
        ]}
      />

      <Section
        title="LUTS"
        items={[
          "Nocturia",
          "Hesitancy",
          "Weak Stream",
          "Straining",
          "Dribbling",
          "Incomplete Emptying",
        ]}
      />

      <Section
        title="Urine"
        items={[
          "Polyuria",
          "Oliguria",
          "Anuria",
          "Cloudy Urine",
          "Dark Urine",
          "Foul Smell",
        ]}
      />

      <Section
        title="Pain"
        items={[
          "Loin Pain",
          "Renal Colic",
          "Suprapubic Pain",
        ]}
      />

      <Section
        title="Renal / Systemic"
        items={[
          "Edema",
          "Pruritus",
        ]}
      />

      <Section
        title="Uremic Symptoms"
        items={[
          "Loss Of Appetite",
          "Confusion",
          "Drowsiness",
        ]}
      />

      <Section
        title="Special"
        items={[
          "Pneumaturia",
          "Chyluria",
        ]}
      />

      <Section
        title="Male GU"
        items={[
          "Erectile Dysfunction",
          "Testicular Pain",
          "Urethral Discharge",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemField(
            "RenalOther",
            "Renal Other",
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