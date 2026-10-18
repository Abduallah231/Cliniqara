import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { transformRuntimeStyle } from "./runtimeTheme";
import {
  KeyboardAwareScrollView,
} from "react-native-keyboard-aware-scroll-view";

type Props = {
  children: ReactNode;
} & React.ComponentProps<
  typeof KeyboardAwareScrollView
>;

export default function AppKeyboardAwareScrollView({
  children,
  contentContainerStyle,
  ...props
}: Props) {
  const theme = useAppSettingsStore((state) => state.activeColorScheme);
  return (
    <KeyboardAwareScrollView
      {...props}
      style={transformRuntimeStyle(styles.container, theme)}
      contentContainerStyle={[
        transformRuntimeStyle(styles.content, theme),
        transformRuntimeStyle(contentContainerStyle, theme),
      ]}
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      extraScrollHeight={120}
      extraHeight={120}
      keyboardOpeningTime={0}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
