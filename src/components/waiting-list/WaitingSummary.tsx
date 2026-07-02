import Ionicons from "@expo/vector-icons/Ionicons";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

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
    <View style={styles.container}>
      <AppCard style={styles.card}>
        <Ionicons
          name="time-outline"
          size={24}
          color={COLORS.primary}
        />

        <Text style={styles.count}>
          {waiting}
        </Text>

        <Text style={styles.label}>
          Waiting
        </Text>
      </AppCard>

      <AppCard style={styles.card}>
        <Ionicons
          name="medkit-outline"
          size={24}
          color={COLORS.primary}
        />

        <Text style={styles.count}>
          {withDoctor}
        </Text>

        <Text style={styles.label}>
          With Doctor
        </Text>
      </AppCard>
    </View>
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