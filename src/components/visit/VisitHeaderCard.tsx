import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import {
  cancelVisit,
  getVisit,
} from "@/services/visitApi";

import {
  getErrorMessage,
} from "@/services/errorHandler";

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import { usePatientStore } from "@/store/patientStore";

type Props = {
  sectionTitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  visitId?: string;
};

const cancellationReasons = [
  "Patient left before consultation",
  "Patient requested cancellation",
  "Duplicate visit",
  "Wrong patient / incorrect registration",
  "Doctor unavailable",
  "Clinic closed",
];

export default function VisitHeaderCard({
  sectionTitle,
  icon,
  visitId,
}: Props) {
  const patient = usePatientStore(
    (state) => state.currentPatient
  );

  const [visitCode, setVisitCode] =
    useState<string | null>(null);

  const [showCancelReasons, setShowCancelReasons] =
    useState(false);

  const [selectedCancelReasons, setSelectedCancelReasons] =
    useState<string[]>([]);

  const [customCancelReason, setCustomCancelReason] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const loadVisit = async () => {
      if (!visitId) {
        return;
      }

      try {
        const visit = await getVisit(visitId);

        if (mounted) {
          setVisitCode(
            visit.visitCode ?? null
          );
        }
      } catch (error) {
        console.error(
          "Failed to load visit:",
          error
        );
      }
    };

    loadVisit();

    return () => {
      mounted = false;
    };
  }, [visitId]);

  const genderLabel =
    patient?.gender === "MALE"
      ? "Male"
      : patient?.gender === "FEMALE"
        ? "Female"
        : null;

  const ageLabel = (() => {
    /*
     * Use explicitly stored estimated age first.
     */
    if (
      patient?.estimatedAgeValue != null &&
      patient?.estimatedAgeUnit
    ) {
      const value =
        patient.estimatedAgeValue;

      const unit =
        patient.estimatedAgeUnit === "YEARS"
          ? value === 1
            ? "Year"
            : "Years"
          : patient.estimatedAgeUnit === "MONTHS"
            ? value === 1
              ? "Month"
              : "Months"
            : value === 1
              ? "Day"
              : "Days";

      return `${value} ${unit}`;
    }

    /*
     * Fallback:
     * calculate age from date of birth.
     */
    if (patient?.dateOfBirth) {
      const birthDate =
        new Date(patient.dateOfBirth);

      const today = new Date();

      const differenceInMs =
        today.getTime() -
        birthDate.getTime();

      const days = Math.floor(
        differenceInMs /
          (1000 * 60 * 60 * 24)
      );

      if (days < 30) {
        return `${days} ${
          days === 1
            ? "Day"
            : "Days"
        }`;
      }

      const months = Math.floor(
        days / 30.4375
      );

      if (months < 12) {
        return `${months} ${
          months === 1
            ? "Month"
            : "Months"
        }`;
      }

      const years = Math.floor(
        months / 12
      );

      return `${years} ${
        years === 1
          ? "Year"
          : "Years"
      }`;
    }

    return null;
  })();

  /*
   * ==========================================
   * PATIENT OVERVIEW
   * ==========================================
   */

  const handlePatientOverview = () => {
    if (!patient?.id) {
      Alert.alert(
        "Unable to Open Patient",
        "Patient information is missing."
      );

      return;
    }

    router.push({
      pathname: "/patient-overview",
      params: {
        patientId: patient.id,
      },
    });
  };

  /*
   * ==========================================
   * CANCEL VISIT
   * ==========================================
   */

  const handleCancelVisit = () => {
    if (!visitId || cancelling) {
      return;
    }

    setSelectedCancelReasons([]);
    setCustomCancelReason("");
    setShowCancelReasons(true);
  };

  const toggleCancelReason = (
    reason: string
  ) => {
    setSelectedCancelReasons(
      (current) =>
        current.includes(reason)
          ? current.filter(
              (item) =>
                item !== reason
            )
          : [
              ...current,
              reason,
            ]
    );
  };

  const confirmCancelVisit = async () => {
    if (
      !visitId ||
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
        ? [
            customCancelReason.trim(),
          ]
        : []),
    ];

    try {
      setCancelling(true);

      await cancelVisit({
        visitId,
        reason: reasons.join("; "),
      });

      setShowCancelReasons(false);
      setSelectedCancelReasons([]);
      setCustomCancelReason("");

      /*
       * Return to the previous page
       * after successful cancellation.
       */
      router.back();
    } catch (error) {
      Alert.alert(
        "Unable to Cancel Visit",
        getErrorMessage(error)
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      {/* ======================================
          PATIENT INFORMATION
      ======================================= */}

      <AppCard
        style={styles.patientCard}
      >
        <View
          style={styles.patientHeader}
        >
          <View
            style={
              styles.patientIconContainer
            }
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>

          <View
            style={styles.patientMainInfo}
          >
            <Text
              style={styles.patientName}
              numberOfLines={1}
            >
              {patient?.fullName ||
                "Patient"}
            </Text>

            {patient?.patientCode ? (
              <Text
                style={styles.patientCode}
              >
                Patient ID:{" "}
                {patient.patientCode}
              </Text>
            ) : null}

            {visitCode ? (
              <Text
                style={styles.visitCode}
              >
                Visit Code:{" "}
                {visitCode}
              </Text>
            ) : null}
          </View>
        </View>

        {(genderLabel || ageLabel) && (
          <View
            style={styles.infoRow}
          >
            {genderLabel && (
              <View
                style={
                  styles.infoChip
                }
              >
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={
                    COLORS.primary
                  }
                />

                <Text
                  style={
                    styles.infoChipText
                  }
                >
                  {genderLabel}
                </Text>
              </View>
            )}

            {ageLabel && (
              <View
                style={
                  styles.infoChip
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={
                    COLORS.primary
                  }
                />

                <Text
                  style={
                    styles.infoChipText
                  }
                >
                  {ageLabel}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ======================================
            PATIENT ACTIONS
        ======================================= */}

        <View
          style={styles.actionRow}
        >
          <AppButton
            title="Patient Overview"
            variant="secondary"
            icon="person-outline"
            style={styles.actionButton}
            onPress={
              handlePatientOverview
            }
          />

          <AppButton
            title="Cancel Visit"
            variant="secondary"
            icon="close-circle-outline"
            loading={cancelling}
            disabled={
              cancelling ||
              !visitId
            }
            style={styles.actionButton}
            onPress={
              handleCancelVisit
            }
          />
        </View>
      </AppCard>

      {/* ======================================
          SECTION HEADER
      ======================================= */}

      <View
        style={styles.sectionHeader}
      >
        <View
          style={
            styles.sectionIconContainer
          }
        >
          <Ionicons
            name={icon}
            size={19}
            color={COLORS.primary}
          />
        </View>

        <Text
          style={styles.sectionTitle}
        >
          {sectionTitle}
        </Text>
      </View>

      {/* ======================================
          CANCEL MODAL
      ======================================= */}

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
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.cancelModal
            }
          >
            <Text
              style={styles.modalTitle}
            >
              Cancel Visit
            </Text>

            <Text
              style={
                styles.modalSubtitle
              }
            >
              Select one or more reasons,
              then confirm.
            </Text>

            <ScrollView
              style={
                styles.reasonsScroll
              }
              contentContainerStyle={
                styles.reasonsContent
              }
              showsVerticalScrollIndicator
              persistentScrollbar
              nestedScrollEnabled
            >
              <View
                style={
                  styles.reasonsHeader
                }
              >
                <Text
                  style={
                    styles.reasonsTitle
                  }
                >
                  Cancellation Reasons
                </Text>

                <Text
                  style={
                    styles.reasonsHint
                  }
                >
                  Select one or more
                </Text>
              </View>

              {cancellationReasons.map(
                (reason) => {
                  const selected =
                    selectedCancelReasons.includes(
                      reason
                    );

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
                      disabled={
                        cancelling
                      }
                      style={[
                        styles.reasonButton,
                        selected &&
                          styles.selectedReasonButton,
                      ]}
                      onPress={() =>
                        toggleCancelReason(
                          reason
                        )
                      }
                    />
                  );
                }
              )}

              <View
                style={
                  styles.otherSection
                }
              >
                <Text
                  style={
                    styles.otherTitle
                  }
                >
                  Other reason
                </Text>

                <Text
                  style={
                    styles.otherHint
                  }
                >
                  Add any additional reason
                  if needed
                </Text>

                <TextInput
                  value={
                    customCancelReason
                  }
                  onChangeText={
                    setCustomCancelReason
                  }
                  placeholder="Enter another reason..."
                  editable={
                    !cancelling
                  }
                  style={
                    styles.otherReasonInput
                  }
                  multiline
                />
              </View>
            </ScrollView>

            <View
              style={
                styles.modalActions
              }
            >
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
                style={
                  styles.confirmButton
                }
                onPress={
                  confirmCancelVisit
                }
              />

              <AppButton
                title="Close"
                variant="secondary"
                disabled={
                  cancelling
                }
                style={
                  styles.cancelCloseButton
                }
                onPress={() =>
                  setShowCancelReasons(
                    false
                  )
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  patientCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
  },

  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  patientIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      COLORS.primary + "12",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },

  patientMainInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientCode: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  visitCode: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },

  infoChipText: {
    marginLeft: 5,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  /*
   * ==========================================
   * PATIENT ACTIONS
   * ==========================================
   */

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  actionButton: {
    flexGrow: 1,
    flexBasis: 160,
  },

  /*
   * ==========================================
   * SECTION HEADER
   * ==========================================
   */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: 2,
  },

  sectionIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor:
      COLORS.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  /*
   * ==========================================
   * CANCEL MODAL
   * ==========================================
   */

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },

  cancelModal: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    backgroundColor:
      COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },

  modalTitle: {
    fontSize:
      TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
  },

  modalSubtitle: {
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
    marginBottom: SPACING.sm,
  },

  reasonsScroll: {
    maxHeight: 360,
    flexGrow: 0,
  },

  reasonsContent: {
    gap: SPACING.sm,
    paddingBottom:
      SPACING.md,
  },

  reasonsHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingBottom:
      SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  reasonsTitle: {
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  reasonsHint: {
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
  },

  reasonButton: {
    width: "100%",
    backgroundColor:
      "#6188cf",
    borderWidth: 1,
    borderColor:
      "#C9D8F0",
  },

  selectedReasonButton: {
    backgroundColor:
      COLORS.primary,
    borderWidth: 2,
    borderColor:
      COLORS.primary,
  },

  otherSection: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,
  },

  otherTitle: {
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  otherHint: {
    marginTop: 3,
    marginBottom:
      SPACING.sm,
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
  },

  otherReasonInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius:
      RADIUS.md,
    padding:
      SPACING.sm,
    textAlignVertical:
      "top",
    color: COLORS.text,
    backgroundColor:
      COLORS.background,
  },

  modalActions: {
    marginTop: SPACING.sm,
    paddingTop:
      SPACING.md,
    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,
    gap: SPACING.sm,
  },

  confirmButton: {
    width: "100%",
  },

  cancelCloseButton: {
    width: "100%",
  },
});