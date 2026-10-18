import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { PatientSummary } from "@/models";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  patient: PatientSummary;
  patientCode?: string;
  style?: StyleProp<ViewStyle>;
};

export default function PatientHeader({
  patient,
  patientCode,
  style,
}: Props) {
  return (
    <AppView style={[styles.container, style]}>
      <AppView style={styles.info}>
        <AppText
          numberOfLines={1}
          style={styles.name}
        >
          {patient.fullName}
        </AppText>

        <AppText style={styles.id}>
          Patient ID:{" "}
          {patientCode ?? patient.id}
        </AppText>
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  name: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  id: {
    marginTop: 2,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
  },
});