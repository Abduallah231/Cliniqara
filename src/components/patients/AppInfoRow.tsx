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
  icon?: keyof typeof Ionicons.glyphMap;

  label: string;

  value: string;

  style?: StyleProp<ViewStyle>;
};

export default function PatientInfoRow({
  icon,
  label,
  value,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        {icon && (
          <Ionicons
            name={icon}
            size={SIZING.iconSm}
            color={COLORS.secondaryText}
            style={styles.icon}
          />
        )}

        <Text
          numberOfLines={1}
          style={styles.label}
        >
          {label}
        </Text>
      </View>

      <Text
        numberOfLines={1}
        style={styles.value}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    minHeight: 32,

    paddingVertical: 2,
  },

  left: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  icon: {
    marginRight: SPACING.sm,
  },

  label: {
    color: COLORS.secondaryText,

    fontSize: TYPOGRAPHY.small,

    flexShrink: 1,
  },

  value: {
    color: COLORS.text,

    fontSize: TYPOGRAPHY.body,

    fontWeight: "600",

    marginLeft: SPACING.md,

    textAlign: "right",

    flexShrink: 1,
  },
});