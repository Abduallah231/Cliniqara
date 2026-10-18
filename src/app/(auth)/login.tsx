import AppPressable from "@/components/common/AppPressable";
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
  COLORS, SHADOW, SPACING, TYPOGRAPHY, } from "@/theme";
import { Alert } from "react-native";
import { login } from "@/services/authApi";
import { getErrorMessage } from "@/services/errorHandler";

export default function LoginScreen() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await login(
        email.trim(),
        password
      );

      const status = result.user.verificationStatus;

      switch (status) {
        case "APPROVED":
          router.replace("/splash");
          break;

        case "PENDING":
          router.replace("/(auth)/waiting-approval");
          break;

        case "REJECTED":
          router.replace("/(auth)/verification-failed");
          break;

        default:
          Alert.alert("Error", "Unknown verification status");
      }
    } catch (error) {
      Alert.alert(
        "Login Failed",
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppView style={styles.logoSection}>
          <AppView style={styles.logoCircle}>
            <Ionicons
              name="medical"
              size={42}
              color={COLORS.primary}
            />
          </AppView>

          <AppText style={styles.appName}>
            Cliniqara
          </AppText>

          <AppText style={styles.appSubtitle}>
            Smart Clinical Workflow
          </AppText>
        </AppView>

        <AppCard style={styles.card}>
          <AppText style={styles.title}>
            Welcome Back
          </AppText>

          <AppText style={styles.subtitle}>
            Sign in to continue
          </AppText>

          <AppView style={styles.form}>
            <AppTextField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <AppView>
              <AppTextField
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <AppPressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color={
                    COLORS.secondaryText
                  }
                />
              </AppPressable>
            </AppView>

            <AppView style={styles.optionsRow}>
              <AppPressable
                style={styles.rememberContainer}
                onPress={() =>
                  setRememberMe(
                    !rememberMe
                  )
                }
              >
                <Ionicons
                  name={
                    rememberMe
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={22}
                  color={COLORS.primary}
                />

                <AppText
                  style={
                    styles.rememberText
                  }
                >
                  Remember Me
                </AppText>
              </AppPressable>

              <AppPressable
                onPress={() =>
                  router.push("/(auth)/forgot-password")
                }
              >
                <AppText
                  style={
                    styles.forgotText
                  }
                >
                  Forgot Password?
                </AppText>
              </AppPressable>
            </AppView>

            <AppButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
            />

          </AppView>
        </AppCard>

        <AppView style={styles.footer}>
          <AppText style={styles.footerText}>
            Don't have an account?
          </AppText>

          <AppPressable
            onPress={() =>
              router.push("/(auth)/create-account")
            }
          >
            <AppText
              style={styles.createText}
            >
              Create Account
            </AppText>
          </AppPressable>

          <AppText style={styles.version}>
            Version 1.0.0
          </AppText>
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

  logoSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EEF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  appName: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.text,
  },

  appSubtitle: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
  },

  card: {
    ...SHADOW,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 4,
    marginBottom: SPACING.lg,
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  form: {
    gap: SPACING.md,
  },

  eyeButton: {
    position: "absolute",
    right: 14,
    bottom: 16,
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  rememberText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.small,
  },

  forgotText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.small,
  },
  
    footer: {
    marginTop: SPACING.xl,
    alignItems: "center",
    gap: SPACING.sm,
  },

  footerText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
  },

  createText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.primary,
  },

  version: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
});
