import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import AppTextInput from "@/components/common/AppTextInput";
import AppView from "@/components/common/AppView";
import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Alert, Modal, StyleSheet } from "react-native";

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
        <AppView
          style={styles.patientHeader}
        >
          <AppView
            style={
              styles.patientIconContainer
            }
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={COLORS.primary}
            />
          </AppView>

          <AppView
            style={styles.patientMainInfo}
          >
            <AppText
              style={styles.patientName}
              numberOfLines={1}
            >
              {patient?.fullName ||
                "Patient"}
            </AppText>

            {patient?.patientCode ? (
              <AppText
                style={styles.patientCode}
              >
                Patient ID:{" "}
                {patient.patientCode}
              </AppText>
            ) : null}

            {visitCode ? (
              <AppText
                style={styles.visitCode}
              >
                Visit Code:{" "}
                {visitCode}
              </AppText>
            ) : null}
          </AppView>
        </AppView>

        {(genderLabel || ageLabel) && (
          <AppView
            style={styles.infoRow}
          >
            {genderLabel && (
              <AppView
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

                <AppText
                  style={
                    styles.infoChipText
                  }
                >
                  {genderLabel}
                </AppText>
              </AppView>
            )}

            {ageLabel && (
              <AppView
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

                <AppText
                  style={
                    styles.infoChipText
                  }
                >
                  {ageLabel}
                </AppText>
              </AppView>
            )}
          </AppView>
        )}

        {/* ======================================
            PATIENT ACTIONS
        ======================================= */}

        <AppView
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
        </AppView>
      </AppCard>

      {/* ======================================
          SECTION HEADER
      ======================================= */}

      <AppView
        style={styles.sectionHeader}
      >
        <AppView
          style={
            styles.sectionIconContainer
          }
        >
          <Ionicons
            name={icon}
            size={19}
            color={COLORS.primary}
          />
        </AppView>

        <AppText
          style={styles.sectionTitle}
        >
          {sectionTitle}
        </AppText>
      </AppView>

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
        <AppView
          style={
            styles.modalOverlay
          }
        >
          <AppView
            style={
              styles.cancelModal
            }
          >
            <AppText
              style={styles.modalTitle}
            >
              Cancel Visit
            </AppText>

            <AppText
              style={
                styles.modalSubtitle
              }
            >
              Select one or more reasons,
              then confirm.
            </AppText>

            <AppScrollView
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
              <AppView
                style={
                  styles.reasonsHeader
                }
              >
                <AppText
                  style={
                    styles.reasonsTitle
                  }
                >
                  Cancellation Reasons
                </AppText>

                <AppText
                  style={
                    styles.reasonsHint
                  }
                >
                  Select one or more
                </AppText>
              </AppView>

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

              <AppView
                style={
                  styles.otherSection
                }
              >
                <AppText
                  style={
                    styles.otherTitle
                  }
                >
                  Other reason
                </AppText>

                <AppText
                  style={
                    styles.otherHint
                  }
                >
                  Add any additional reason
                  if needed
                </AppText>

                <AppTextInput
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
              </AppView>
            </AppScrollView>

            <AppView
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
            </AppView>
          </AppView>
        </AppView>
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