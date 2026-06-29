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
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  doctorName: string;
  clinicName: string;
  style?: StyleProp<ViewStyle>;
};

export default function WelcomeCard({
  doctorName,
  clinicName,
  style,
}: Props) {
  return (
    <AppCard style={[styles.card, style]}>
      <Text style={styles.greeting}>
        Welcome back
      </Text>

      <Text style={styles.name}>
        {doctorName}
      </Text>

      <View style={styles.clinicRow}>
        <Ionicons
          name="business-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.clinicName}>
          {clinicName}
        </Text>
      </View>
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