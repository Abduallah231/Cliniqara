import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  children: ReactNode;

  title?: string;

  style?: StyleProp<ViewStyle>;
};

export default function AppCard({
  children,
  title,
  style,
}: Props) {
  return (
    <AppView style={[styles.container, style]}>
      {title ? (
        <AppText style={styles.title}>
          {title}
        </AppText>
      ) : null}

      {children}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,

    borderRadius: RADIUS.xl,

    padding: SPACING.md,

    ...SHADOW,
  },

  title: {
    fontSize: TYPOGRAPHY.subHeading,

    fontWeight: "700",

    color: COLORS.text,

    marginBottom: SPACING.md,
  },
});