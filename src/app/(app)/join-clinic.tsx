import { useState } from "react";
import { router } from "expo-router";
import {
  Alert,
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

import { joinClinic } from "@/services/clinicApi";
import SessionService from "@/services/session.service";
import ClinicQrScanner from "@/components/clinic/ClinicQrScanner";

import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function JoinClinicScreen() {
  const [clinicCode, setClinicCode] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

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
              name="business"
              size={42}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            Join Clinic
          </Text>

          <Text style={styles.subtitle}>
            Enter the clinic code provided by
            your clinic administrator.
          </Text>
        </View>

        <AppCard style={styles.card}>
          <View style={styles.form}>

            <Text style={styles.sectionTitle}>
              Clinic Code
            </Text>

            <AppTextField
              label="Clinic Code"
              placeholder="Example: CLN-4A92XZ"
              value={clinicCode}
              onChangeText={(text) => {
                setClinicCode(
                  text.toUpperCase()
                );
                setError("");
              }}
              autoCapitalize="characters"
            />

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}

            <AppButton
              title="Join Clinic"
              loading={loading}
              onPress={async () => {
                if (!clinicCode.trim()) {
                  setError("Enter the clinic code");
                  return;
                }

                try {
                  setLoading(true);
                  setError("");

                  await joinClinic(clinicCode);

                  Alert.alert(
                    "Request Sent",
                    "Your request to join the clinic is pending approval.",
                    [
                      {
                        text: "OK",
                        onPress: () => setClinicCode(""),
                      },
                    ],
                  );
                } catch (error: any) {
                  setError(
                    error?.response?.data?.message ??
                      "Unable to join the clinic.",
                  );
                } finally {
                  setLoading(false);
                }
              }}
            />

            <View style={styles.divider}>
              <View
                style={styles.dividerLine}
              />

              <Text
                style={styles.dividerText}
              >
                OR
              </Text>

              <View
                style={styles.dividerLine}
              />
            </View>

            <Pressable
              style={styles.qrCard}
              onPress={() => {
                setShowScanner(true);
                setError("");
              }}
            >
              <Ionicons
                name="qr-code-outline"
                size={64}
                color={COLORS.primary}
              />

              <Text
                style={styles.qrTitle}
              >
                Scan QR Code
              </Text>

              <Text
                style={styles.qrSubtitle}
              >
                Scan the QR code provided by
                your clinic.
              </Text>
            </Pressable>

            {showScanner && (
              <ClinicQrScanner
                onCodeScanned={async (code) => {
                  setShowScanner(false);

                  if (!code.trim()) {
                    setError("Invalid QR code");
                    return;
                  }

                  try {
                    setLoading(true);
                    setError("");

                    await joinClinic(code);

                    Alert.alert(
                      "Request Sent",
                      "Your request to join the clinic is pending approval.",
                    );
                  } catch (error: any) {
                    setError(
                      error?.response?.data?.message ??
                        "Unable to join the clinic.",
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            )}

            <AppCard style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="information-circle"
                  size={26}
                  color={COLORS.primary}
                />

                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>
                    What happens next?
                  </Text>

                  <Text style={styles.infoText}>
                    After submitting your
                    request, the clinic
                    administrator will review
                    and approve your access.
                  </Text>

                  <Text style={styles.infoText}>
                    You cannot access patient
                    records until your request
                    is approved.
                  </Text>
                </View>
              </View>
            </AppCard>

            <Pressable
            style={styles.signOutButton}
            onPress={async () => {
              await SessionService.logout();
              router.replace("/login");
            }}
            >
            <Ionicons
                name="log-out-outline"
                size={18}
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

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.sm,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },

  qrCard: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 36,
    alignItems: "center",
    gap: SPACING.md,
  },

  qrTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  qrSubtitle: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
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
});