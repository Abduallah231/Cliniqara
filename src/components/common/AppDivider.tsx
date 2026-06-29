import {
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

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
    <View
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