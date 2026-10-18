import AppView from "@/components/common/AppView";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import {
    COLORS,
    SPACING,
} from "@/theme";

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function AppDivider({
  style,
}: Props) {
  return (
    <AppView
      style={[
        styles.container,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,

    backgroundColor: COLORS.border,

    marginVertical: SPACING.md,
  },
});