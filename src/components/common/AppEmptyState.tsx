import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    COLORS,
    SIZING,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

type Props = {
  title: string;

  subtitle?: string;

  icon?: keyof typeof Ionicons.glyphMap;

  style?: StyleProp<ViewStyle>;
};

export default function AppEmptyState({
  title,
  subtitle,
  icon = "document-outline",
  style,
}: Props) {
  return (
    <AppView
      style={[
        styles.container,
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={SIZING.avatarLg}
        color={COLORS.primary}
      />

      <AppText style={styles.title}>
        {title}
      </AppText>

      {subtitle ? (
        <AppText style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    justifyContent: "center",

    paddingVertical: SPACING.xl,

    paddingHorizontal: SPACING.lg,
  },

  title: {
    marginTop: SPACING.lg,

    color: COLORS.text,

    fontSize: TYPOGRAPHY.subHeading,

    fontWeight: "700",
  },

  subtitle: {
    marginTop: SPACING.sm,

    color: COLORS.secondaryText,

    fontSize: TYPOGRAPHY.body,

    textAlign: "center",
  },
});