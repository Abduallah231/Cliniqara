import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";

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

  onOpen?: () => void;
};

export default function VisitCard({
  date,
  complaint,
  diagnosis,
  doctor,
  onOpen,
}: Props) {
  return (
    <AppCard>
      <AppView style={styles.header}>
        <AppView style={styles.dateRow}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={COLORS.primary}
          />

          <AppText style={styles.date}>
            {date}
          </AppText>
        </AppView>
      </AppView>

      <AppText style={styles.complaint}>
        {complaint}
      </AppText>

      <AppView style={styles.info}>
        <Ionicons
          name="pulse-outline"
          size={18}
          color={COLORS.secondaryText}
        />

        <AppText style={styles.label}>
          Diagnosis
        </AppText>
      </AppView>

      <AppText style={styles.value}>
        {diagnosis}
      </AppText>

      {!!doctor && (
        <>
          <AppView style={styles.info}>
            <Ionicons
              name="person-outline"
              size={18}
              color={COLORS.secondaryText}
            />

            <AppText style={styles.label}>
              Doctor
            </AppText>
          </AppView>

          <AppText style={styles.value}>
            {doctor}
          </AppText>
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