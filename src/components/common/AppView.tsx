import type { ViewProps } from "react-native";
import { View as NativeView } from "react-native";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { transformRuntimeStyle } from "./runtimeTheme";

export default function AppView({ style, ...props }: ViewProps) {
  const theme = useAppSettingsStore((state) => state.activeColorScheme);
  return <NativeView {...props} style={transformRuntimeStyle(style, theme)} />;
}
