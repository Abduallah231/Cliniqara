import { useState } from "react";
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

export default function EndocrineSystem() {
  const [selected, setSelected] =
    useState<string[]>([]);

  const [otherFinding, setOtherFinding] =
    useState("");

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(
        selected.filter(
          (x) => x !== item
        )
      );
    } else {
      setSelected([
        ...selected,
        item,
      ]);
    }
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
        Endocrine
      </Text>

      <Section
        title="Core"
        items={[
          "Weight Gain",
          "Appetite Change",
        ]}
      />

      <Section
        title="Diabetes"
        items={[
          "Polyuria",
          "Polydipsia",
          "Polyphagia",
          "Blurred Vision",
          "Recurrent Infections",
        ]}
      />

      <Section
        title="Hyperthyroidism"
        items={[
          "Heat Intolerance",
          "Palpitations",
          "Sweating",
          "Tremor",
          "Anxiety",
          "Irritability",
          "Diarrhea",
        ]}
      />

      <Section
        title="Hypothyroidism"
        items={[
          "Cold Intolerance",
          "Constipation",
          "Dry Skin",
          "Hair Loss",
          "Hoarseness",
          "Lethargy",
        ]}
      />

      <Section
        title="Pituitary"
        items={[
          "Headache",
          "Visual Disturbance",
          "Galactorrhea",
        ]}
      />

      <Section
        title="Adrenal"
        items={[
          "Easy Bruising",
          "Mood Changes",
          "Hyperpigmentation",
          "Postural Dizziness",
        ]}
      />

      <Section
        title="Female Reproductive"
        items={[
          "Amenorrhea",
          "Oligomenorrhea",
          "Reduced Libido",
          "Menorrhagia",
          "Hirsutism",
        ]}
      />

      <Section
        title="Male Reproductive"
        items={[
          "Reduced Libido",
          "Erectile Dysfunction",
        ]}
      />

      <Section
        title="Metabolic"
        items={[
          "Muscle Cramps",
          "Confusion",
        ]}
      />

      <AppTextField
        label="Other Findings"
        placeholder="Add other findings..."
        value={otherFinding}
        onChangeText={setOtherFinding}
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