import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";
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
    <AppView style={styles.container}>
      <Ionicons
        name="sparkles-outline"
        size={40}
        color={COLORS.primary}
      />

      <AppText style={styles.title}>
        No AI Suggestions Yet
      </AppText>

      <AppText style={styles.description}>
        Press "Generate AI Suggestions"
        to receive AI-assisted clinical
        recommendations including
        differential diagnoses,
        suggested investigations,
        procedures, and treatment
        options.
      </AppText>
    </AppView>
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