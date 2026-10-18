import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";

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
    <AppView style={styles.container}>
      <AppView style={styles.accent} />

      <AppText style={styles.title}>
        {title}
      </AppText>
    </AppView>
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