import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";

import type { Patient } from "@/types/patient";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  patient: Patient;
};

function calculateAge(patient: Patient): string {
  if (patient.dateOfBirth) {
    const birthDate = new Date(
      patient.dateOfBirth,
    );

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() <
          birthDate.getDate())
    ) {
      age--;
    }

    return `${age} Years`;
  }

  if (
    patient.estimatedAgeValue != null &&
    patient.estimatedAgeUnit
  ) {
    const unitMap = {
      YEARS: "Years",
      MONTHS: "Months",
      DAYS: "Days",
    } as const;

    return `${patient.estimatedAgeValue} ${
      unitMap[
        patient.estimatedAgeUnit
      ]
    }`;
  }

  return "Age not available";
}

export default function PatientOverviewHeader({
  patient,
}: Props) {
  const age = calculateAge(patient);

  const gender =
    patient.gender === "MALE"
      ? "Male"
      : "Female";

  return (
    <AppCard>
      <AppView style={styles.header}>
        <AppView style={styles.info}>
          <AppView style={styles.nameRow}>
            <AppText style={styles.name}>
              {patient.fullName}
            </AppText>
          </AppView>

          <AppText style={styles.subtitle}>
            {age} • {gender}
          </AppText>

          <AppView style={styles.row}>
            <Ionicons
              name="card-outline"
              size={16}
              color={
                COLORS.secondaryText
              }
            />

            <AppText style={styles.infoText}>
              Patient ID:{" "}
              {patient.patientCode}
            </AppText>
          </AppView>

          <AppView style={styles.row}>
            <Ionicons
              name="call-outline"
              size={16}
              color={
                COLORS.secondaryText
              }
            />

            <AppText style={styles.infoText}>
              {patient.phone ??
                "No phone number"}
            </AppText>
          </AppView>
        </AppView>
      </AppView>

      <AppView style={styles.actions}>
        <AppButton
          title="Edit"
          icon="create-outline"
          variant="secondary"
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/edit-patient",
              params: {
                patientId: patient.id,
              },
            })
          }
        />
      </AppView>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  info: {
    flex: 1,
    gap: SPACING.xs,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    flex: 1,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: SPACING.sm,
  },

  subtitle: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  infoText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
  },

  actions: {
    flexDirection: "row",
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },

  button: {
    flex: 1,
  },
});