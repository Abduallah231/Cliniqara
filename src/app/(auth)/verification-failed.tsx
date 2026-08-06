import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
              name="close-circle"
              size={46}
              color={COLORS.danger}
            />
          </View>

          <Text style={styles.title}>
            Verification Failed
          </Text>

          <Text style={styles.subtitle}>
            Your verification request was rejected.
          </Text>
        </View>

        <AppCard style={styles.card}>
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>
              Reason
            </Text>

            <View style={styles.reasonCard}>
              <Text style={styles.reasonText}>
                Your medical license image was unclear.
                Please upload a clear image and submit
                your verification again.
              </Text>
            </View>

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