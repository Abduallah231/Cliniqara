import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";


import { WaitingPatient } from "@/models";

import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY
} from "@/theme";

type Props = {
  patient: WaitingPatient;
};

export default function WaitingPatientCard({
  patient,
}: Props) {
  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.queueBadge}>
          <Text style={styles.queueText}>
            #{patient.queueNumber}
          </Text>
        </View>

      </View>

      <Text style={styles.name}>
        {patient.fullName}
      </Text>

      <Text style={styles.info}>
        {patient.age} Years • {patient.gender}
      </Text>

      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Ionicons
            name="time-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.timeText}>
            Waiting: {patient.waitingTime}
          </Text>
        </View>

        <View style={styles.timeItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.timeText}>
            Arrived: {patient.arrivalTime}
          </Text>
        </View>
      </View>

      <Text style={styles.visits}>
        {patient.previousVisits} Previous Visits
      </Text>

      <View style={styles.buttonRow}>
        <AppButton
          title="Overview"
          variant="secondary"
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/patient-overview",
              params: {
                patientId: patient.id,
              },
            })
          }
        />

        <AppButton
          title="Start Visit"
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/visit/HistoryScreen",
              params: {
                patientId: patient.id,
              },
            })
          }
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  queueBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },

  queueText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
  },

  name: {
    fontSize: TYPOGRAPHY.subHeading,
    fontWeight: "700",
    color: COLORS.text,
  },

  info: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
    gap: SPACING.md,
  },

  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    flex: 1,
  },

  timeText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.small,
  },

  visits: {
    marginTop: SPACING.md,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },

  button: {
    flex: 1,
  },
});