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

export default function CVSSystem() {
  const {
    visit,
    toggleRelatedSystemSymptom,
    updateRelatedSystemOtherFinding,
  } = useVisitStore();

  const cvs =
    visit.history.hpi.relatedSystemSymptoms.systems.find(
      (item) => item.system === "CVS"
    );

  const selected = cvs?.symptoms ?? [];
  const otherFinding = cvs?.otherFinding ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    toggleRelatedSystemSymptom("CVS", item);
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
            selected={selected.includes(
              item
            )}
            onPress={() =>
              toggle(item)
            }
          />
        ))}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        CVS
      </Text>

            <Section
        title="Cardiac Symptoms"
        items={[
          "Chest Pain",
          "Dyspnea",
          "Orthopnea",
          "PND",
          "Palpitations",
          "Syncope / Presyncope",
        ]}
      />

      <Section
        title="Heart Failure / Volume"
        items={[
          "Peripheral Edema",
          "Weight Gain",
          "Exercise Intolerance",
          "Oliguria",
        ]}
      />

      <Section
        title="Cerebral Perfusion"
        items={[
          "Dizziness",
          "Light-headedness",
          "Blurring Of Vision",
        ]}
      />

      <Section
        title="Others"
        items={[
          "Cyanosis",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemOtherFinding(
            "CVS",
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