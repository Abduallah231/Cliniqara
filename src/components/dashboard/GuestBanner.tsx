import AppCard from "@/components/common/AppCard";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "@/theme";

type Props = {
  onCreateAccount: () => void;
};

export default function GuestBanner({
  onCreateAccount,
}: Props) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="person-circle-outline"
          size={32}
          color={COLORS.primary}
        />

        <Text style={styles.title}>
          Guest Mode
        </Text>
      </View>

      <Text style={styles.description}>
        You're exploring Cliniqara without an account.
      </Text>

      <View style={styles.list}>
        <Text style={styles.item}>
          • Data is stored only on this device.
        </Text>

        <Text style={styles.item}>
          • Cloud sync is unavailable.
        </Text>

        <Text style={styles.item}>
          • Create an account to sync your data and join clinics.
        </Text>
      </View>

      <Pressable onPress={onCreateAccount}>
        <Text style={styles.link}>
          Create Free Account →
        </Text>
      </Pressable>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  description: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
  },

  list: {
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },

  item: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  link: {
    marginTop: SPACING.lg,
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.body,
  },
});