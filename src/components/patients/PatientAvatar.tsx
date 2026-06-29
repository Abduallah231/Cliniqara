import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    COLORS,
    SIZING,
    TYPOGRAPHY,
} from "@/theme";

type Props = {
  fullName: string;

  size?: "sm" | "md" | "lg";

  color?: string;
};

export default function PatientAvatar({
  fullName,
  size = "md",
  color = COLORS.primary,
}: Props) {
  const initials = getInitials(fullName);

  const avatarSize = getAvatarSize(size);

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: `${color}15`,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color,
            fontSize: avatarSize * 0.38,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

function getAvatarSize(
  size: "sm" | "md" | "lg"
) {
  switch (size) {
    case "sm":
      return SIZING.avatarSm;

    case "lg":
      return SIZING.avatarLg;

    default:
      return SIZING.avatarMd;
  }
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(" ")
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    justifyContent: "center",
  },

  text: {
    fontWeight: "700",

    fontSize: TYPOGRAPHY.body,
  },
});