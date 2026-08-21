import { getPatient } from "@/services/patientApi";
import { usePatientStore } from "@/store/patientStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import {
  getClinicMembers,
} from "@/services/clinicApi";

import type {
  ClinicMember,
} from "@/types/clinic";

import {
  cancelVisit,
  changeDoctor,
  startVisit,
} from "@/services/visitApi";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import {
  getErrorMessage,
} from "@/services/errorHandler";
import { useClinicStore } from "@/store/clinicStore";
import { useDoctorStore } from "@/store/doctorStore";

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
  onRefresh: () => Promise<void>;
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
  onRefresh,
}: Props) {

  const setCurrentPatient = usePatientStore(
    (state) => state.setCurrentPatient
  );

  const doctor = useDoctorStore(
    (state) => state.doctor
  );

  const currentClinic = useClinicStore(
    (state) => state.currentClinic
  );

  const currentUserId = doctor?.id ?? null;

  const isOwner =
    currentClinic?.role === "OWNER";

  const isAssistant =
    doctor?.accountType === "RECEPTION";

  const isAssignedDoctor =
    !!currentUserId &&
    patient.doctorId === currentUserId;

  const canChangeDoctor =
    isOwner || isAssistant;
    
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

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const [
    showCancelReasons,
    setShowCancelReasons,
  ] = useState(false);

  const [
    selectedCancelReasons,
    setSelectedCancelReasons,
  ] = useState<string[]>([]);

  const [
    customCancelReason,
    setCustomCancelReason,
  ] = useState("");

  const [
    doctorModalVisible,
    setDoctorModalVisible,
  ] = useState(false);

  const [
    doctors,
    setDoctors,
  ] = useState<ClinicMember[]>([]);

  const [
    selectedDoctorId,
    setSelectedDoctorId,
  ] = useState<string | null>(null);

  const [
    loadingDoctors,
    setLoadingDoctors,
  ] = useState(false);

  const [
    changingDoctor,
    setChangingDoctor,
  ] = useState(false);

  /*
   * ==========================================
   * START / CONTINUE VISIT
   * ==========================================
   */

  const cancellationReasons = [
    "Patient left before consultation",
    "Patient requested cancellation",
    "Duplicate visit",
    "Wrong patient / incorrect registration",
    "Doctor unavailable",
    "Clinic closed",
    "Other reason",
  ];

  /*
  * ==========================================
  * CHANGE DOCTOR
  * ==========================================
  */

  const handleChangeDoctor = async () => {
    if (
      !canChangeDoctor ||
      starting ||
      cancelling ||
      changingDoctor ||
      loadingDoctors
    ) {
      return;
    }

    try {
      setLoadingDoctors(true);

      const clinicId =
        currentClinic?.clinic.id;

      if (!clinicId) {
        throw new Error(
          "No clinic selected.",
        );
      }

      const members =
        await getClinicMembers(
          clinicId,
        );

      const clinicDoctors =
        members.filter(
          (member) =>
            member.status === "ACTIVE" &&
            member.user.accountType ===
              "DOCTOR",
        );

      if (clinicDoctors.length === 0) {
        Alert.alert(
          "No Doctors Available",
          "There are no active doctors in this clinic.",
        );
        return;
      }

      setDoctors(clinicDoctors);

      /*
      * Keep the current doctor selected
      * initially so the user can clearly
      * see the current assignment.
      */
      setSelectedDoctorId(
        patient.doctorId,
      );

      setDoctorModalVisible(true);
    } catch (error) {
      Alert.alert(
        "Unable to Load Doctors",
        getErrorMessage(error),
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleConfirmDoctor =
    async () => {
      if (
        !selectedDoctorId ||
        changingDoctor
      ) {
        return;
      }

      if (
        selectedDoctorId ===
        patient.doctorId
      ) {
        Alert.alert(
          "Doctor Already Assigned",
          "This visit is already assigned to this doctor.",
        );
        return;
      }

      try {
        setChangingDoctor(true);

        await changeDoctor({
          visitId:
            patient.visitId,
          doctorId:
            selectedDoctorId,
        });
        await onRefresh();

        setDoctorModalVisible(false);
        setSelectedDoctorId(null);

        /*
        * The waiting list screen already
        * reloads when it becomes active.
        * We close the modal here and let
        * the parent refresh the visit data.
        */
      } catch (error) {
        Alert.alert(
          "Unable to Change Doctor",
          getErrorMessage(error),
        );
      } finally {
        setChangingDoctor(false);
      }
    };
  
  const handleVisitAction = async () => {
    if (starting || !isAssignedDoctor) {
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

  const handleCancelVisit = () => {
    if (starting || cancelling) {
      return;
    }

    setSelectedCancelReasons([]);
    setCustomCancelReason("");
    setShowCancelReasons(true);
  };

  const toggleCancelReason = (
    reason: string,
  ) => {
    setSelectedCancelReasons((current) =>
      current.includes(reason)
        ? current.filter(
            (item) => item !== reason,
          )
        : [...current, reason],
    );
  };

  const confirmCancelVisit = async () => {
    if (
      starting ||
      cancelling ||
      (
        selectedCancelReasons.length === 0 &&
        !customCancelReason.trim()
      )
    ) {
      return;
    }

    const reasons = [
      ...selectedCancelReasons,
      ...(customCancelReason.trim()
        ? [customCancelReason.trim()]
        : []),
    ];

    try {
      setCancelling(true);

      await cancelVisit({
        visitId: patient.visitId,
        reason: reasons.join("; "),
      });

      setShowCancelReasons(false);
      setSelectedCancelReasons([]);
      setCustomCancelReason("");
    } catch (error) {
      Alert.alert(
        "Unable to Cancel Visit",
        getErrorMessage(error),
      );
    } finally {
      setCancelling(false);
    }
  };

  const isWithDoctor = patient.status === "With Doctor";

  const handleUnauthorizedVisit = () => {
    Alert.alert(
      "Visit Assigned to Another Doctor",
      "This visit is assigned to another doctor. Please contact the clinic owner or assistant."
    );
  };

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
          style={[
            styles.button,

          ]}
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
          title="Cancel Visit"
          variant="secondary"
          loading={cancelling}
          style={[
            styles.button,

          ]}
          disabled={
            starting ||
            cancelling ||
            (!isAssignedDoctor && !isOwner && !isAssistant)
          }
          onPress={handleCancelVisit}
        />

        {canChangeDoctor && (
          <AppButton
            title="Change Doctor"
            variant="secondary"
            loading={
              loadingDoctors ||
              changingDoctor
            }
            style={[
              styles.button,

            ]}
            disabled={
              starting ||
              cancelling ||
              loadingDoctors ||
              changingDoctor
            }
            onPress={
              handleChangeDoctor
            }
          />
        )}

        <AppButton
          title={
            starting
              ? "Starting..."
              : isWithDoctor
              ? "Continue Visit"
              : "Start Visit"
          }
          loading={starting}
          style={[
            styles.button,

          ]}
          disabled={
            starting ||
            !isAssignedDoctor
          }
          onPress={
            isAssignedDoctor
              ? handleVisitAction
              : handleUnauthorizedVisit
          }
        />
      </View>

      <Modal
        visible={showCancelReasons}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!cancelling) {
            setShowCancelReasons(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModal}>
            <Text style={styles.modalTitle}>
              Cancel Visit
            </Text>

            <Text style={styles.modalSubtitle}>
              Select one or more reasons, then confirm.
            </Text>

            <ScrollView
              style={styles.reasonsScroll}
              contentContainerStyle={
                styles.reasonsContent
              }
              showsVerticalScrollIndicator
              persistentScrollbar
              nestedScrollEnabled
            >
              <View style={styles.reasonsHeader}>
                <Text style={styles.reasonsTitle}>
                  Cancellation Reasons
                </Text>
                <Text style={styles.reasonsHint}>
                  Select one or more
                </Text>
              </View>

              {cancellationReasons
                .filter(
                  (reason) => reason !== "Other reason",
                )
                .map((reason) => {
                  const selected =
                    selectedCancelReasons.includes(reason);

                  return (
                    <AppButton
                      key={reason}
                      title={
                        selected
                          ? `✓  ${reason}`
                          : reason
                      }
                      variant={
                        selected
                          ? "primary"
                          : "secondary"
                      }
                      disabled={cancelling}
                      style={[
                        styles.reasonButton,
                        selected &&
                          styles.selectedReasonButton,
                      ]}
                      onPress={() =>
                        toggleCancelReason(reason)
                      }
                    />
                  );
                })}

              <View style={styles.otherSection}>
                <Text style={styles.otherTitle}>
                  Other reason
                </Text>

                <Text style={styles.otherHint}>
                  Add any additional reason if needed
                </Text>

                <TextInput
                  value={customCancelReason}
                  onChangeText={setCustomCancelReason}
                  placeholder="Enter another reason..."
                  editable={!cancelling}
                  style={styles.otherReasonInput}
                  multiline
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <AppButton
                title="Confirm Cancellation"
                loading={cancelling}
                disabled={
                  cancelling ||
                  (
                    selectedCancelReasons.length === 0 &&
                    !customCancelReason.trim()
                  )
                }
                style={styles.confirmButton}
                onPress={confirmCancelVisit}
              />

              <AppButton
                title="Close"
                variant="secondary"
                disabled={cancelling}
                style={styles.cancelCloseButton}
                onPress={() =>
                  setShowCancelReasons(false)
                }
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={doctorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!changingDoctor) {
            setDoctorModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.doctorModal}>
            <View style={styles.doctorHeader}>
              <View style={styles.doctorHeaderContent}>
                <Text
                  style={styles.doctorTitle}
                >
                  Change Doctor
                </Text>

                <Text
                  style={styles.doctorSubtitle}
                >
                  Choose the doctor who will handle this visit.
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  if (!changingDoctor) {
                    setDoctorModalVisible(false);
                  }
                }}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={COLORS.text}
                />
              </Pressable>
            </View>

            {loadingDoctors ? (
              <View
                style={styles.doctorLoading}
              >
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                />

                <Text
                  style={
                    styles.doctorLoadingText
                  }
                >
                  Loading doctors...
                </Text>
              </View>
            ) : (
              <View style={styles.doctorList}>
                {doctors.map((doctor) => {
                  const selected =
                    selectedDoctorId ===
                    doctor.userId;

                  return (
                    <Pressable
                      key={doctor.id}
                      style={[
                        styles.doctorItem,
                        selected &&
                          styles.selectedDoctorItem,
                      ]}
                      onPress={() =>
                        setSelectedDoctorId(
                          doctor.userId,
                        )
                      }
                      disabled={
                        changingDoctor
                      }
                    >
                      <View
                        style={
                          styles.doctorAvatar
                        }
                      >
                        <Ionicons
                          name="person"
                          size={22}
                          color={
                            COLORS.primary
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.doctorInfo
                        }
                      >
                        <Text
                          style={
                            styles.doctorName
                          }
                        >
                          {doctor.user.fullName}
                        </Text>

                        {doctor.user
                          .specialty ? (
                          <Text
                            style={
                              styles.doctorSpecialty
                            }
                          >
                            {
                              doctor.user
                                .specialty
                            }
                          </Text>
                        ) : null}

                        {doctor.userId ===
                          patient.doctorId && (
                          <Text
                            style={
                              styles.currentDoctorText
                            }
                          >
                            Current doctor
                          </Text>
                        )}
                      </View>

                      <Ionicons
                        name={
                          selected
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={24}
                        color={
                          selected
                            ? COLORS.primary
                            : COLORS.border
                        }
                      />
                    </Pressable>
                  );
                })}
              </View>
            )}

            <Pressable
              style={[
                styles.confirmDoctorButton,
                (
                  !selectedDoctorId ||
                  selectedDoctorId ===
                    patient.doctorId ||
                  changingDoctor
                ) &&
                  styles.disabledButton,
              ]}
              onPress={
                handleConfirmDoctor
              }
              disabled={
                !selectedDoctorId ||
                selectedDoctorId ===
                  patient.doctorId ||
                changingDoctor
              }
            >
              {changingDoctor ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.white}
                />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.white}
                />
              )}

              <Text
                style={
                  styles.confirmDoctorText
                }
              >
                {changingDoctor
                  ? "Changing..."
                  : "Confirm Doctor"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
        COLORS.background,
    },

    inProgressBadge: {
      backgroundColor:
        COLORS.background,
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
        TYPOGRAPHY.body,
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
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: SPACING.sm,
      marginTop: SPACING.lg,
    },

    button: {
      flexGrow: 1,
      minWidth: 0,
      flexShrink: 0,
      width: "auto",
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

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "center",
      alignItems: "center",
      padding: SPACING.lg,
    },

    cancelModal: {
      width: "100%",
      maxWidth: 500,
      maxHeight: "90%",
      backgroundColor: COLORS.white,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      gap: SPACING.sm,
    },

    modalTitle: {
      fontSize: TYPOGRAPHY.heading,
      fontWeight: "700",
      color: COLORS.text,
    },

    modalSubtitle: {
      fontSize: TYPOGRAPHY.small,
      color: COLORS.secondaryText,
      marginBottom: SPACING.sm,
    },

    reasonButton: {
      width: "100%",
      backgroundColor: "#6188cf",
      borderWidth: 1,
      borderColor: "#C9D8F0",
    },

    otherReasonInput: {
      minHeight: 90,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: RADIUS.md,
      padding: SPACING.sm,
      textAlignVertical: "top",
      color: COLORS.text,
      backgroundColor: COLORS.background,
    },

    reasonsScroll: {
      maxHeight: 360,
      flexGrow: 0,
    },

    reasonsContent: {
      gap: SPACING.sm,
      paddingBottom: SPACING.md,
    },

    reasonsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },

    reasonsTitle: {
      fontSize: TYPOGRAPHY.body,
      fontWeight: "700",
      color: COLORS.text,
    },

    reasonsHint: {
      fontSize: TYPOGRAPHY.small,
      color: COLORS.secondaryText,
    },

    selectedReasonButton: {
      backgroundColor: COLORS.primary,
      borderWidth: 2,
      borderColor: COLORS.primary,
    },

    otherSection: {
      marginTop: SPACING.md,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },

    otherTitle: {
      fontSize: TYPOGRAPHY.body,
      fontWeight: "700",
      color: COLORS.text,
    },

    otherHint: {
      marginTop: 3,
      marginBottom: SPACING.sm,
      fontSize: TYPOGRAPHY.small,
      color: COLORS.secondaryText,
    },

    modalActions: {
      marginTop: SPACING.sm,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      gap: SPACING.sm,
    },

    confirmButton: {
      width: "100%",
    },

    closeButton: {
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.background,
    },

    doctorModal: {
      width: "100%",
      maxWidth: 520,
      backgroundColor: COLORS.card,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
    },

    doctorHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: SPACING.lg,
    },

    doctorHeaderContent: {
      flex: 1,
      paddingRight: SPACING.sm,
    },

    doctorTitle: {
      color: COLORS.text,
      fontSize: TYPOGRAPHY.subHeading,
      fontWeight: "700",
    },

    doctorSubtitle: {
      color: COLORS.secondaryText,
      fontSize: TYPOGRAPHY.body,
      marginTop: 4,
    },

    doctorList: {
      gap: SPACING.sm,
    },

    doctorItem: {
      minHeight: 70,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: RADIUS.lg,
      paddingHorizontal: SPACING.md,
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },

    selectedDoctorItem: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.background,
    },

    doctorAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.background,
    },

    doctorInfo: {
      flex: 1,
    },

    doctorSpecialty: {
      color: COLORS.secondaryText,
      fontSize: TYPOGRAPHY.caption,
      marginTop: 3,
    },

    currentDoctorText: {
      color: COLORS.primary,
      fontSize: TYPOGRAPHY.caption,
      fontWeight: "700",
      marginTop: 3,
    },

    doctorLoading: {
      minHeight: 100,
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
    },

    doctorLoadingText: {
      color: COLORS.secondaryText,
      fontSize: TYPOGRAPHY.body,
    },

    confirmDoctorButton: {
      height: 52,
      borderRadius: RADIUS.lg,
      backgroundColor: COLORS.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      marginTop: SPACING.lg,
    },

    confirmDoctorText: {
      color: COLORS.white,
      fontSize: TYPOGRAPHY.body,
      fontWeight: "700",
    },

    disabledButton: {
      opacity: 0.5,
    },

    cancelCloseButton: {
      width: "100%",
    },
  });