import AppView from "@/components/common/AppView";
import { COLORS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export default function Divider() {
  return <AppView style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
});
