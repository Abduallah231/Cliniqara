import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

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
    <View style={[styles.container, style]}>
      {title ? (
        <Text style={styles.title}>
          {title}
        </Text>
      ) : null}

      {children}
    </View>
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