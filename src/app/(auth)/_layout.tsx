import { Stack } from "expo-router";
import { stackOptions } from "@/navigation";

export default function AuthLayout() {
  return (
    <Stack screenOptions={stackOptions} />
  );
}