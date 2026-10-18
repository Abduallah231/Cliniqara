import { Redirect, Stack } from "expo-router";
import { AUTH_ENABLED } from "@/config/features";
import { stackOptions } from "@/navigation";

export default function AuthLayout() {
  if (!AUTH_ENABLED) {
    return <Redirect href="/splash" />;
  }

  return <Stack screenOptions={stackOptions} />;
}
