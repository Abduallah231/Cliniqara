import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function AISuggestionsSection() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="sparkles-outline"
        size={40}
        color={COLORS.primary}
      />

      <Text style={styles.title}>
        No AI Suggestions Yet
      </Text>

      <Text style={styles.description}>
        Press "Generate AI Suggestions"
        to receive AI-assisted clinical
        recommendations including
        differential diagnoses,
        suggested investigations,
        procedures, and treatment
        options.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  description: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 22,
  },
});