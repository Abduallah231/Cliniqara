import type { TextProps } from "react-native";
import { Text as NativeText } from "react-native";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { transformRuntimeStyle } from "./runtimeTheme";

export default function AppText({ style, ...props }: TextProps) {
  const theme = useAppSettingsStore((state) => state.activeColorScheme);
  const fontSize = useAppSettingsStore((state) => state.fontSize);
  return <NativeText {...props} style={transformRuntimeStyle(style, theme, fontSize)} />;
}
