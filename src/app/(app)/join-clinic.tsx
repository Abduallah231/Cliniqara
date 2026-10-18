import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import ClinicQrScanner from "@/components/clinic/ClinicQrScanner";
import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTextField from "@/components/common/AppTextField";

import {
  getMyMembershipRequests,
  joinClinic,
} from "@/services/clinicApi";

import SessionService from "@/services/session.service";
import { AUTH_ENABLED } from "@/config/features";

import type { MyMembershipRequest } from "@/types/clinic";

import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function JoinClinicScreen() {
  const [clinicCode, setClinicCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] =
    useState(false);
  const [refreshing, setRefreshing] =
  useState(false);
  const [error, setError] = useState("");

  const [showScanner, setShowScanner] =
    useState(false);

  const [pendingRequests, setPendingRequests] =
    useState<MyMembershipRequest[]>([]);

  const loadPendingRequests = useCallback(
    async () => {
      try {
        setLoadingRequests(true);

        const requests =
          await getMyMembershipRequests();

        setPendingRequests(requests);
      } catch {
        setPendingRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    },
    [],
  );

  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }

    try {
      setRefreshing(true);
      await loadPendingRequests();
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPendingRequests();
    }, [loadPendingRequests]),
  );

  const handleJoinRequest = async () => {
    const code = clinicCode.trim();

    if (!code) {
      setError("Enter the clinic join code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await joinClinic(code);

      await loadPendingRequests();

      setClinicCode("");

      Alert.alert(
        "Request Sent",
        "Your request to join the clinic is now pending approval.",
      );
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
          "Unable to send your join request.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await SessionService.logout();
    router.replace("/login");
  };

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
              name="business"
              size={42}
              color={COLORS.primary}
            />
          </AppView>

          <AppText style={styles.title}>
            Join Clinic
          </AppText>

          <AppText style={styles.subtitle}>
            Enter the temporary join code provided
            by your clinic administrator.
          </AppText>
        </AppView>

        <AppCard style={styles.card}>
          <AppView style={styles.form}>
            <AppText style={styles.sectionTitle}>
              Clinic Join Code
            </AppText>

            <AppTextField
              label="Join Code"
              placeholder="Example: CLN-4A92XZ"
              value={clinicCode}
              onChangeText={(text) => {
                setClinicCode(text.toUpperCase());
                setError("");
              }}
              autoCapitalize="characters"
              editable={!loading}
            />

            {error ? (
              <AppText style={styles.error}>
                {error}
              </AppText>
            ) : null}

            <AppButton
              title="Request to Join"
              loading={loading}
              onPress={handleJoinRequest}
            />

            <AppPressable
              style={styles.scanButton}
              onPress={() => {
                setError("");
                setShowScanner(true);
              }}
              disabled={loading}
            >
              <Ionicons
                name="qr-code-outline"
                size={22}
                color={COLORS.primary}
              />

              <AppText style={styles.scanButtonText}>
                Scan QR Code
              </AppText>
            </AppPressable>

            {showScanner && (
              <ClinicQrScanner
                onCodeScanned={async (code) => {
                  setShowScanner(false);

                  const scannedCode =
                    code.trim().toUpperCase();

                  if (!scannedCode) {
                    setError("Invalid QR code.");
                    return;
                  }

                  try {
                    setLoading(true);
                    setError("");

                    await joinClinic(scannedCode);

                    await loadPendingRequests();

                    Alert.alert(
                      "Request Sent",
                      "Your request to join the clinic is now pending approval.",
                    );
                  } catch (error: any) {
                    setError(
                      error?.response?.data?.message ??
                        "Unable to send your join request.",
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            )}

            <AppPressable
              style={styles.continueButton}
              onPress={() => router.replace("/")}
            >
              <Ionicons
                name="arrow-forward-circle-outline"
                size={20}
                color={COLORS.primary}
              />

              <AppText style={styles.continueText}>
                Continue to App
              </AppText>
            </AppPressable>
          </AppView>
        </AppCard>

        {pendingRequests.length > 0 && (
          <AppView style={styles.pendingSection}>
            <AppText style={styles.pendingSectionTitle}>
              Pending Requests
            </AppText>

            {pendingRequests.map((request) => (
              <AppCard
                key={request.id}
                style={styles.pendingCard}
              >
                <AppView style={styles.pendingRow}>
                  <AppView style={styles.pendingIcon}>
                    <Ionicons
                      name="business-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </AppView>

                  <AppView style={styles.pendingInfo}>
                    <AppText style={styles.clinicName}>
                      {request.clinic.name}
                    </AppText>

                    <AppText style={styles.clinicLocation}>
                      {request.clinic.city}
                    </AppText>

                    <AppText style={styles.pendingStatus}>
                      Pending approval
                    </AppText>
                  </AppView>
                </AppView>
              </AppCard>
            ))}
          </AppView>
        )}

        <AppCard style={styles.infoCard}>
          <AppView style={styles.infoRow}>
            <Ionicons
              name="information-circle"
              size={26}
              color={COLORS.primary}
            />

            <AppView style={styles.infoContent}>
              <AppText style={styles.infoTitle}>
                What happens next?
              </AppText>

              <AppText style={styles.infoText}>
                Your request will be sent to the
                clinic administrator for approval.
              </AppText>

              <AppText style={styles.infoText}>
                You cannot access clinic records
                until your request is approved.
              </AppText>
            </AppView>
          </AppView>
        </AppCard>

        {AUTH_ENABLED && (
          <AppPressable
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color={COLORS.danger}
            />

            <AppText style={styles.signOutText}>
              Sign Out
            </AppText>
          </AppPressable>
        )}
      </AppKeyboardAwareScrollView>

      <AppPressable
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={refreshing}
        hitSlop={8}
      >
        {refreshing ? (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />
        ) : (
          <Ionicons
            name="refresh"
            size={22}
            color="#FFFFFF"
          />
        )}
      </AppPressable>

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
    paddingBottom: SPACING.xxl,
    justifyContent: "center",
    gap: SPACING.lg,
  },

  header: {
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 8,
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
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

  error: {
    color: COLORS.danger,
    fontSize: 13,
  },

  continueButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: SPACING.md,
  },

  continueText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.body,
  },

  pendingSection: {
    gap: SPACING.sm,
  },

  pendingSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  pendingCard: {
    ...SHADOW,
  },

  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  pendingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
  },

  pendingInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  clinicName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  clinicLocation: {
    marginTop: 3,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
  },

  pendingStatus: {
    marginTop: 5,
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
  },

  infoCard: {
    backgroundColor: "#F8FBFF",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  infoText: {
    color: COLORS.secondaryText,
    lineHeight: 22,
    marginBottom: 6,
  },

  signOutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.md,
    gap: 8,
  },

  signOutText: {
    color: COLORS.danger,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.body,
  },

  refreshButton: {
    position: "absolute",
    right: 20,
    bottom: 24,

    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    elevation: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.25,
    shadowRadius: 5,

    zIndex: 100,
  },

  scanButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
  },

  scanButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.body,
  },
});
