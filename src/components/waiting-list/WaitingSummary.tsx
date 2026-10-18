import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

import AppCard from "@/components/common/AppCard";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

type Props = {
  waiting: number;
  withDoctor: number;
};

export default function WaitingSummary({
  waiting,
  withDoctor,
}: Props) {
  return (
    <AppView style={styles.container}>
      <AppCard style={styles.card}>
        <Ionicons
          name="time-outline"
          size={24}
          color={COLORS.primary}
        />

        <AppText style={styles.count}>
          {waiting}
        </AppText>

        <AppText style={styles.label}>
          Waiting
        </AppText>
      </AppCard>

      <AppCard style={styles.card}>
        <Ionicons
          name="medkit-outline"
          size={24}
          color={COLORS.primary}
        />

        <AppText style={styles.count}>
          {withDoctor}
        </AppText>

        <AppText style={styles.label}>
          With Doctor
        </AppText>
      </AppCard>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: SPACING.lg,
  },

  count: {
    marginTop: SPACING.sm,

    color: COLORS.text,

    fontSize: TYPOGRAPHY.heading,

    fontWeight: "700",
  },

  label: {
    marginTop: SPACING.xs,

    color: COLORS.secondaryText,

    fontSize: TYPOGRAPHY.small,

    fontWeight: "600",
  },
});