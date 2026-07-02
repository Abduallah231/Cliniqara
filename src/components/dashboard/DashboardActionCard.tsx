import {
  Pressable,
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
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Variant =
  | "primary"
  | "success"
  | "purple"
  | "orange"
  | "cyan"
  | "red";

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;

  variant?: Variant;

  fullWidth?: boolean;
  compact?: boolean;

  onPress?: () => void;

  style?: StyleProp<ViewStyle>;
};

export default function DashboardActionCard({
  title,
  subtitle,
  icon,
  variant = "primary",
  fullWidth = false,
  compact = false,
  onPress,
  style,
}: Props) {
  const theme = getVariant(variant);

  return (
    <Pressable
    onPress={onPress}
    style={[
        fullWidth
            ? { width: "100%" }
            : { flex: 1 },
    ]}
>
      <AppCard
        style={[
          styles.card,
          fullWidth && styles.fullWidth,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.circle1,
            {
              backgroundColor: theme.accent + "15",
            },
          ]}
        />

        <View
          style={[
            styles.circle2,
            {
              backgroundColor: theme.accent + "10",
            },
          ]}
        />

        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.accent + "18",
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={26}
              color={theme.accent}
            />
          </View>

          <View style={styles.textContainer}>
            <Text
              numberOfLines={compact ? 2 : 1}
              style={[
                styles.title,
                compact && styles.compactTitle,
                {
                  color: theme.accent,
                },
              ]}
            >
              {title}
            </Text>

            <Text
              numberOfLines={2}
              style={styles.subtitle}
            >
              {subtitle}
            </Text>
          </View>

          {!compact && (
            <Ionicons
              name="chevron-forward"
              size={28}
              color={theme.accent}
            />
          )}
        </View>
      </AppCard>
    </Pressable>
  );
}

function getVariant(type: Variant) {
  switch (type) {
    case "success":
      return {
        accent: "#16A34A",
        background: "#F5FFF8",
        border: "#D8F5DF",
      };

    case "purple":
      return {
        accent: "#6D4AFF",
        background: "#FBF8FF",
        border: "#EBDDFF",
      };

    case "orange":
      return {
        accent: "#F59E0B",
        background: "#FFF9EF",
        border: "#FFE4B5",
      };

    case "cyan":
      return {
        accent: "#0891B2",
        background: "#F1FDFF",
        border: "#CDEFF7",
      };

    case "red":
      return {
        accent: "#E11D48",
        background: "#FFF7F8",
        border: "#FFD6DF",
      };

    default:
      return {
        accent: COLORS.primary,
        background: "#F8FBFF",
        border: "#D8E8FF",
      };
  }
}
const styles = StyleSheet.create({
  card: {
    minHeight: 112,
    borderWidth: 1,
    overflow: "hidden",

    ...SHADOW,
},

  fullWidth: {
    width: "100%",
  },

  content: {
    flexDirection: "row",

    alignItems: "center",

    zIndex: 2,
  },

  iconContainer: {
    width: 56,

    height: 56,

    borderRadius: RADIUS.round,

    justifyContent: "center",

    alignItems: "center",
  },

  textContainer: {
    flex: 1,

    marginHorizontal: SPACING.md,
    flexShrink: 1,
    minWidth: 0,
  },

  title: {
    fontSize: TYPOGRAPHY.body,

    fontWeight: "700",
  },

  subtitle: {
    marginTop: SPACING.xs,

    fontSize: TYPOGRAPHY.small,

    color: COLORS.secondaryText,

    lineHeight: 18,
  },

  circle1: {
    position: "absolute",

    right: -28,

    top: -28,

    width: 120,

    height: 120,

    borderRadius: 60,
  },

  circle2: {
    position: "absolute",

    left: -22,

    bottom: -22,

    width: 70,

    height: 70,

    borderRadius: 35,
  },
  compactTitle: {
    fontSize: TYPOGRAPHY.small-1,
    lineHeight: 18,
  },
});