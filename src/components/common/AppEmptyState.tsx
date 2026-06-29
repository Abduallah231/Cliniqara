import {
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

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
    <View
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

      <Text style={styles.title}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
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