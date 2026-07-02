import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";

import PatientStatusChip from "@/components/patients/PatientStatusChip";
import { router } from "expo-router";
import { PatientSummary } from "@/models";
import {
    COLORS,
    SPACING,
    TYPOGRAPHY
} from "@/theme";

type Props = {
  patient: PatientSummary;
};

export default function PatientOverviewHeader({
  patient,
}: Props) {
  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {patient.fullName}
            </Text>

            <PatientStatusChip
              status="Active"
            />
          </View>

          <Text style={styles.subtitle}>
            {patient.age} Years • {patient.gender}
          </Text>

          <View style={styles.row}>
            <Ionicons
              name="card-outline"
              size={16}
              color={COLORS.secondaryText}
            />

            <Text style={styles.infoText}>
              Patient ID: CLQ-000123
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.secondaryText}
            />

            <Text style={styles.infoText}>
              Last Visit: {patient.lastVisit}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Edit"
          icon="create-outline"
          variant="secondary"
          style={styles.button}
          onPress={() => {}}
        />

        <AppButton
          title="Call"
          icon="call-outline"
          variant="secondary"
          style={styles.button}
          onPress={() => {}}
        />

        <AppButton
          title="Report"
          icon="document-text-outline"
          variant="secondary"
          style={styles.button}
          onPress={() =>
            router.push("/generate-report")
          }
        />
      </View>
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