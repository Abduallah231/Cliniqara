import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { ReactNode, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { StyleProp, StyleSheet, ViewStyle } from "react-native";

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

  keepMounted?: boolean;

  style?: StyleProp<ViewStyle>;
};

export default function CollapsibleSection({
  title,
  children,
  icon,
  defaultExpanded = false,
  keepMounted = false,
  style,
}: Props) {
  const [expanded, setExpanded] =
    useState(defaultExpanded);

  return (
    <AppView
      style={[
        styles.container,
        style,
      ]}
    >
      <AppPressable
  style={styles.header}
  onPress={() => setExpanded(!expanded)}
>
  <AppView style={styles.left}>
    {icon}

    <AppText style={styles.title}>
      {title}
    </AppText>
  </AppView>

  <Ionicons
    name={
      expanded
        ? "chevron-up"
        : "chevron-down"
    }
    size={SIZING.iconMd}
    color={COLORS.secondaryText}
  />
</AppPressable>

      {(expanded || keepMounted) && (
        <AppView
          style={[
            styles.content,
            !expanded && styles.hiddenContent,
          ]}
        >
          {children}
        </AppView>
      )}
    </AppView>
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
  hiddenContent: {
    display: "none",
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
