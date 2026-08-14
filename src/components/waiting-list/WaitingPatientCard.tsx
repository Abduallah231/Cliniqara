import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { startVisit } from "@/services/visitApi";
import { getErrorMessage } from "@/services/errorHandler";
import {
  useEffect,
  useState,
} from "react";
import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type WaitingPatient = {
  id: string;
  fullName: string;
  status:
    | "Waiting"
    | "With Doctor";
  visitId: string;
  visitCode: string;
  createdAt: string;
  startedAt?: string | null;
  patientId: string;
  patientCode: string;
  queueNumber?: number;
};

type Props = {
  patient: WaitingPatient;
};

function formatTime(dateString?: string | null) {
  if (!dateString) {
    return "Unknown";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function formatElapsedTime(
  startDate: string,
  endDate?: string | null,
) {
  const start = new Date(
    startDate,
  ).getTime();

  if (Number.isNaN(start)) {
    return "0 min";
  }

  const end = endDate
    ? new Date(endDate).getTime()
    : Date.now();

  if (Number.isNaN(end)) {
    return "0 min";
  }

  const elapsedMs = Math.max(
    0,
    end - start,
  );

  const totalMinutes =
    Math.floor(
      elapsedMs / 60000,
    );

  const hours =
    Math.floor(
      totalMinutes / 60,
    );

  const minutes =
    totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes} min`;
}

function getStatusLabel(
  status: WaitingPatient["status"],
) {
  return status === "With Doctor"
    ? "With Doctor"
    : "Waiting";
}

export default function WaitingPatientCard({
  patient,
}: Props) {
  /*
   * Waiting timer:
   *
   * Waiting:
   * createdAt -> now
   *
   * With Doctor:
   * createdAt -> startedAt
   *
   * Therefore, once startedAt exists,
   * this timer becomes frozen.
   */
  const [waitingElapsedTime, setWaitingElapsedTime] =
    useState(() =>
      formatElapsedTime(
        patient.createdAt,
        patient.startedAt,
      ),
    );

  /*
   * Active visit timer:
   *
   * Only runs while the visit is
   * With Doctor.
   *
   * startedAt -> now
   */
  const [activeElapsedTime, setActiveElapsedTime] =
    useState(() =>
      patient.startedAt
        ? formatElapsedTime(
            patient.startedAt,
          )
        : "0 min",
    );

  useEffect(() => {
    /*
     * WAITING TIMER
     *
     * For Waiting:
     * keep updating every second.
     *
     * For With Doctor:
     * calculate once using startedAt,
     * then stop the interval completely.
     */
    const updateWaitingTimer = () => {
      setWaitingElapsedTime(
        formatElapsedTime(
          patient.createdAt,
          patient.status ===
            "With Doctor"
            ? patient.startedAt
            : undefined,
        ),
      );
    };

    updateWaitingTimer();

    if (
      patient.status !== "Waiting"
    ) {
      return;
    }

    const interval = setInterval(
      updateWaitingTimer,
      1000,
    );

    return () =>
      clearInterval(interval);
  }, [
    patient.createdAt,
    patient.startedAt,
    patient.status,
  ]);

  useEffect(() => {
    /*
     * ACTIVE VISIT TIMER
     *
     * Only runs for With Doctor.
     */
    if (
      patient.status !== "With Doctor" ||
      !patient.startedAt
    ) {
      setActiveElapsedTime(
        "0 min",
      );

      return;
    }

    const updateActiveTimer = () => {
      setActiveElapsedTime(
        formatElapsedTime(
          patient.startedAt!,
        ),
      );
    };

    updateActiveTimer();

    const interval = setInterval(
      updateActiveTimer,
      1000,
    );

    return () =>
      clearInterval(interval);
  }, [
    patient.startedAt,
    patient.status,
  ]);

  const [starting, setStarting] =
    useState(false);

  const handleStartVisit = async () => {
    if (starting) return;

    try {
      setStarting(true);

      const visit = await startVisit(
        patient.visitId,
      );

      router.replace({
        pathname:
          "/visit/HistoryScreen",
        params: {
          patientId:
            patient.patientId,
          visitId: visit.id,
        },
      });
    } catch (error) {
      Alert.alert(
        "Unable to Start Visit",
        getErrorMessage(error),
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.visitBadge}>
          <Text
            style={
              styles.visitBadgeText
            }
          >
            {patient.visitCode}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            patient.status ===
              "With Doctor" &&
              styles.inProgressBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              patient.status ===
                "With Doctor" &&
                styles.inProgressText,
            ]}
          >
            {getStatusLabel(
              patient.status,
            )}
          </Text>
        </View>
      </View>

      <Text
        style={styles.name}
        numberOfLines={1}
      >
        {patient.fullName}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="person-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.infoText}>
            Patient
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="time-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.infoText}>
            Arrived{" "}
            {formatTime(
              patient.createdAt,
            )}
          </Text>
        </View>

        {patient.status ===
          "Waiting" && (
          <View
            style={styles.infoItem}
          >
            <Ionicons
              name="hourglass-outline"
              size={16}
              color={COLORS.primary}
            />

            <Text
              style={styles.infoText}
            >
              {waitingElapsedTime}
            </Text>
          </View>
        )}

        {patient.status ===
          "With Doctor" && (
          <>
            <View
              style={styles.infoItem}
            >
              <Ionicons
                name="play-circle-outline"
                size={16}
                color={COLORS.primary}
              />

              <Text
                style={styles.infoText}
              >
                Started{" "}
                {formatTime(
                  patient.startedAt,
                )}
              </Text>
            </View>

            <View
              style={styles.infoItem}
            >
              <Ionicons
                name="hourglass-outline"
                size={16}
                color={COLORS.primary}
              />

              <Text
                style={styles.infoText}
              >
                {activeElapsedTime}
              </Text>
            </View>
          </>
        )}
      </View>

      {patient.queueNumber != null && (
        <View style={styles.queueRow}>
          <Ionicons
            name="list-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.queueLabel}>
            {patient.status ===
            "Waiting"
              ? "Queue"
              : "Active Visit"}
          </Text>

          <Text
            style={styles.queueNumber}
          >
            #{patient.queueNumber}
          </Text>
        </View>
      )}

      <Text style={styles.patientCode}>
        Patient ID:{" "}
        {patient.patientCode}
      </Text>

      <View style={styles.buttonRow}>
        <AppButton
          title="Overview"
          variant="secondary"
          style={styles.button}
          onPress={() =>
            router.push({
              pathname:
                "/patient-overview",
              params: {
                patientId:
                  patient.patientId,
              },
            })
          }
        />

        <AppButton
          title={
            starting
              ? "Starting..."
              : "Start Visit"
          }
          style={styles.button}
          disabled={
            starting ||
            patient.status ===
              "With Doctor"
          }
          onPress={
            handleStartVisit
          }
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom:
      SPACING.md,
    gap: SPACING.sm,
  },

  visitBadge: {
    backgroundColor:
      COLORS.primary,
    borderRadius:
      RADIUS.pill,
    paddingHorizontal:
      SPACING.md,
    paddingVertical: 6,
    maxWidth: "65%",
  },

  visitBadgeText: {
    color: COLORS.white,
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "700",
  },

  statusBadge: {
    borderRadius:
      RADIUS.pill,
    paddingHorizontal:
      SPACING.sm,
    paddingVertical: 5,
    backgroundColor:
      "#EAF7EE",
  },

  inProgressBadge: {
    backgroundColor:
      "#FFF4E5",
  },

  statusText: {
    color: "#237A3B",
    fontSize: 11,
    fontWeight: "700",
  },

  inProgressText: {
    color: "#A65A00",
  },

  name: {
    fontSize:
      TYPOGRAPHY.subHeading,
    fontWeight: "700",
    color: COLORS.text,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.md,
    marginTop: 8,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    flexShrink: 1,
  },

  infoText: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
  },

  patientCode: {
    marginTop:
      SPACING.md,
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop:
      SPACING.lg,
  },

  button: {
    flex: 1,
  },

  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    paddingVertical: 8,
    paddingHorizontal:
      SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor:
      COLORS.background,
    gap: SPACING.xs,
  },

  queueLabel: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "600",
  },

  queueNumber: {
    color: COLORS.primary,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "800",
  },
});