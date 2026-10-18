import AppView from "@/components/common/AppView";
import { useEffect, useState } from "react";
import { Stack, router, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { stackOptions } from "@/navigation";
import AppLockController from "@/components/settings/AppLockController";
import { StatusBar } from "expo-status-bar";
import { useAppSettingsStore } from "@/store/appSettingsStore";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const activeColorScheme = useAppSettingsStore((state) => state.activeColorScheme);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = await AsyncStorage.getItem("accessToken");

    const inAuthGroup = segments[0] === "(auth)";

    if (token && inAuthGroup) {
      router.replace("/splash");
    }

    if (!token && !inAuthGroup) {
      router.replace("/splash");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <AppView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </AppView>
    );
  }

  return (
    <SafeAreaProvider>
      <>
        <StatusBar style={activeColorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={stackOptions} />
        <AppLockController />
      </>
    </SafeAreaProvider>
  );
}
