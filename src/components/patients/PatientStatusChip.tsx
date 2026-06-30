import { StyleSheet, Text, View } from "react-native";

import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

export type PatientStatus =
  | "Active"
  | "Inactive"
  | "Waiting"
  | "In Visit"
  | "Completed"
  | "In Progress"
  | "Follow-up";

type Props = {
  status: PatientStatus;
};

const STATUS_COLORS = {
  Active: {
    background: "#DCFCE7",
    text: "#15803D",
  },

  Inactive: {
    background: "#F3F4F6",
    text: COLORS.secondaryText,
  },

  Waiting: {
    background: "#FEF3C7",
    text: "#B45309",
  },

  "In Visit": {
    background: "#DBEAFE",
    text: COLORS.primary,
  },

  Completed: {
    background: "#DCFCE7",
    text: "#15803D",
  },

  "In Progress": {
    background: "#DBEAFE",
    text: COLORS.primary,
  },

  "Follow-up": {
    background: "#F3E8FF",
    text: "#7E22CE",
  },
};

export default function PatientStatusChip({
  status,
}: Props) {
  const color = STATUS_COLORS[status];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color.background,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: color.text,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",

    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,

    borderRadius: RADIUS.pill,
  },

  text: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
  },
});