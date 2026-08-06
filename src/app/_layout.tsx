import { useEffect, useState } from "react";
import { Stack, router, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { stackOptions } from "@/navigation";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    const guest = await AsyncStorage.getItem("guestMode");

    const inAuthGroup = segments[0] === "(auth)";

    if ((token || guest === "true") && inAuthGroup) {
      router.replace("/splash");
    }

    if (!token && guest !== "true" && !inAuthGroup) {
      router.replace("/splash");
    }

    setLoading(false);
  };

  if (loading) {
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

  return (
    <SafeAreaProvider>
      <Stack screenOptions={stackOptions} />
    </SafeAreaProvider>
  );
}