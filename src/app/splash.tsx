import SessionService from "@/services/session.service";
import { router } from "expo-router";
import { useEffect } from "react";
import AuthService from "@/services/auth.service";
import {
  ActivityIndicator,
  View,
} from "react-native";
import { loadDoctorProfile } from "@/services/doctorApi";
import {
  loadClinics,
  getSelectedClinic,
} from "@/services/clinicApi";

export default function SplashScreen() {
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const isGuest =
      await SessionService.isGuestMode();

    if (isGuest) {
      router.replace("/(app)");
      return;
    }

    const token =
      await SessionService.getAccessToken();

    if (!token) {
      router.replace("/(auth)/login");
      return;
    }

    // --------------------------------
    // AUTHENTICATION
    // --------------------------------
    let user;

    try {
      user = await AuthService.me();
    } catch {
      await SessionService.clearSession();
      router.replace("/(auth)/login");
      return;
    }

    // --------------------------------
    // VERIFICATION STATUS
    // --------------------------------
    switch (user.verificationStatus) {
      case "PENDING":
        router.replace(
          "/(auth)/waiting-approval",
        );
        return;

      case "REJECTED":
        router.replace(
          "/(auth)/verification-failed",
        );
        return;

      case "APPROVED":
        break;

      default:
        await SessionService.clearSession();
        router.replace("/(auth)/login");
        return;
    }

    // --------------------------------
    // LOAD DOCTOR PROFILE
    // --------------------------------
    try {
      await loadDoctorProfile();
    } catch {
      // Keep going to allow the app to load.
    }

    // --------------------------------
    // LOAD CLINICS
    // --------------------------------
    try {
      await loadClinics();
    } catch {
      // Keep going to allow the app to load.
    }

    // --------------------------------
    // LOAD SELECTED CLINIC
    // --------------------------------
    try {
      await getSelectedClinic();
    } catch {
      // Keep going to allow the app to load.
    }

    // --------------------------------
    // ENTER APP
    // --------------------------------
    router.replace("/(app)");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}