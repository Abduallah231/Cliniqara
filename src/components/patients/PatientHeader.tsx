import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

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
    <View style={[styles.container, style]}>
      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={styles.name}
        >
          {patient.fullName}
        </Text>

        <Text style={styles.id}>
          Patient ID:{" "}
          {patientCode ?? patient.id}
        </Text>
      </View>
    </View>
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