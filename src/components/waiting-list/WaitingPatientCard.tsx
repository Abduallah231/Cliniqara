import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getPatient } from "@/services/patientApi";
import { usePatientStore } from "@/store/patientStore";
import {
  useEffect,
  useState,
} from "react";

import {
  startVisit,
} from "@/services/visitApi";

import {
  getErrorMessage,
} from "@/services/errorHandler";

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

  doctorId: string;
  doctorName: string;

  queueNumber?: number;
};

type Props = {
  patient: WaitingPatient;
};

function formatTime(
  dateString?: string | null,
) {
  if (!dateString) {
    return "Unknown";
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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
  const start =
    new Date(
      startDate,
    ).getTime();

  if (
    Number.isNaN(start)
  ) {
    return "0 min";
  }

  const end = endDate
    ? new Date(
        endDate,
      ).getTime()
    : Date.now();

  if (
    Number.isNaN(end)
  ) {
    return "0 min";
  }

  const elapsedMs =
    Math.max(
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
  return status ===
    "With Doctor"
    ? "With Doctor"
    : "Waiting";
}

export default function WaitingPatientCard({
  patient,
}: Props) {

  const setCurrentPatient = usePatientStore(
    (state) => state.setCurrentPatient
  );
  /*
   * ==========================================
   * WAITING TIMER
   * ==========================================
   *
   * Waiting:
   *
   * createdAt -> now
   *
   * With Doctor:
   *
   * createdAt -> startedAt
   *
   * Therefore the waiting timer
   * freezes exactly when the visit
   * becomes IN_PROGRESS.
   */

  const [
    waitingElapsedTime,
    setWaitingElapsedTime,
  ] = useState(() =>
    formatElapsedTime(
      patient.createdAt,
      patient.status ===
        "With Doctor"
        ? patient.startedAt
        : undefined,
    ),
  );

  useEffect(() => {
    const updateWaitingTimer =
      () => {
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

    /*
     * Immediately calculate current
     * value.
     */
    updateWaitingTimer();

    /*
     * Once the visit is With Doctor,
     * DO NOT create an interval.
     *
     * The timer is frozen at:
     *
     * createdAt -> startedAt
     */
    if (
      patient.status !==
      "Waiting"
    ) {
      return;
    }

    const interval =
      setInterval(
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

  /*
   * ==========================================
   * ACTIVE VISIT TIMER
   * ==========================================
   *
   * Only runs for With Doctor:
   *
   * startedAt -> now
   */

  const [
    activeElapsedTime,
    setActiveElapsedTime,
  ] = useState(() =>
    patient.startedAt
      ? formatElapsedTime(
          patient.startedAt,
        )
      : "0 min",
  );

  useEffect(() => {
    /*
     * No active timer while waiting.
     */
    if (
      patient.status !==
        "With Doctor" ||
      !patient.startedAt
    ) {
      setActiveElapsedTime(
        "0 min",
      );

      return;
    }

    const updateActiveTimer =
      () => {
        setActiveElapsedTime(
          formatElapsedTime(
            patient.startedAt!,
          ),
        );
      };

    updateActiveTimer();

    const interval =
      setInterval(
        updateActiveTimer,
        1000,
      );

    return () =>
      clearInterval(interval);
  }, [
    patient.startedAt,
    patient.status,
  ]);

  const [
    starting,
    setStarting,
  ] = useState(false);

  /*
   * ==========================================
   * START / CONTINUE VISIT
   * ==========================================
   */

  const handleVisitAction = async () => {
    if (starting) {
      return;
    }

    try {
      setStarting(true);

      /*
      * Load the full patient exactly like
      * Patient Overview does.
      */
      const patientData = await getPatient(
        patient.patientId
      );

      setCurrentPatient(patientData);

      /*
      * Already in progress:
      * just continue the existing visit.
      */
      if (patient.status === "With Doctor") {
        router.push({
          pathname: "/visit/HistoryScreen",
          params: {
            patientId: patient.patientId,
            visitId: patient.visitId,
            visitCode: patient.visitCode,
          },
        });

        return;
      }

      /*
      * Waiting:
      * start the visit first, then open it.
      */
      const visit = await startVisit(
        patient.visitId
      );

      router.replace({
        pathname: "/visit/HistoryScreen",
        params: {
          patientId: patient.patientId,
          visitId: visit.id,
          visitCode: visit.visitCode,
        },
      });
    } catch (error) {
      Alert.alert(
        "Unable to Open Visit",
        getErrorMessage(error)
      );
    } finally {
      setStarting(false);
    }
  };

  const isWithDoctor =
    patient.status ===
    "With Doctor";

  return (
    <AppCard>
      {/* ======================================
          HEADER
      ======================================= */}

      <View
        style={
          styles.header
        }
      >
        <View
          style={
            styles.visitBadge
          }
        >
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
            isWithDoctor &&
              styles.inProgressBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isWithDoctor &&
                styles.inProgressText,
            ]}
          >
            {getStatusLabel(
              patient.status,
            )}
          </Text>
        </View>
      </View>

      {/* ======================================
          PATIENT NAME
      ======================================= */}

      <Text
        style={styles.name}
        numberOfLines={1}
      >
        {patient.fullName}
      </Text>

      {/* ======================================
          DOCTOR
      ======================================= */}

      <View
        style={
          styles.doctorRow
        }
      >
        <Ionicons
          name="medkit-outline"
          size={17}
          color={
            COLORS.primary
          }
        />

        <Text
          style={
            styles.doctorLabel
          }
        >
          {isWithDoctor
            ? "With Doctor"
            : "Assigned Doctor"}
        </Text>

        <Text
          style={
            styles.doctorName
          }
          numberOfLines={1}
        >
          Dr.{" "}
          {patient.doctorName}
        </Text>
      </View>

      {/* ======================================
          INFORMATION
      ======================================= */}

      <View
        style={
          styles.infoRow
        }
      >
        <View
          style={
            styles.infoItem
          }
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.infoText
            }
          >
            Patient
          </Text>
        </View>

        <View
          style={
            styles.infoItem
          }
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.infoText
            }
          >
            Arrived{" "}
            {formatTime(
              patient.createdAt,
            )}
          </Text>
        </View>

        {/* WAITING */}

        {!isWithDoctor && (
          <View
            style={
              styles.infoItem
            }
          >
            <Ionicons
              name="hourglass-outline"
              size={16}
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.infoText
              }
            >
              {waitingElapsedTime}
            </Text>
          </View>
        )}

        {/* WITH DOCTOR */}

        {isWithDoctor && (
          <>
            <View
              style={
                styles.infoItem
              }
            >
              <Ionicons
                name="play-circle-outline"
                size={16}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.infoText
                }
              >
                Started{" "}
                {formatTime(
                  patient.startedAt,
                )}
              </Text>
            </View>

            <View
              style={
                styles.infoItem
              }
            >
              <Ionicons
                name="hourglass-outline"
                size={16}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.infoText
                }
              >
                {activeElapsedTime}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* ======================================
          QUEUE / ACTIVE VISIT NUMBER
      ======================================= */}

      {patient.queueNumber !=
        null && (
        <View
          style={
            styles.queueRow
          }
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.queueLabel
            }
          >
            {isWithDoctor
              ? "Active Visit"
              : "Queue"}
          </Text>

          <Text
            style={
              styles.queueNumber
            }
          >
            #
            {
              patient.queueNumber
            }
          </Text>
        </View>
      )}

      {/* ======================================
          PATIENT ID
      ======================================= */}

      <Text
        style={
          styles.patientCode
        }
      >
        Patient ID:{" "}
        {patient.patientCode}
      </Text>

      {/* ======================================
          ACTIONS
      ======================================= */}

      <View
        style={
          styles.buttonRow
        }
      >
        <AppButton
          title="Overview"
          variant="secondary"
          style={
            styles.button
          }
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
              : isWithDoctor
              ? "Continue Visit"
              : "Start Visit"
          }
          style={
            styles.button
          }
          disabled={
            starting
          }
          onPress={
            handleVisitAction
          }
        />
      </View>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    header: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom:
        SPACING.md,
      gap:
        SPACING.sm,
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
      color:
        COLORS.white,
      fontSize:
        TYPOGRAPHY.small,
      fontWeight:
        "700",
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
      color:
        "#237A3B",
      fontSize: 11,
      fontWeight:
        "700",
    },

    inProgressText: {
      color:
        "#A65A00",
    },

    name: {
      fontSize:
        TYPOGRAPHY.subHeading,
      fontWeight:
        "700",
      color:
        COLORS.text,
    },

    doctorRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop:
        SPACING.sm,
      gap:
        SPACING.xs,
      paddingVertical: 6,
    },

    doctorLabel: {
      color:
        COLORS.secondaryText,
      fontSize:
        TYPOGRAPHY.small,
      fontWeight:
        "600",
    },

    doctorName: {
      color:
        COLORS.text,
      fontSize:
        TYPOGRAPHY.small,
      fontWeight:
        "700",
      flexShrink: 1,
    },

    infoRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      flexWrap:
        "wrap",
      gap:
        SPACING.md,
      marginTop: 8,
    },

    infoItem: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap:
        SPACING.xs,
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
      fontWeight:
        "600",
    },

    buttonRow: {
      flexDirection:
        "row",
      gap:
        SPACING.sm,
      marginTop:
        SPACING.lg,
    },

    button: {
      flex: 1,
    },

    queueRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop:
        SPACING.md,
      paddingVertical: 8,
      paddingHorizontal:
        SPACING.sm,
      borderRadius:
        RADIUS.md,
      backgroundColor:
        COLORS.background,
      gap:
        SPACING.xs,
    },

    queueLabel: {
      color:
        COLORS.secondaryText,
      fontSize:
        TYPOGRAPHY.small,
      fontWeight:
        "600",
    },

    queueNumber: {
      color:
        COLORS.primary,
      fontSize:
        TYPOGRAPHY.body,
      fontWeight:
        "800",
    },
  });