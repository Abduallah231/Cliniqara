import { Stack } from "expo-router";
import { stackOptions } from "@/navigation";

export default function AppLayout() {
  return (
    <Stack screenOptions={stackOptions} />
  );
}