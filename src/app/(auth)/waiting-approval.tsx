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

import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected";

export default function WaitingApprovalScreen() {
  const [status, setStatus] =
    useState<ApprovalStatus>(
      "pending"
    );

  const [loading, setLoading] =
    useState(false);

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
              name={
                status === "approved"
                  ? "checkmark-circle"
                  : status === "rejected"
                  ? "close-circle"
                  : "time"
              }
              size={46}
              color={
                status === "approved"
                  ? "#16A34A"
                  : status === "rejected"
                  ? COLORS.danger
                  : "#F59E0B"
              }
            />
          </View>

          <Text style={styles.title}>
            {status === "approved"
              ? "Approved"
              : status === "rejected"
              ? "Request Rejected"
              : "Waiting for Approval"}
          </Text>

          <Text style={styles.subtitle}>
            {status === "approved"
              ? "Your account is now active."
              : status === "rejected"
              ? "Your request has been rejected."
              : "Your request has been sent successfully."}
          </Text>
        </View>

        <AppCard style={styles.card}>
          <View style={styles.form}>
                        <Text style={styles.sectionTitle}>
              Requested Clinic
            </Text>

            <View style={styles.clinicCard}>
              <Ionicons
                name="business"
                size={28}
                color={COLORS.primary}
              />

              <View style={styles.clinicInfo}>
                <Text style={styles.clinicName}>
                  El Salam Pediatric Clinic
                </Text>

                <Text style={styles.clinicAddress}>
                  Alexandria, Egypt
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Current Status
            </Text>

            <View
              style={[
                styles.statusCard,
                status === "approved" &&
                  styles.statusApproved,
                status === "rejected" &&
                  styles.statusRejected,
              ]}
            >
              <Ionicons
                name={
                  status === "approved"
                    ? "checkmark-circle"
                    : status === "rejected"
                    ? "close-circle"
                    : "time"
                }
                size={24}
                color={
                  status === "approved"
                    ? "#16A34A"
                    : status === "rejected"
                    ? COLORS.danger
                    : "#F59E0B"
                }
              />

              <Text
                style={styles.statusText}
              >
                {status === "approved"
                  ? "Approved"
                  : status === "rejected"
                  ? "Rejected"
                  : "Pending Approval"}
              </Text>
            </View>

            <Text style={styles.description}>
              {status === "approved"
                ? "Your account has been activated successfully. You can now access your clinic."
                : status === "rejected"
                ? "Your request was rejected by the clinic administrator. Please contact your administrator or submit another clinic code."
                : "The clinic administrator must approve your request before you can access patients and clinic data."}
            </Text>
                        <AppCard style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                What happens next?
              </Text>

              <View style={styles.infoItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.infoText}>
                  Your request has been sent successfully.
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.infoText}>
                  The clinic administrator will review your request.
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.infoText}>
                  Once approved, your account will be activated automatically.
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.infoText}>
                  You will receive a notification after approval.
                </Text>
              </View>
            </AppCard>

            {status === "pending" && (
              <AppButton
                title="Refresh Status"
                loading={loading}
                onPress={() => {}}
              />
            )}

            {status === "approved" && (
              <AppButton
                title="Go to Dashboard"
                onPress={() =>
                  router.replace("/(app)")
                }
              />
            )}

            {status === "rejected" && (
              <AppButton
                title="Join Another Clinic"
                onPress={() =>
                  router.replace("/join-clinic")
                }
              />
            )}

            <Pressable
              style={styles.signOutButton}
              onPress={() =>
                router.replace("/(auth)/login")
              }
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={COLORS.danger}
              />

              <Text style={styles.signOutText}>
                Sign Out
              </Text>
            </Pressable>

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
    backgroundColor: "#EEF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: SPACING.sm,
    color: COLORS.secondaryText,
    textAlign: "center",
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

  clinicCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 14,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  clinicInfo: {
    flex: 1,
  },

  clinicName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  clinicAddress: {
    color: COLORS.secondaryText,
    marginTop: 2,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 14,
    backgroundColor: "#FFF8E7",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },

  statusApproved: {
    backgroundColor: "#ECFDF5",
    borderColor: "#16A34A",
  },

  statusRejected: {
    backgroundColor: "#FEF2F2",
    borderColor: COLORS.danger,
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
    backgroundColor: "#F8FBFF",
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

  signOutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },

  signOutText: {
    color: COLORS.danger,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});