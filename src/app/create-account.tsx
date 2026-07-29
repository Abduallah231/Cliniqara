import { useState } from "react";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

type UserRole = "doctor" | "receptionist";

export default function CreateAccountScreen() {
  const [step, setStep] = useState(1);

  const [role, setRole] =
    useState<UserRole>("doctor");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [nationalId, setNationalId] =
    useState("");

  const [idFrontName, setIdFrontName] =
    useState("");

  const [idBackName, setIdBackName] =
    useState("");

  const [specialty, setSpecialty] =
    useState("");

  const [
    licenseNumber,
    setLicenseNumber,
  ] = useState("");

  const [
    experienceYears,
    setExperienceYears,
  ] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons
              name="person-add"
              size={42}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join Cliniqara
          </Text>
        </View>

        <AppCard style={styles.card}>
          <View style={styles.form}>
            {step === 1 && (
            <>
            <Text style={styles.sectionTitle}>
            Account Information
            </Text>

            <AppTextField
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            />

            <AppTextField
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            />

            <AppTextField
            label="Mobile Number"
            placeholder="Enter mobile number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            />

            <AppTextField
            label="Password"
            placeholder="Create password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
            showPassword
            ? "eye-off-outline"
            : "eye-outline"
            }
            onRightIconPress={() =>
            setShowPassword(!showPassword)
            }
            />

            <AppTextField
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            rightIcon={
            showConfirmPassword
            ? "eye-off-outline"
            : "eye-outline"
            }
            onRightIconPress={() =>
            setShowConfirmPassword(
            !showConfirmPassword
            )
            }
            />

            <AppButton
            title="Next"
            onPress={() => setStep(2)}
            />
            </>
            )}
            {step === 2 && (
            <>
            <Text style={styles.sectionTitle}>
            Identity Verification
            </Text>

            <AppTextField
            label="National ID Number"
            placeholder="Enter National ID"
            value={nationalId}
            onChangeText={setNationalId}
            keyboardType="number-pad"
            />

            <Pressable style={styles.uploadCard}>
            <View>
            <Text style={styles.uploadTitle}>
            National ID Front
            </Text>

            <Text style={styles.uploadSubtitle}>
            {idFrontName || "Choose Image"}
            </Text>
            </View>

            <Ionicons
            name="image-outline"
            size={28}
            color={COLORS.primary}
            />
            </Pressable>

            <Pressable style={styles.uploadCard}>
            <View>
            <Text style={styles.uploadTitle}>
            National ID Back
            </Text>

            <Text style={styles.uploadSubtitle}>
            {idBackName || "Choose Image"}
            </Text>
            </View>

            <Ionicons
            name="image-outline"
            size={28}
            color={COLORS.primary}
            />
            </Pressable>

            <View style={styles.buttonRow}>

            <AppButton
            title="Back"
            style={styles.flexButton}
            onPress={() => setStep(1)}
            />

            <AppButton
            title="Next"
            style={styles.flexButton}
            onPress={() => setStep(3)}
            />

            </View>
            </>
            )}
            {step === 3 && (
            <>
              <Text style={styles.sectionTitle}>
                Register As
              </Text>

              <View style={styles.roleContainer}>

                <Pressable
                  style={[
                    styles.roleCard,
                    role === "doctor" &&
                      styles.roleCardActive,
                  ]}
                  onPress={() =>
                    setRole("doctor")
                  }
                >
                  <Ionicons
                    name="medkit"
                    size={34}
                    color={
                      role === "doctor"
                        ? COLORS.primary
                        : COLORS.secondaryText
                    }
                  />

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      Doctor
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Clinical Access
                    </Text>
                  </View>

                  {role === "doctor" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.roleCard,
                    role === "receptionist" &&
                      styles.roleCardActive,
                  ]}
                  onPress={() =>
                    setRole("receptionist")
                  }
                >
                  <Ionicons
                    name="people"
                    size={34}
                    color={
                      role ===
                      "receptionist"
                        ? COLORS.primary
                        : COLORS.secondaryText
                    }
                  />

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      Receptionist
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Front Desk Access
                    </Text>
                  </View>

                  {role ===
                    "receptionist" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>
              </View>

              <View style={styles.buttonRow}>
                <AppButton
                  title="Back"
                  style={styles.flexButton}
                  onPress={() =>
                    setStep(2)
                  }
                />

                <AppButton
                  title="Next"
                  style={styles.flexButton}
                  onPress={() =>
                    role === "doctor"
                      ? setStep(4)
                      : setStep(5)
                  }
                />
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.sectionTitle}>
                Professional Information
              </Text>

              <AppTextField
                label="Specialty"
                placeholder="Enter your specialty"
                value={specialty}
                onChangeText={setSpecialty}
              />

              <AppTextField
                label="Medical License Number"
                placeholder="Optional"
                value={licenseNumber}
                onChangeText={
                  setLicenseNumber
                }
              />

              <AppTextField
                label="Years of Experience"
                placeholder="Optional"
                value={experienceYears}
                onChangeText={
                  setExperienceYears
                }
                keyboardType="number-pad"
              />

              <View style={styles.buttonRow}>
                <AppButton
                  title="Back"
                  style={styles.flexButton}
                  onPress={() =>
                    setStep(3)
                  }
                />

                <AppButton
                  title="Continue"
                  style={styles.flexButton}
                  onPress={() =>
                    setStep(5)
                  }
                />
              </View>
            </>
          )}

          {step === 5 && (
            <>
              <View style={styles.summaryCard}>
                <Ionicons
                  name="shield-checkmark"
                  size={42}
                  color={COLORS.primary}
                />

                <Text
                  style={styles.summaryTitle}
                >
                  Ready to Create Account
                </Text>

                <Text
                  style={
                    styles.summarySubtitle
                  }
                >
                  Review your information
                  then create your account.
                </Text>
              </View>

              <View style={styles.buttonRow}>
                <AppButton
                  title="Back"
                  style={styles.flexButton}
                  onPress={() =>
                    role === "doctor"
                      ? setStep(4)
                      : setStep(3)
                  }
                />

                <AppButton
                  title="Create Account"
                  style={styles.flexButton}
                  onPress={() => {}}
                />
              </View>

              <View style={styles.footer}>
                <Text
                  style={styles.footerText}
                >
                  Already have an account?
                </Text>

                <Pressable
                  onPress={() =>
                    router.back()
                  }
                >
                  <Text
                    style={styles.loginText}
                  >
                    Sign In
                  </Text>
                </Pressable>
              </View>
            </>
          )}

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
  },

  header: {
    alignItems: "center",
    marginVertical: SPACING.xl,
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
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
  },

  card: {
    ...SHADOW,
  },

  form: {
    gap: SPACING.md,
  },

  sectionTitle: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  uploadCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: SPACING.md,
    backgroundColor: COLORS.card,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  uploadSubtitle: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 13,
  },

  roleContainer: {
    gap: SPACING.md,
  },

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },

  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#EEF6FF",
  },

  roleContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  roleTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  roleSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.secondaryText,
  },

  summaryCard: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  },

  summaryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  summarySubtitle: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 22,
  },

  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },

  flexButton: {
    flex: 1,
  },

  footer: {
    marginTop: SPACING.xl,
    alignItems: "center",
    gap: SPACING.sm,
  },

  footerText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  loginText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.body,
  },
});