import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/common/AppCard";

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = COLORS.primary,
  style,
}: Props) {
  return (
    <AppCard style={[styles.card, style]}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${color}15`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={22}
            color={color}
          />
        </View>

        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </Text>
      </View>

      <Text style={styles.value}>
        {value}
      </Text>

      {!!subtitle && (
        <Text
          numberOfLines={1}
          style={styles.subtitle}
        >
          {subtitle}
        </Text>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 130,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },

  title: {
    flex: 1,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
  },

  value: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },

  subtitle: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.caption,
  },
});