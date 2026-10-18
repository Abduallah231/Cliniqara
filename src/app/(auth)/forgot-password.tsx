import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  return (
    <AppSafeAreaView style={styles.container}>
      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AppView style={styles.header}>
          <AppView style={styles.logo}>
            <Ionicons
              name="lock-open"
              size={40}
              color={COLORS.primary}
            />
          </AppView>

          <AppText style={styles.title}>
            Forgot Password
          </AppText>

          <AppText style={styles.subtitle}>
            Enter your email to receive a reset link.
          </AppText>
        </AppView>

        <AppCard style={styles.card}>
          <AppView style={styles.form}>
            <AppTextField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <AppButton
              title="Send Reset Link"
              onPress={() => {}}
            />
          </AppView>
        </AppCard>

        <AppView style={styles.footer}>
          <AppButton
            title="Back to Login"
            onPress={() => router.back()}
          />
        </AppView>
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
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#EEF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  card: {
    ...SHADOW,
  },

  form: {
    gap: SPACING.md,
  },

  footer: {
    marginTop: SPACING.xl,
  },
});