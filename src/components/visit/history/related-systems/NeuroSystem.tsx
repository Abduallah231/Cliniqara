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

export default function NeuroSystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Neurology"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "NeurologyOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Neurology",
      "Neurology",
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
        Neurology
      </Text>
            <Section
        title="ICT"
        items={[
          "Headache",
          "Loss Of Consciousness",
          "Seizures",
          "Vomiting",
          "Blurring Of Vision",
        ]}
      />

      <Section
        title="Motor"
        items={[
          "Weakness",
          "Involuntary Movements",
          "Ataxia",
          "Unsteady Gait",
          "Incoordination",
        ]}
      />

      <Section
        title="Sensory"
        items={[
          "Numbness",
          "Tingling",
          "Neuropathic Pain",
          "Deep Sensation Loss",
          "Cortical Sensory Loss",
        ]}
      />

      <Section
        title="Autonomic"
        items={[
          "Bladder Dysfunction",
          "Bowel Dysfunction",
          "Sexual Dysfunction",
          "Postural Dizziness",
        ]}
      />

      <Section
        title="Cranial Nerves"
        items={[
          "Anosmia",
          "Visual Loss",
          "Color Vision Defect",
          "Visual Field Defect",
          "Diplopia",
          "Squint",
          "Ptosis",
          "Difficulty Chewing",
          "Dysphagia",
          "Facial Weakness",
          "Hearing Loss",
          "Vertigo",
          "Dysarthria",
          "Dysphasia",
        ]}
      />

      <Section
        title="Cognitive"
        items={[
          "Memory Loss",
          "Confusion",
          "Personality Change",
          "Behavioral Changes",
          "Reduced Concentration",
          "Sleep Disturbance",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemField(
            "NeurologyOther",
            "Neurology Other",
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