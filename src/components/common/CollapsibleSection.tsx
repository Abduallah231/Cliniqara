import { ReactNode, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import {
  BORDERS,
  COLORS,
  RADIUS,
  SHADOW,
  SIZING,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  title: string;

  children: ReactNode;

  icon?: ReactNode;

  defaultExpanded?: boolean;

  style?: StyleProp<ViewStyle>;
};

export default function CollapsibleSection({
  title,
  children,
  icon,
  defaultExpanded = false,
  style,
}: Props) {
  const [expanded, setExpanded] =
    useState(defaultExpanded);

  return (
    <View
      style={[
        styles.container,
        style,
      ]}
    >
      <Pressable
  style={styles.header}
  onPress={() => setExpanded(!expanded)}
>
  <View style={styles.left}>
    {icon}

    <Text style={styles.title}>
      {title}
    </Text>
  </View>

  <Ionicons
    name={
      expanded
        ? "chevron-up"
        : "chevron-down"
    }
    size={SIZING.iconMd}
    color={COLORS.secondaryText}
  />
</Pressable>

      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,

    borderRadius: RADIUS.xl,

    borderWidth: BORDERS.thin,

    borderColor: COLORS.border,

    marginBottom: SPACING.lg,

    overflow: "hidden",

    ...SHADOW,
  },

  header: {
    minHeight: SIZING.buttonHeight,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: SPACING.lg,
  },

  content: {
    padding: SPACING.lg,

    borderTopWidth: BORDERS.thin,

    borderTopColor: COLORS.border,
  },
  left: {
  flexDirection: "row",

  alignItems: "center",
},

title: {
  color: COLORS.text,

  fontSize: TYPOGRAPHY.body,

  fontWeight: "600",

  marginLeft: SPACING.sm,
},
});