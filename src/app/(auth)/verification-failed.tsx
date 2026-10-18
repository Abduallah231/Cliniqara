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

export default function VerificationFailedScreen() {
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
              name="close-circle"
              size={46}
              color={COLORS.danger}
            />
          </AppView>

          <AppText style={styles.title}>
            Verification Failed
          </AppText>

          <AppText style={styles.subtitle}>
            Your verification request was rejected.
          </AppText>
        </AppView>

        <AppCard style={styles.card}>
          <AppView style={styles.form}>
            <AppText style={styles.sectionTitle}>
              Reason
            </AppText>

            <AppView style={styles.reasonCard}>
              <AppText style={styles.reasonText}>
                Your medical license image was unclear.
                Please upload a clear image and submit
                your verification again.
              </AppText>
            </AppView>

            <AppButton
              title="Edit & Resubmit"
              onPress={() =>
                router.replace("/(auth)/create-account")
              }
            />

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
    justifyContent: "center",
    padding: SPACING.lg,
  },

  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: SPACING.sm,
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  card: {
    ...SHADOW,
  },

  form: {
    gap: SPACING.lg,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.subHeading,
    fontWeight: "700",
    color: COLORS.text,
  },

  reasonCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
  },

  reasonText: {
    color: COLORS.secondaryText,
    lineHeight: 22,
    fontSize: TYPOGRAPHY.body,
  },
});