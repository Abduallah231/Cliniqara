import AppPressable from "@/components/common/AppPressable";
import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Alert, ActivityIndicator, Modal, StyleSheet } from "react-native";
import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import { useDoctorStore } from "@/store/doctorStore";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY
} from "@/theme";
import SessionService from "@/services/session.service";
import { AUTH_ENABLED } from "@/config/features";

import { useEffect, useState } from "react";
import { clearAppLockPin, saveAppLockPin } from "@/services/appLockPin";
import AppButton from "@/components/common/AppButton";
import { File, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as LocalAuthentication from "expo-local-authentication";
import {
  exportLocalRecordsBackup,
  restoreLocalRecordsBackup,
} from "@/services/localDatabase";
import { useAppSettingsStore, type AppSettings } from "@/store/appSettingsStore";

export default function SettingsScreen() {
  const theme = useAppSettingsStore((state) => state.theme);
  const fontSize = useAppSettingsStore((state) => state.fontSize);
  const appLock = useAppSettingsStore((state) => state.appLock);
  const biometric = useAppSettingsStore((state) => state.biometric);
  const preferencesHydrated = useAppSettingsStore((state) => state.hydrated);
  const hydratePreferences = useAppSettingsStore((state) => state.hydrate);
  const savePreferences = useAppSettingsStore((state) => state.updateSettings);
  const [dataAction, setDataAction] = useState(false);
  const [pinSetupStep, setPinSetupStep] = useState<"create" | "confirm" | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [pinSetupError, setPinSetupError] = useState("");

  useEffect(() => {
    void hydratePreferences().catch((error) => console.error("Unable to load settings:", error));
  }, [hydratePreferences]);

  const updatePreferences = async (updates: Partial<AppSettings>) => {
    try {
      await savePreferences(updates);
    } catch (error) {
      Alert.alert("Settings", "Could not save this setting on the device.");
      console.error("Unable to save settings:", error);
    }
  };

  const handleAppLockToggle = async () => {
    if (appLock) {
      Alert.alert("Turn off App Lock?", "Your PIN and biometric unlock setting will be removed.", [
        { text: "Cancel", style: "cancel" },
        { text: "Turn off", style: "destructive", onPress: () => void (async () => {
          await clearAppLockPin();
          await updatePreferences({ appLock: false, biometric: false });
        })() },
      ]);
      return;
    }
    setPinInput("");
    setFirstPin("");
    setPinSetupError("");
    setPinSetupStep("create");
  };

  const handleBiometricToggle = async () => {
    if (biometric) {
      await updatePreferences({ biometric: false });
      return;
    }
    if (!appLock) {
      Alert.alert("Turn on App Lock first", "Biometric unlock is used together with App Lock.");
      return;
    }
    const hardwareAvailable = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hardwareAvailable || !isEnrolled) {
      Alert.alert("Biometrics unavailable", "Set up fingerprint or Face ID on this device first.");
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Enable biometric unlock",
      disableDeviceFallback: true,
    });
    if (result.success) await updatePreferences({ biometric: true });
  };

  const handlePinSetupContinue = async () => {
    if (!/^\d{4}$/.test(pinInput)) {
      setPinSetupError("Enter exactly 4 numbers.");
      return;
    }
    if (pinSetupStep === "create") {
      setFirstPin(pinInput);
      setPinInput("");
      setPinSetupError("");
      setPinSetupStep("confirm");
      return;
    }
    if (pinInput !== firstPin) {
      setPinInput("");
      setPinSetupError("The PINs do not match. Enter the confirmation again.");
      return;
    }
    try {
      await saveAppLockPin(pinInput);
      await savePreferences({ appLock: true, biometric: false });
      setPinSetupStep(null);
      setPinInput("");
      setFirstPin("");
      Alert.alert("App Lock enabled", "Your 4-digit PIN is stored securely on this device.");
    } catch (error) {
      setPinSetupError("Could not save the PIN securely on this device.");
      console.error("Failed to save app PIN:", error);
    }
  };

  const startPinChange = () => {
    setPinInput("");
    setFirstPin("");
    setPinSetupError("");
    setPinSetupStep("create");
  };

  const handleBackupData = async () => {
    setDataAction(true);
    try {
      const backup = await exportLocalRecordsBackup();
      const file = new File(
        Paths.cache,
        `cliniqara-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
      );
      file.create();
      file.write(JSON.stringify(backup, null, 2));

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Backup ready", `Backup file created at ${file.uri}`);
        return;
      }
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: "Save or share Cliniqara backup",
      });
    } catch (error) {
      Alert.alert("Backup failed", "The local data could not be exported.");
      console.error("Failed to export local data:", error);
    } finally {
      setDataAction(false);
    }
  };

  const handleRestoreData = async () => {
    let waitingForConfirmation = false;
    setDataAction(true);
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/json"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (picked.canceled) return;

      const file = new File(picked.assets[0].uri);
      const backup = JSON.parse(await file.text()) as {
        format?: string;
        version?: number;
        records?: unknown[];
      };
      if (
        backup.format !== "cliniqara-local-records-backup" ||
        backup.version !== 1 ||
        !Array.isArray(backup.records)
      ) {
        throw new Error("Unsupported backup file.");
      }

      waitingForConfirmation = true;
      Alert.alert(
        "Replace local data?",
        `This replaces the current local records with ${backup.records.length} records from the backup.`,
        [
          { text: "Cancel", style: "cancel", onPress: () => setDataAction(false) },
          {
            text: "Restore",
            style: "destructive",
            onPress: () => {
              void (async () => {
                try {
                  const restoredCount = await restoreLocalRecordsBackup(backup);
                  useAppSettingsStore.setState({ hydrated: false });
                  await useAppSettingsStore.getState().hydrate();
                  Alert.alert("Restore complete", `${restoredCount} local records restored.`);
                  router.replace("/splash");
                } catch (error) {
                  Alert.alert("Restore failed", error instanceof Error ? error.message : "The backup could not be restored.");
                  console.error("Failed to restore local data:", error);
                } finally {
                  setDataAction(false);
                }
              })();
            },
          },
        ],
      );
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "Unsupported backup file.") {
        Alert.alert("Invalid backup", "Choose a supported Cliniqara JSON backup file.");
      } else {
        Alert.alert("Restore failed", "The selected backup could not be read.");
        console.error("Failed to read backup file:", error);
      }
    } finally {
      if (!waitingForConfirmation) setDataAction(false);
    }
  };

  const doctor = useDoctorStore(
    (state) => state.doctor
  );
  const handleLogout = async () => {
    await SessionService.clearSession();

    useDoctorStore
      .getState()
      .clearDoctor();

    router.replace("/splash");
  };
  return (
    <AppSafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Settings"
        onBack={() => router.back()}
      />

      <AppScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {!preferencesHydrated && (
          <ActivityIndicator color={COLORS.primary} />
        )}

        {AUTH_ENABLED && (
          <AppButton
            title="Logout"
            variant="secondary"
            onPress={handleLogout}
          />
        )}
        <SectionHeader title="Doctor Profile" />

        <AppCard>

          <AppTextField
            label="Full Name"
            value={doctor?.fullName ?? ""}
            editable={false}
          />

          <AppTextField
            label="Email"
            value={doctor?.email ?? ""}
            editable={false}
          />

          <AppTextField
            label="Phone Number"
            value={doctor?.phone ?? ""}
            editable={false}
          />

          <AppTextField
            label="Specialty"
            value={doctor?.specialty ?? ""}
            editable={false}
          />

          <AppTextField
            label="Professional Title"
            value={doctor?.professionalTitle ?? ""}
            editable={false}
          />

          <AppTextField
            label="Verification Status"
            value={doctor?.verificationStatus ?? ""}
            editable={false}
          />

        </AppCard>

        <AppButton
          title="Edit Doctor Profile"
          onPress={() =>
            router.push("/(app)/edit-profile")
          }
        />

        <SectionHeader title="Clinic" />

        <AppPressable
          onPress={() =>
            router.push(
              "/clinic-management"
            )
          }
        >
          <AppCard style={styles.row}>
            <AppView style={styles.left}>
              <Ionicons
                name="business-outline"
                size={22}
                color={COLORS.primary}
              />

              <AppText style={styles.title}>
                Clinic Management
              </AppText>
            </AppView>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                COLORS.secondaryText
              }
            />
          </AppCard>
        </AppPressable>

        <SectionHeader title="Appearance" />

        <AppCard style={styles.chips}>
          <AppChip
            label="Light"
            selected={theme === "Light"}
            onPress={() => void updatePreferences({ theme: "Light" })}
          />

          <AppChip
            label="Dark"
            selected={theme === "Dark"}
            onPress={() => void updatePreferences({ theme: "Dark" })}
          />

          <AppChip
            label="System"
            selected={theme === "System"}
            onPress={() => void updatePreferences({ theme: "System" })}
          />
        </AppCard>

        <SectionHeader title="Font Size" />

        <AppCard style={styles.chips}>
          <AppChip
            label="Small"
            selected={
              fontSize === "Small"
            }
            onPress={() => void updatePreferences({ fontSize: "Small" })}
          />

          <AppChip
            label="Medium"
            selected={
              fontSize === "Medium"
            }
            onPress={() => void updatePreferences({ fontSize: "Medium" })}
          />

          <AppChip
            label="Large"
            selected={
              fontSize === "Large"
            }
            onPress={() => void updatePreferences({ fontSize: "Large" })}
          />
        </AppCard>
                <SectionHeader title="Privacy & Security" />

        <AppCard>

          <AppPressable
            style={styles.settingRow}
            onPress={() => void handleAppLockToggle()}
          >
            <AppText style={styles.settingTitle}>
              App Lock
            </AppText>

            <AppText style={styles.settingValue}>
              {appLock ? "On" : "Off · Set PIN"}
            </AppText>
          </AppPressable>

          {appLock && (
            <AppPressable style={styles.settingRow} onPress={startPinChange}>
              <AppText style={styles.settingTitle}>Change 4-digit PIN</AppText>
              <AppText style={styles.settingValue}>Change</AppText>
            </AppPressable>
          )}

          <AppPressable
            style={styles.settingRow}
            onPress={() => void handleBiometricToggle()}
          >
            <AppText style={styles.settingTitle}>
              Biometric Unlock
            </AppText>

            <AppText style={styles.settingValue}>
              {biometric ? "On" : "Off"}
            </AppText>
          </AppPressable>

        </AppCard>

        <Modal
          transparent
          visible={pinSetupStep !== null}
          animationType="fade"
          onRequestClose={() => setPinSetupStep(null)}
        >
          <AppView style={styles.pinModalBackdrop}>
            <AppCard style={styles.pinModal}>
              <AppText style={styles.pinModalTitle}>
                {pinSetupStep === "create" ? "Create a 4-digit PIN" : "Confirm your PIN"}
              </AppText>
              <AppText style={styles.backupDescription}>
                {pinSetupStep === "create" ? "Use this PIN whenever you open the app." : "Enter the same 4 digits once more."}
              </AppText>
              <AppTextField
                label="4-digit PIN"
                value={pinInput}
                onChangeText={(value) => {
                  setPinInput(value.replace(/\D/g, "").slice(0, 4));
                  setPinSetupError("");
                }}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                autoFocus
              />
              {pinSetupError ? <AppText style={styles.pinSetupError}>{pinSetupError}</AppText> : null}
              <AppView style={styles.pinModalActions}>
                <AppButton title="Cancel" type="secondary" onPress={() => setPinSetupStep(null)} style={styles.pinModalAction} />
                <AppButton
                  title={pinSetupStep === "create" ? "Continue" : "Save PIN"}
                  onPress={() => void handlePinSetupContinue()}
                  style={styles.pinModalAction}
                />
              </AppView>
            </AppCard>
          </AppView>
        </Modal>

        <SectionHeader title="Data & Backup" />

        <AppCard>
          <AppText style={styles.backupDescription}>
            Backup includes the clinic and patient records saved on this device.
          </AppText>

          <AppPressable style={styles.row} onPress={() => void handleBackupData()} disabled={dataAction}>
            <AppView style={styles.left}>
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color={COLORS.primary}
              />

              <AppText style={styles.title}>{dataAction ? "Preparing backup..." : "Backup Data"}</AppText>
            </AppView>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                COLORS.secondaryText
              }
            />
          </AppPressable>

              <Divider />

          <AppPressable style={styles.row} onPress={() => void handleRestoreData()} disabled={dataAction}>
            <AppView style={styles.left}>
              <Ionicons
                name="cloud-download-outline"
                size={22}
                color={COLORS.primary}
              />

              <AppText style={styles.title}>{dataAction ? "Working..." : "Restore Data"}</AppText>
            </AppView>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                COLORS.secondaryText
              }
            />
          </AppPressable>

        </AppCard>

        <SectionHeader title="About" />

        <AppCard>

          <AppView
            style={styles.settingRow}
          >
            <AppText
              style={
                styles.settingTitle
              }
            >
              App Version
            </AppText>

            <AppText
              style={
                styles.settingValue
              }
            >
              1.0.0
            </AppText>
          </AppView>

          <Divider />

          <AppView
            style={styles.settingRow}
          >
            <AppText
              style={
                styles.settingTitle
              }
            >
              Developed By
            </AppText>

            <AppText
              style={
                styles.settingValue
              }
            >
              Cliniqara
            </AppText>
          </AppView>

        </AppCard>

      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  title: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "600",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    paddingVertical:
      SPACING.sm,
  },

  settingTitle: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "600",
  },

  settingValue: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.body,
  },

  backupDescription: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },

  pinModalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.lg,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  pinModal: { gap: SPACING.md },
  pinModalTitle: { color: COLORS.text, fontSize: TYPOGRAPHY.heading, fontWeight: "700" },
  pinSetupError: { color: COLORS.danger, fontSize: TYPOGRAPHY.small },
  pinModalActions: { flexDirection: "row", gap: SPACING.sm },
  pinModalAction: { flex: 1 },

});
