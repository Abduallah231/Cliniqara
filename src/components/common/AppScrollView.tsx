import type { ScrollViewProps } from "react-native";
import { ScrollView as NativeScrollView } from "react-native";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { transformRuntimeStyle } from "./runtimeTheme";

export default function AppScrollView({ style, contentContainerStyle, ...props }: ScrollViewProps) {
  const theme = useAppSettingsStore((state) => state.activeColorScheme);
  return (
    <NativeScrollView
      {...props}
      style={transformRuntimeStyle(style, theme)}
      contentContainerStyle={transformRuntimeStyle(contentContainerStyle, theme)}
    />
  );
}
