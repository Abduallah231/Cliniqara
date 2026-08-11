import {
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import AppDivider from "@/components/common/AppDivider";

import { PatientSummary } from "@/models";

import AppInfoRow from "./AppInfoRow";
import PatientHeader from "./PatientHeader";

import {
    SPACING,
} from "@/theme";

type Props = {
  patient: PatientSummary;

  patientCode?: string;

  onPress?: (patient: PatientSummary) => void;

  onViewPatient?: (patient: PatientSummary) => void;

  onStartVisit?: (patient: PatientSummary) => void;

  style?: StyleProp<ViewStyle>;
};

export default function PatientCard({
  patient,
  patientCode,
  onPress,
  onViewPatient,
  onStartVisit,
  style,
}: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(patient)}
    >
      <AppCard style={style}>
        <PatientHeader
          patient={patient}
          patientCode={patientCode}
        />

        <AppDivider />

        <View style={styles.info}>
          <AppInfoRow
            icon="person-outline"
            label="Age"
            value={`${patient.age} Years • ${patient.gender}`}
          />

          {patient.phone && (
            <AppInfoRow
              icon="call-outline"
              label="Phone"
              value={patient.phone}
            />
          )}

          {patient.lastVisit && (
            <AppInfoRow
              icon="calendar-outline"
              label="Last Visit"
              value={patient.lastVisit}
            />
          )}
        </View>

        <AppDivider />
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  info: {
    gap: SPACING.sm,
  },
});