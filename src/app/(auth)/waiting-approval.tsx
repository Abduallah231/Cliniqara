import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";


import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function WaitingApprovalScreen() {
  return (
    <AppSafeAreaView style={styles.container}>
      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppView style={styles.header}>
          <AppView style={styles.logo}>
            <Ionicons
              name="time"
              size={46}
              color={COLORS.warning}
            />
          </AppView>

          <AppText style={styles.title}>
            Verification Under Review
          </AppText>

          <AppText style={styles.subtitle}>
            Your verification request has been received and is currently under review.
          </AppText>
        </AppView>

        <AppCard style={styles.card}>
          <AppView style={styles.form}>
            <AppText style={styles.sectionTitle}>
              Verification Status
            </AppText>

            <AppView style={styles.statusCard}>
              <Ionicons
                name="time"
                size={24}
                color={COLORS.warning}
              />

              <AppText style={styles.statusText}>
                Pending Review
              </AppText>
            </AppView>

            <AppText style={styles.description}>
              Your account is currently being reviewed by our verification team.
              Once approved, you will be able to use all Cliniqara features.
            </AppText>

            <AppCard style={styles.infoCard}>
              <AppText style={styles.infoTitle}>
                While you wait
              </AppText>

              <AppView style={styles.infoItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <AppText style={styles.infoText}>
                  Your account will unlock automatically after approval.
                </AppText>
              </AppView>
            </AppCard>

            <AppButton
              title="Logout"
              variant="secondary"
              onPress={() =>
                router.replace("/(auth)/login")
              }
            />
          </AppView>
        </AppCard>
      </AppKeyboardAwareScrollView>
    </AppSafeAreaView>
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
