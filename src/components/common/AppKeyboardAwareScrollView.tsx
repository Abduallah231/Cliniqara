import { ReactNode } from "react";
import { Platform, StyleSheet } from "react-native";
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
      // Android's keyboard already resizes/scrolls focused inputs. The
      // library's extra viewIsDescendantOf lookup can target a stale native
      // tag when suggestion rows unmount after a selection (ReactTag warning).
      enableAutomaticScroll={Platform.OS === "ios"}
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
