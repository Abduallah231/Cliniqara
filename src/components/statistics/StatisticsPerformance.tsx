import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

interface Props {
  averageVisitsPerDay: number;
  visitsThisWeek: number;
  visitsThisMonth: number;
}

export default function StatisticsPerformance({
  averageVisitsPerDay,
  visitsThisWeek,
  visitsThisMonth,
}: Props) {
  return (
    <View style={styles.row}>
      <Metric
        label="Avg. Visits / Day"
        value={averageVisitsPerDay.toFixed(1)}
      />

      <Metric
        label="This Week"
        value={String(visitsThisWeek)}
      />

      <Metric
        label="This Month"
        value={String(visitsThisMonth)}
      />
    </View>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  metric: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
  },

  value: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.primary,
  },

  label: {
    marginTop: 5,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
    textAlign: "center",
  },
});