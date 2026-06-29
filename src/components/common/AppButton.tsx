import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle
} from "react-native";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SIZING,
  SPACING,
  TYPOGRAPHY
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  type?: "primary" | "secondary" | "danger";

  icon?: keyof typeof Ionicons.glyphMap;

  loading?: boolean;

  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  type = "primary",
  icon,
  loading = false,
  disabled = false,
  style,
}: Props) {
  const isSecondary = type === "secondary";

  const iconColor = isSecondary
    ? COLORS.primary
    : COLORS.white;

  return (
    <Pressable
  onPress={onPress}
  disabled={disabled || loading}
  style={[
    styles.button,

    type === "primary" && styles.primary,

    type === "secondary" && styles.secondary,

    type === "danger" && styles.danger,

    disabled && styles.disabled,

    style,
  ]}
>
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={iconColor}
              style={styles.icon}
            />
          )}

          <Text
  style={[
    styles.text,

    isSecondary && styles.secondaryText,
  ]}
>
  {title}
</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: SIZING.buttonHeight,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    borderRadius: RADIUS.lg,

    paddingHorizontal: SPACING.xl,

    ...SHADOW,
  },

  primary: {
    backgroundColor: COLORS.primary,
  },

  secondary: {
    backgroundColor: COLORS.white,

    borderWidth: 1.5,

    borderColor: COLORS.primary,
  },

  danger: {
    backgroundColor: COLORS.danger,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: COLORS.white,

    fontSize: TYPOGRAPHY.body,

    fontWeight: "700",
  },

  secondaryText: {
    color: COLORS.primary,
  },

  icon: {
    marginRight: SPACING.sm,
  },
});