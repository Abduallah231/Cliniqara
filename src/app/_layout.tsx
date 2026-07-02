import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { stackOptions } from "@/navigation";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={stackOptions} />
    </SafeAreaProvider>
  );
}