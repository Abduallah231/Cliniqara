import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { Pressable as NativePressable } from "react-native";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { transformRuntimeStyle } from "./runtimeTheme";

export default function AppPressable({ style, ...props }: PressableProps) {
  const theme = useAppSettingsStore((state) => state.activeColorScheme);
  const resolveStyle: PressableProps["style"] = (state) => {
    const next = typeof style === "function" ? style(state) : style;
    return transformRuntimeStyle(next as StyleProp<ViewStyle>, theme);
  };
  return <NativePressable {...props} style={resolveStyle} />;
}
