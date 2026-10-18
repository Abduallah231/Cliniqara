import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";

import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

interface Props {
  waitingMinutes: number;
  consultationMinutes: number;
}

export default function StatisticsAverageTimes({
  waitingMinutes,
  consultationMinutes,
}: Props) {
  return (
    <AppView style={styles.row}>
      <TimeCard
        title="Waiting Time"
        value={waitingMinutes}
      />

      <TimeCard
        title="Consultation Time"
        value={consultationMinutes}
      />
    </AppView>
  );
}

function TimeCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <AppView style={styles.card}>
      <AppText style={styles.title}>{title}</AppText>

      <AppText style={styles.value}>
        {formatMinutes(value)}
      </AppText>
    </AppView>
  );
}

function formatMinutes(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "0 min";
  }

  if (minutes < 60) {
    return `${minutes.toFixed(1)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = Math.round(minutes % 60);

  if (remaining === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remaining}m`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },

  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },

  title: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  value: {
    marginTop: 8,
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
  },
});