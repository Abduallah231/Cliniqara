import { StyleSheet, Text, View } from "react-native";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({
  title,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.accent} />

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  accent: {
    width: 4,
    height: 24,
    borderRadius: 99,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },

  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },
});