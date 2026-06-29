import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    COLORS,
    RADIUS,
    SIZING,
    SPACING,
    TYPOGRAPHY
} from "@/theme";

type Props = {
  label: string;

  selected?: boolean;

  disabled?: boolean;

  icon?: keyof typeof Ionicons.glyphMap;

  onPress?: () => void;

  style?: StyleProp<ViewStyle>;
};

export default function AppChip({
  label,
  selected = false,
  disabled = false,
  icon,
  onPress,
  style,
}: Props) {
  const iconColor = selected
    ? COLORS.white
    : COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,

        selected && styles.selected,

        disabled && styles.disabled,

        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={SIZING.iconSm}
          color={iconColor}
          style={styles.icon}
        />
      )}

      <Text
        style={[
          styles.label,

          selected && styles.selectedLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    minHeight: SIZING.chipHeight,

    paddingHorizontal: SPACING.lg,

    borderRadius: RADIUS.pill,

    borderWidth: 1,

    borderColor: COLORS.primary,

    backgroundColor: COLORS.white,
  },

  selected: {
    backgroundColor: COLORS.primary,
  },

  disabled: {
    opacity: 0.45,
  },

  icon: {
    marginRight: SPACING.sm,
  },

  label: {
    color: COLORS.primary,

    fontSize: TYPOGRAPHY.small,

    fontWeight: "600",
  },

  selectedLabel: {
    color: COLORS.white,
  },
});