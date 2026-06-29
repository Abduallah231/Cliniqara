import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppChip from "@/components/common/AppChip";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function ExcretaAnalysis() {
  const [amount, setAmount] =
    useState("");

  const [color, setColor] =
    useState("");

  const [consistency, setConsistency] =
    useState("");

  const [odor, setOdor] =
    useState("");

  const [content, setContent] =
    useState<string[]>([]);

  const toggleContent = (
    value: string
  ) => {
    if (content.includes(value)) {
      setContent(
        content.filter(
          (item) => item !== value
        )
      );
    } else {
      setContent([
        ...content,
        value,
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Excreta Analysis
      </Text>

      <Text style={styles.sectionTitle}>
        Amount
      </Text>

      <View style={styles.row}>
        {[
          "Scanty",
          "Moderate",
          "Large",
          "Profuse",
          "Variable",
          "Unknown",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={amount === item}
            onPress={() =>
              setAmount(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Color
      </Text>

      <View style={styles.row}>
        {[
          "Clear",
          "White",
          "Yellow",
          "Green",
          "Brown",
          "Red",
          "Black",
          "Variable",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={color === item}
            onPress={() =>
              setColor(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Content
      </Text>

      <View style={styles.row}>
        {[
          "Mucus",
          "Pus",
          "Blood",
          "Food",
          "Clots",
          "Worms",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={content.includes(
              item
            )}
            onPress={() =>
              toggleContent(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Consistency
      </Text>

      <View style={styles.row}>
        {[
          "Watery",
          "Mucoid",
          "Thick",
          "Frothy",
          "Solid",
          "Variable",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              consistency === item
            }
            onPress={() =>
              setConsistency(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Odor
      </Text>

      <View style={styles.row}>
        {[
          "None",
          "Offensive",
          "Foul",
          "Sweet",
          "Variable",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={odor === item}
            onPress={() =>
              setOdor(item)
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.card,
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