import type { TextInputProps } from "react-native";
import { TextInput as NativeTextInput } from "react-native";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { transformRuntimeStyle } from "./runtimeTheme";

export default function AppTextInput({ style, ...props }: TextInputProps) {
  const theme = useAppSettingsStore((state) => state.activeColorScheme);
  const fontSize = useAppSettingsStore((state) => state.fontSize);
  return <NativeTextInput {...props} style={transformRuntimeStyle(style, theme, fontSize)} />;
}
