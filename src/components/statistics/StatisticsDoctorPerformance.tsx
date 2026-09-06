import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

interface Doctor {
  doctorId: string;
  doctorName: string;
  totalVisits: number;

  averageWaitingMinutes: number;
  minimumWaitingMinutes: number;
  maximumWaitingMinutes: number;

  averageConsultationMinutes: number;
  minimumConsultationMinutes: number;
  maximumConsultationMinutes: number;
}

interface Props {
  doctors: Doctor[];
}

export default function StatisticsDoctorPerformance({
  doctors,
}: Props) {
  if (!doctors.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No doctor visit data available.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {doctors.map((doctor) => (
        <View
          key={doctor.doctorId}
          style={styles.doctorCard}
        >
          <View style={styles.header}>
            <View style={styles.nameContainer}>
              <Text
                style={styles.doctorName}
                numberOfLines={1}
              >
                {doctor.doctorName}
              </Text>

              <Text style={styles.totalVisits}>
                {doctor.totalVisits} visits
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            <Stat
              label="Avg. Waiting"
              value={formatMinutes(
                doctor.averageWaitingMinutes,
              )}
            />

            <Stat
              label="Avg. Consultation"
              value={formatMinutes(
                doctor.averageConsultationMinutes,
              )}
            />

            <Stat
              label="Shortest Wait"
              value={formatMinutes(
                doctor.minimumWaitingMinutes,
              )}
            />

            <Stat
              label="Longest Wait"
              value={formatMinutes(
                doctor.maximumWaitingMinutes,
              )}
            />

            <Stat
              label="Shortest Consultation"
              value={formatMinutes(
                doctor.minimumConsultationMinutes,
              )}
            />

            <Stat
              label="Longest Consultation"
              value={formatMinutes(
                doctor.maximumConsultationMinutes,
              )}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>
        {label}
      </Text>

      <Text style={styles.statValue}>
        {value}
      </Text>
    </View>
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

  if (!remaining) {
    return `${hours}h`;
  }

  return `${hours}h ${remaining}m`;
}

const styles = StyleSheet.create({
  doctorCard: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },

  header: {
    marginBottom: 14,
  },

  nameContainer: {
    flex: 1,
  },

  doctorName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  totalVisits: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
  },

  stat: {
    width: "50%",
    paddingRight: 8,
  },

  statLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
  },

  statValue: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.text,
  },

  empty: {
    paddingVertical: 20,
    alignItems: "center",
  },

  emptyText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
});