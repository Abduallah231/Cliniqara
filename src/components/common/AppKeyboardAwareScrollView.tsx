import { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
} from "react-native";
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
  return (
    <KeyboardAwareScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        contentContainerStyle,
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