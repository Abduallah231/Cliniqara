import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/common/AppCard";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  doctorName: string;
  specialty: string;
  clinicName: string;
  style?: StyleProp<ViewStyle>;
};

export default function WelcomeCard({
  doctorName,
  specialty,
  clinicName,
  style,
}: Props) {
  return (
    <AppCard style={[styles.card, style]}>
      <AppText style={styles.greeting}>
        Welcome back
      </AppText>

      <AppText style={styles.name}>
        {doctorName}
      </AppText>

      <AppText style={styles.specialty}>
        {specialty}
      </AppText>

      <AppView style={styles.clinicRow}>
        <Ionicons
          name="business-outline"
          size={20}
          color={COLORS.primary}
        />

        <AppText style={styles.clinicName}>
          {clinicName}
        </AppText>
      </AppView>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
  },

  greeting: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    marginBottom: SPACING.xs,
  },

  name: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
  },

  specialty: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    marginTop: SPACING.xs,
  },

  clinicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
  },

  clinicName: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },
});