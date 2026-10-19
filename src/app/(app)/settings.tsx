import AppPressable from "@/components/common/AppPressable";
import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
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
import * as WebBrowser from "expo-web-browser";
import * as Clipboard from "expo-clipboard";
import {
  exportLocalRecordsBackup,
  restoreLocalRecordsBackup,
} from "@/services/localDatabase";
import { useAppSettingsStore, type AppSettings } from "@/store/appSettingsStore";
import { deleteAIAPIKey, getAIAPIKey, saveAIAPIKey } from "@/services/aiClinicalSuggestionsApi";
import { SUGGESTED_GEMINI_ENDPOINT, SUGGESTED_GEMINI_MODEL } from "@/config/ai";

export default function SettingsScreen() {
  const params = useLocalSearchParams<{ aiSetup?: string }>();
  const theme = useAppSettingsStore((state) => state.theme);
  const fontSize = useAppSettingsStore((state) => state.fontSize);
  const savedAiModel = useAppSettingsStore((state) => state.aiModel);
  const savedAiEndpoint = useAppSettingsStore((state) => state.aiEndpoint);
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
  const [aiEndpoint, setAiEndpoint] = useState(savedAiEndpoint);
  const [aiModel, setAiModel] = useState(savedAiModel);
  const [aiKeyDraft, setAiKeyDraft] = useState("");
  const [aiKeyConfigured, setAiKeyConfigured] = useState(false);
  const [aiSettingsSaving, setAiSettingsSaving] = useState(false);

  useEffect(() => {
    void hydratePreferences().catch((error) => console.error("Unable to load settings:", error));
  }, [hydratePreferences]);

  useEffect(() => {
    setAiModel(savedAiModel);
  }, [savedAiModel]);

  useEffect(() => {
    setAiEndpoint(savedAiEndpoint);
  }, [savedAiEndpoint]);

  useEffect(() => {
    let active = true;
    void getAIAPIKey().then((key) => {
      if (active) setAiKeyConfigured(Boolean(key));
    }).catch((error) => console.error("Unable to read AI key status:", error));
    return () => { active = false; };
  }, []);

  const saveAISettings = async () => {
    if (!aiKeyDraft.trim() && !aiKeyConfigured) {
      Alert.alert("API key required", "Add an API key for your chosen AI service to enable suggestions.");
      return;
    }
    if (!aiEndpoint.trim() || !aiModel.trim()) {
      Alert.alert("AI settings incomplete", "Enter the service endpoint and model name.");
      return;
    }
    try {
      const endpoint = new URL(aiEndpoint.trim());
      if (endpoint.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      Alert.alert("Invalid endpoint", "Enter a complete API URL that starts with https://.");
      return;
    }
    setAiSettingsSaving(true);
    try {
      if (aiKeyDraft.trim()) await saveAIAPIKey(aiKeyDraft.trim());
      await savePreferences({ aiEndpoint: aiEndpoint.trim(), aiModel: aiModel.trim() });
      setAiKeyConfigured(Boolean(aiKeyDraft.trim()) || aiKeyConfigured);
      setAiKeyDraft("");
      if (params.aiSetup === "1") {
        router.back();
      } else {
        Alert.alert("AI settings saved", "The API key is stored securely on this device.");
      }
    } catch (error) {
      Alert.alert("Could not save AI settings", "Check device storage and try again.");
      console.error("Unable to save AI settings:", error);
    } finally {
      setAiSettingsSaving(false);
    }
  };

  const pasteAISettingsFromCurl = async () => {
    try {
      const copiedCommand = await Clipboard.getStringAsync();
      const parsed = parseAIConfigFromCurl(copiedCommand);
      setAiEndpoint(parsed.endpoint);
      setAiModel(parsed.model);
      setAiKeyDraft(parsed.apiKey);
      Alert.alert(
        parsed.apiKey ? "cURL settings loaded" : "Endpoint and model loaded",
        parsed.apiKey
          ? "The endpoint, model, and API key were filled in. Review them, then tap Save AI settings."
          : "This example contains a placeholder for its API key. Paste your real key into the API key field, then save.",
      );
    } catch (error) {
      Alert.alert(
        "Could not read AI settings",
        error instanceof Error ? error.message : "Copy the complete cURL example from your AI provider and try again.",
      );
    }
  };

  const removeAIKey = () => Alert.alert("Remove saved API key?", "AI suggestions will require a new key before they can be generated.", [
    { text: "Cancel", style: "cancel" },
    { text: "Remove", style: "destructive", onPress: () => void (async () => {
      try {
        await deleteAIAPIKey();
        setAiKeyConfigured(false);
        setAiKeyDraft("");
        Alert.alert("API key removed", "The key has been deleted from this device.");
      } catch (error) {
        Alert.alert("Could not remove API key", "Try again.");
        console.error("Unable to remove AI key:", error);
      }
    })() },
  ]);

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

      <SectionHeader title="AI Suggestions" />
        <AppCard style={styles.aiSettingsCard}>
          <AppText style={styles.backupDescription}>
            Configure an AI service by entering its API endpoint, model name, and API key. The key is stored securely on this device and is sent only when you generate suggestions.
          </AppText>
          <AppText style={styles.privacyNote}>
            Visit details are sent to the selected AI provider when you request suggestions. Patient name and code are excluded. Review that provider’s privacy and billing terms; do not send identifiable or sensitive patient information unless this use is permitted.
          </AppText>
          <AppCard style={styles.aiSuggestionCard}>
            <AppText style={styles.aiSuggestionTitle}>Free option suggestion: Gemini</AppText>
            <AppText style={styles.fieldHint}>
              Google AI Studio may offer a free usage tier with limits. Some models or higher usage may require paid billing. Google’s terms and data handling can differ by plan, so check them before sending clinical information.
            </AppText>
            <AppText style={styles.fieldHint}>Suggested endpoint: {SUGGESTED_GEMINI_ENDPOINT}</AppText>
            <AppText style={styles.fieldHint}>Suggested model: {SUGGESTED_GEMINI_MODEL}</AppText>
            <AppPressable style={styles.aiLinkRow} onPress={() => {
              void WebBrowser.openBrowserAsync("https://aistudio.google.com/api-keys");
            }}>
              <AppView style={styles.left}>
                <Ionicons name="open-outline" size={20} color={COLORS.primary} />
                <AppText style={styles.aiLinkText}>Get an API key for this option</AppText>
              </AppView>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryText} />
            </AppPressable>
          </AppCard>
          <AppButton title="Paste cURL command" type="secondary" onPress={() => void pasteAISettingsFromCurl()} />
          <AppText style={styles.fieldHint}>
            Paste a Gemini API or OpenAI-compatible chat-completions cURL example. API formats vary by provider. The app extracts its endpoint, model, and key; nothing is sent until you save and request suggestions.
          </AppText>
          <AppTextField
            label="AI API endpoint"
            value={aiEndpoint}
            onChangeText={setAiEndpoint}
            placeholder="https://your-provider.example/v1"
            autoCapitalize="none"
          />
          <AppText style={styles.fieldHint}>Use an HTTPS endpoint that supports a common chat-completions or content-generation format.</AppText>
          <AppTextField
            label="Model name"
            value={aiModel}
            onChangeText={setAiModel}
            placeholder="Enter your selected model ID"
            autoCapitalize="none"
          />
          <AppTextField
            label={aiKeyConfigured ? "Replace saved API key (optional)" : "API key"}
            value={aiKeyDraft}
            onChangeText={setAiKeyDraft}
            placeholder={aiKeyConfigured ? "A key is saved securely on this device" : "Paste your API key here"}
            secureTextEntry
            autoCapitalize="none"
          />
          <AppText style={styles.fieldHint}>
            The key is saved in secure device storage and is not included in the local database backup.
          </AppText>
          <AppButton
            title={params.aiSetup === "1" ? "Save and return to visit" : "Save AI settings"}
            onPress={() => void saveAISettings()}
            loading={aiSettingsSaving}
            disabled={aiSettingsSaving}
          />
          {aiKeyConfigured ? <AppPressable onPress={removeAIKey} style={styles.removeAIKey}>
            <AppText style={styles.removeAIKeyText}>Remove saved API key</AppText>
          </AppPressable> : null}
        </AppCard>

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

function parseAIConfigFromCurl(command: string): { endpoint: string; model: string; apiKey: string } {
  if (!command.trim()) throw new Error("The clipboard is empty. Copy the provider's complete cURL example first.");
  if (!/\bcurl\b/i.test(command)) throw new Error("The copied text does not look like a cURL command.");

  const urlMatch = command.match(/https:\/\/[^\s"'\\]+/i);
  if (!urlMatch) throw new Error("No HTTPS API URL was found in the cURL command.");
  let parsedURL: URL;
  try {
    parsedURL = new URL(urlMatch[0].replace(/[),]+$/, ""));
  } catch {
    throw new Error("The API URL in the cURL command is invalid.");
  }

  const headers = [...command.matchAll(/(?:^|\s)(?:-H|--header)\s+(['"])([\s\S]*?)\1/g)].map((match) => match[2]);
  let apiKey = "";
  for (const header of headers) {
    const separator = header.indexOf(":");
    if (separator < 0) continue;
    const name = header.slice(0, separator).trim().toLowerCase();
    let value = header.slice(separator + 1).trim();
    if (name === "authorization") value = value.replace(/^Bearer\s+/i, "");
    if (["x-goog-api-key", "x-api-key", "api-key", "authorization"].includes(name)) apiKey = value;
  }
  const queryKey = parsedURL.searchParams.get("key") ?? parsedURL.searchParams.get("api_key");
  if (!apiKey && queryKey) apiKey = queryKey;
  parsedURL.searchParams.delete("key");
  parsedURL.searchParams.delete("api_key");

  const dataMatch = command.match(/(?:--data(?:-raw|-binary)?|-d)\s+(['"])([\s\S]*?)\1/i);
  let requestBody: Record<string, unknown> = {};
  if (dataMatch) {
    const rawBody = dataMatch[2];
    try {
      requestBody = JSON.parse(rawBody);
    } catch {
      try {
        requestBody = JSON.parse(rawBody.replace(/\\(["'\\])/g, "$1"));
      } catch {
        throw new Error("The cURL request body is not valid JSON. Copy the full example command and try again.");
      }
    }
  }

  const modelInPath = parsedURL.pathname.match(/(?:^|\/)models\/([^/:?]+)/i)?.[1];
  const modelInBody = typeof requestBody.model === "string" ? requestBody.model : "";
  const model = decodeURIComponent(modelInPath ?? modelInBody).trim();
  if (!apiKey) throw new Error("No API key was found in the cURL headers or URL.");
  const keyIsPlaceholder = /^(?:\$[\w{}]+|<[^>]+>|YOUR[_ -]?API[_ -]?KEY|API[_ -]?KEY[_ -]?HERE)$/i.test(apiKey);
  if (!model) throw new Error("No model name was found. This command must include a model in its URL or JSON body.");

  const isGeminiAPI = parsedURL.hostname === "generativelanguage.googleapis.com";
  const hasChatCompletionsPath = parsedURL.pathname.replace(/\/+$/, "").endsWith("/chat/completions");
  const hasChatCompletionsBody = Array.isArray(requestBody.messages);
  if (!isGeminiAPI && !hasChatCompletionsPath && !hasChatCompletionsBody) {
    throw new Error("This API uses a format the app does not support yet. Use a Gemini generateContent or OpenAI-compatible chat-completions cURL example.");
  }

  const endpoint = isGeminiAPI
    ? parsedURL.origin
    : parsedURL.toString();
  return { endpoint, model, apiKey: keyIsPlaceholder ? "" : apiKey.replace(/\s+/g, "") };
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
  aiSettingsCard: { gap: SPACING.sm },
  aiSuggestionCard: { gap: SPACING.sm, borderColor: COLORS.primary },
  aiSuggestionTitle: { color: COLORS.primary, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
  privacyNote: { color: COLORS.text, fontSize: TYPOGRAPHY.small, lineHeight: 21, backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: SPACING.sm },
  fieldHint: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.caption, lineHeight: 18 },
  aiLinkRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: SPACING.sm },
  aiLinkText: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, fontWeight: "600", flexShrink: 1 },
  removeAIKey: { alignItems: "center", paddingVertical: SPACING.sm },
  removeAIKeyText: { color: COLORS.danger, fontSize: TYPOGRAPHY.small, fontWeight: "600" },

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
