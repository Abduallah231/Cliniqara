import AppView from "@/components/common/AppView";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import AppButton from "@/components/common/AppButton";

import {
  SPACING,
} from "@/theme";

type Props = {
  onViewPatient?: () => void;

  onStartVisit?: () => void;

  style?: StyleProp<ViewStyle>;
};

export default function PatientQuickActions({
  onViewPatient,
  onStartVisit,
  style,
}: Props) {
  return (
    <AppView style={[styles.container, style]}>
      <AppButton
        title="View Patient"
        variant="secondary"
        onPress={onViewPatient}
        style={styles.button}
      />

      <AppButton
        title="Start Visit"
        onPress={onStartVisit}
        style={styles.button}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    gap: SPACING.md,
  },

  button: {
    flex: 1,
  },
});