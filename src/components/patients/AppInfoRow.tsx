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
    <AppView style={[styles.container, style]}>
      <AppView style={styles.left}>
        {icon && (
          <Ionicons
            name={icon}
            size={SIZING.iconSm}
            color={COLORS.secondaryText}
            style={styles.icon}
          />
        )}

        <AppText
          numberOfLines={1}
          style={styles.label}
        >
          {label}
        </AppText>
      </AppView>

      <AppText
        numberOfLines={1}
        style={styles.value}
      >
        {value}
      </AppText>
    </AppView>
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