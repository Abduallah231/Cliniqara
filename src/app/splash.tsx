import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  View,
} from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const guest = await AsyncStorage.getItem("guestMode");
    const token = await AsyncStorage.getItem("accessToken");

    if (guest === "true") {
      router.replace("/");
      return;
    }

    if (token) {
      router.replace("/");
      return;
    }

    router.replace("/login");
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