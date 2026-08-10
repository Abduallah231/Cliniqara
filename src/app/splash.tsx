import SessionService from "@/services/session.service";
import { router } from "expo-router";
import { useEffect } from "react";
import AuthService from "@/services/auth.service";
import {
  ActivityIndicator,
  View,
} from "react-native";
import { loadDoctorProfile } from "@/services/doctorApi";
import { loadClinics } from "@/services/clinicApi";

export default function SplashScreen() {
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
  const isGuest = await SessionService.isGuestMode();

  if (isGuest) {
    router.replace("/(app)");
    return;
  }

  const token = await SessionService.getAccessToken();

  if (!token) {
    router.replace("/(auth)/login");
    return;
  }

  try {
    const user = await AuthService.me();

    switch (user.verificationStatus) {
      case "APPROVED":
        await loadDoctorProfile();
        await loadClinics();

        router.replace("/(app)");
        return;

      case "PENDING":
        router.replace("/(auth)/waiting-approval");
        return;

      case "REJECTED":
        router.replace("/(auth)/verification-failed");
        return;

      default:
        await SessionService.clearSession();
        router.replace("/(auth)/login");
        return;
    }
  } catch {
    await SessionService.clearSession();
    router.replace("/(auth)/login");
  }
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