import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView as NativeSafeAreaView, type SafeAreaViewProps } from "react-native-safe-area-context";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { transformRuntimeStyle } from "./runtimeTheme";

type Props = PropsWithChildren<SafeAreaViewProps> & { style?: StyleProp<ViewStyle> };

export default function AppSafeAreaView({ style, ...props }: Props) {
  const theme = useAppSettingsStore((state) => state.activeColorScheme);
  return <NativeSafeAreaView {...props} style={transformRuntimeStyle(style, theme)} />;
}
