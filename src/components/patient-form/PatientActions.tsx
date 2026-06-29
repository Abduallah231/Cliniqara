import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function PatientActions() {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          router.replace("/visit/HistoryScreen")
        }
      >
        <Ionicons
          name="play-outline"
          size={20}
          color={COLORS.white}
        />

        <Text style={styles.primaryText}>
          Save & Start Visit
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          router.push("/existing-patients")
        }
      >
        <Ionicons
          name="save-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.secondaryText}>
          Save Patient
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  primaryButton: {
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  secondaryButton: {
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  primaryText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  secondaryText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});