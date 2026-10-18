import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Appearance, StyleSheet, useColorScheme } from "react-native";
import { useSegments } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { hasAppLockPin, verifyAppLockPin } from "@/services/appLockPin";
import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { COLORS, SPACING, TYPOGRAPHY } from "@/theme";
import { setColorPalette } from "@/theme/colors";

export default function AppLockController() {
  const segments = useSegments();
  const isAppRoute = segments[0] === "(app)";
  const appLock = useAppSettingsStore((state) => state.appLock);
  const biometric = useAppSettingsStore((state) => state.biometric);
  const theme = useAppSettingsStore((state) => state.theme);
  const hydrated = useAppSettingsStore((state) => state.hydrated);
  const hydrate = useAppSettingsStore((state) => state.hydrate);
  const setActiveColorScheme = useAppSettingsStore((state) => state.setActiveColorScheme);
  const updateSettings = useAppSettingsStore((state) => state.updateSettings);
  const systemColorScheme = useColorScheme();
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const appLockRef = useRef(appLock);
  const lockedRef = useRef(locked);
  const authenticatingRef = useRef(false);

  useEffect(() => {
    appLockRef.current = appLock;
    lockedRef.current = locked;
  }, [appLock, locked]);

  useEffect(() => {
    if (!hydrated) void hydrate().catch((error) => console.error("Failed to load app lock settings:", error));
  }, [hydrated, hydrate]);

  useEffect(() => {
    const activeScheme = theme === "System"
      ? systemColorScheme === "dark" ? "dark" : "light"
      : theme.toLowerCase() as "light" | "dark";
    setActiveColorScheme(activeScheme);
    setColorPalette(activeScheme);
    Appearance.setColorScheme(theme === "System" ? "unspecified" : activeScheme);
  }, [setActiveColorScheme, systemColorScheme, theme]);

  const unlock = () => {
    setLocked(false);
    setPin("");
    setPinError("");
  };

  const submitPin = async (value: string) => {
    if (value.length !== 4) return;
    setAuthenticating(true);
    try {
      if (await verifyAppLockPin(value)) unlock();
      else {
        setPinError("Incorrect PIN. Try again.");
        setPin("");
      }
    } catch (error) {
      setPinError("Could not verify the PIN on this device.");
      setPin("");
      console.error("App PIN verification failed:", error);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleBiometricUnlock = async () => {
    if (!biometric || authenticatingRef.current) return;
    authenticatingRef.current = true;
    setAuthenticating(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Cliniqara",
        cancelLabel: "Use PIN",
        disableDeviceFallback: true,
      });
      if (result.success) unlock();
    } catch (error) {
      console.error("Biometric app unlock failed:", error);
    } finally {
      authenticatingRef.current = false;
      setAuthenticating(false);
    }
  };

  useEffect(() => {
    if (!hydrated || !isAppRoute || !appLock) {
      setLocked(false);
      setPin("");
      return;
    }
    setLocked(true);
    let active = true;
    void hasAppLockPin().then((configured) => {
      if (active && !configured) {
        setLocked(false);
        void updateSettings({ appLock: false, biometric: false });
      }
    }).catch((error) => console.error("Failed to read the secure app PIN:", error));
    return () => { active = false; };
  }, [hydrated, isAppRoute, appLock, updateSettings]);

  useEffect(() => {
    let previousState = AppState.currentState;
    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasActive = previousState === "active";
      previousState = nextState;
      if (wasActive && nextState !== "active" && appLockRef.current && isAppRoute) {
        setLocked(true);
        setPin("");
      }
    });
    return () => subscription.remove();
  }, [isAppRoute]);

  if (isAppRoute && !hydrated) {
    return (
      <AppView style={styles.overlay}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </AppView>
    );
  }
  if (!locked || !appLock || !isAppRoute) return null;

  return (
    <AppView style={styles.overlay}>
      <AppView style={styles.lockContent}>
        <AppText style={styles.brand}>Cliniqara</AppText>
        <AppText style={styles.title}>Enter your 4-digit PIN</AppText>
        <AppText style={styles.message}>Your PIN is stored securely on this device.</AppText>
        <AppView style={styles.dots} accessibilityLabel={`${pin.length} of 4 digits entered`}>
          {[0, 1, 2, 3].map((index) => (
            <AppView key={index} style={[styles.dot, index < pin.length && styles.filledDot]} />
          ))}
        </AppView>
        <AppView style={styles.keypad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"].map((key, index) => (
            <AppPressable
              key={`${key}-${index}`}
              accessibilityRole="button"
              accessibilityLabel={key === "delete" ? "Delete last digit" : key || undefined}
              disabled={!key || authenticating}
              style={[styles.key, !key && styles.blankKey]}
              onPress={() => {
                if (key === "delete") {
                  setPin((current) => current.slice(0, -1));
                  setPinError("");
                  return;
                }
                if (pin.length < 4) {
                  const nextPin = `${pin}${key}`;
                  setPin(nextPin);
                  setPinError("");
                  if (nextPin.length === 4) void submitPin(nextPin);
                }
              }}
            >
              {key === "delete" ? <AppText style={styles.keyText}>⌫</AppText> : key ? <AppText style={styles.keyText}>{key}</AppText> : null}
            </AppPressable>
          ))}
        </AppView>
        {pinError ? <AppText style={styles.error}>{pinError}</AppText> : null}
        {authenticating ? <ActivityIndicator size="small" color={COLORS.primary} /> : null}
        {biometric && (
          <AppPressable style={styles.biometricButton} onPress={() => void handleBiometricUnlock()} disabled={authenticating}>
            <AppText style={styles.biometricText}>Unlock with fingerprint / Face ID</AppText>
          </AppPressable>
        )}
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  lockContent: { width: "100%", maxWidth: 360, alignItems: "center", gap: SPACING.md },
  brand: { fontSize: TYPOGRAPHY.heading, color: COLORS.primary, fontWeight: "800" },
  title: { color: COLORS.text, fontSize: TYPOGRAPHY.heading, fontWeight: "700", textAlign: "center" },
  message: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.body, textAlign: "center" },
  dots: { flexDirection: "row", gap: SPACING.lg, paddingVertical: SPACING.md },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: COLORS.primary },
  filledDot: { backgroundColor: COLORS.primary },
  keypad: { width: 260, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  key: { width: 76, height: 58, margin: 4, borderRadius: 18, backgroundColor: COLORS.card, alignItems: "center", justifyContent: "center" },
  blankKey: { backgroundColor: "transparent" },
  keyText: { color: COLORS.text, fontSize: 23, fontWeight: "600" },
  error: { color: COLORS.danger, fontSize: TYPOGRAPHY.small, textAlign: "center" },
  biometricButton: { minHeight: 48, justifyContent: "center", paddingHorizontal: SPACING.md },
  biometricText: { color: COLORS.primary, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
});
