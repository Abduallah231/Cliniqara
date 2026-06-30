import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import PatientStatusChip from "@/components/patients/PatientStatusChip";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

type Props = {
  date: string;
  complaint: string;
  diagnosis: string;
  doctor?: string;
  status:
    | "Completed"
    | "In Progress"
    | "Follow-up";
  onOpen?: () => void;
};

export default function VisitCard({
  date,
  complaint,
  diagnosis,
  doctor,
  status,
  onOpen,
}: Props) {
  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={COLORS.primary}
          />

          <Text style={styles.date}>
            {date}
          </Text>
        </View>

        <PatientStatusChip
          status={status}
        />
      </View>

      <Text style={styles.complaint}>
        {complaint}
      </Text>

      <View style={styles.info}>
        <Ionicons
          name="pulse-outline"
          size={18}
          color={COLORS.secondaryText}
        />

        <Text style={styles.label}>
          Diagnosis
        </Text>
      </View>

      <Text style={styles.value}>
        {diagnosis}
      </Text>

      {!!doctor && (
        <>
          <View style={styles.info}>
            <Ionicons
              name="person-outline"
              size={18}
              color={COLORS.secondaryText}
            />

            <Text style={styles.label}>
              Doctor
            </Text>
          </View>

          <Text style={styles.value}>
            {doctor}
          </Text>
        </>
      )}

      <AppButton
        title="Open Visit"
        icon="open-outline"
        onPress={onOpen}
      />
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

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  date: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },

  complaint: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },

  value: {
    marginLeft: 26,
    marginBottom: SPACING.sm,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
  },
});