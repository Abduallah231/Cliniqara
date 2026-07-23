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

export default function HematologySystem() {
  const {
    visit,
    updateRelatedSystemField,
  } = useVisitStore();

  const selected =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "Hematology"
    )?.value as string[]) ?? [];

  const otherFinding =
    (visit.history.hpi.relatedSystemSymptoms.fields.find(
      (f) => f.fieldId === "HematologyOther"
    )?.value as string) ?? "";

  const toggle = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];

    updateRelatedSystemField(
      "Hematology",
      "Hematology",
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
        Hematology
      </Text>
            <Section
        title="Anemia"
        items={[
          "Fatigue",
          "Pallor",
          "Dyspnea",
          "Palpitations",
          "Dizziness",
          "Syncope",
        ]}
      />

      <Section
        title="Bleeding"
        items={[
          "Easy Bruising",
          "Epistaxis",
          "Bleeding Gums",
          "Petechiae",
          "Purpura",
          "Heavy Menstrual Bleeding",
          "Hemarthrosis",
        ]}
      />

      <Section
        title="Thrombosis"
        items={[
          "DVT",
          "Pulmonary Embolism",
          "Recurrent Miscarriage",
        ]}
      />

      <Section
        title="Infection"
        items={[
          "Recurrent Infections",
          "Persistent Fever",
          "Mouth Ulcers",
        ]}
      />

      <Section
        title="Malignancy"
        items={[
          "Weight Loss",
          "Night Sweats",
          "Lymphadenopathy",
          "Bone Pain",
        ]}
      />

      <Section
        title="Hemolysis"
        items={[
          "Jaundice",
          "Dark Urine",
        ]}
      />

      <Section
        title="Transfusion History"
        items={[
          "Previous Blood Transfusion",
          "Transfusion Reaction",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={(text) =>
          updateRelatedSystemField(
            "HematologyOther",
            "Hematology Other",
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