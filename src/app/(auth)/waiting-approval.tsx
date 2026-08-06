import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";

import { saveGuestSession } from "@/services/authStorage";

import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function WaitingApprovalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons
              name="time"
              size={46}
              color={COLORS.warning}
            />
          </View>

          <Text style={styles.title}>
            Verification Under Review
          </Text>

          <Text style={styles.subtitle}>
            Your verification request has been received and is currently under review.
          </Text>
        </View>

        <AppCard style={styles.card}>
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>
              Verification Status
            </Text>

            <View style={styles.statusCard}>
              <Ionicons
                name="time"
                size={24}
                color={COLORS.warning}
              />

              <Text style={styles.statusText}>
                Pending Review
              </Text>
            </View>

            <Text style={styles.description}>
              Your account is currently being reviewed by our verification team.
              Once approved, you will be able to use all Cliniqara features.
            </Text>

            <AppCard style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                While you wait
              </Text>

              <View style={styles.infoItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <Text style={styles.infoText}>
                  You can continue using Cliniqara in Guest Mode.
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <Text style={styles.infoText}>
                  Your account will unlock automatically after approval.
                </Text>
              </View>
            </AppCard>

            <AppButton
              title="Continue as Guest"
              onPress={async () => {
                await saveGuestSession();
                router.replace("/(app)");
              }}
            />

            <AppButton
              title="Logout"
              variant="secondary"
              onPress={() =>
                router.replace("/(auth)/login")
              }
            />
          </View>
        </AppCard>
      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: SPACING.sm,
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 22,
  },

  card: {
    ...SHADOW,
  },

  form: {
    gap: SPACING.lg,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statusText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  description: {
    color: COLORS.secondaryText,
    lineHeight: 22,
  },

  infoCard: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    gap: SPACING.md,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },

  infoText: {
    flex: 1,
    color: COLORS.secondaryText,
    lineHeight: 22,
  },
});            