import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";

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
  title?: string;

  onBack?: () => void;

  onRightPress?: () => void;

  leftIcon?: keyof typeof Ionicons.glyphMap;

  rightIcon?: keyof typeof Ionicons.glyphMap;

  style?: StyleProp<ViewStyle>;
};

export default function AppTopBar({
  title = "Cliniqara",

  onBack,

  onRightPress,

  leftIcon = "arrow-back",

  rightIcon = "settings-outline",

  style,
}: Props) {
  return (
    <AppView style={[styles.container, style]}>
      <AppView style={styles.side}>
        {onBack ? (
          <AppPressable
            onPress={onBack}
            style={styles.button}
          >
            <Ionicons
              name={leftIcon}
              size={SIZING.iconLg}
              color={COLORS.primary}
            />
          </AppPressable>
        ) : null}
      </AppView>

      <AppText
        numberOfLines={1}
        style={styles.title}
      >
        {title}
      </AppText>

      <AppView style={styles.side}>
        {onRightPress ? (
          <AppPressable
            onPress={onRightPress}
            style={styles.button}
          >
            <Ionicons
              name={rightIcon}
              size={SIZING.iconLg}
              color={COLORS.primary}
            />
          </AppPressable>
        ) : null}
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SIZING.headerHeight,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: SPACING.lg,

    backgroundColor: COLORS.white,

    borderBottomWidth: BORDERS.thin,

    borderBottomColor: COLORS.border,

    ...SHADOW,
  },

  side: {
    width: 44,

    alignItems: "center",

    justifyContent: "center",
  },

  button: {
    width: SIZING.touchTarget,

    height: SIZING.touchTarget,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: RADIUS.pill,
  },

  title: {
    flex: 1,

    textAlign: "center",

    marginHorizontal: SPACING.md,

    color: COLORS.primary,

    fontSize: TYPOGRAPHY.heading,

    fontWeight: "700",
  },
});