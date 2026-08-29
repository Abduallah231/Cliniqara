import {
  useState,
} from "react";

import {
  getClinicMembers,
} from "@/services/clinicApi";
import { useClinicStore } from "@/store/clinicStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  router
} from "expo-router";

import type {
  ClinicMember,
} from "@/types/clinic";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  createPatient,
  updatePatient,
} from "@/services/patientApi";

import {
  createWaitingVisit,
  startVisit,
} from "@/services/visitApi";

import {
  getErrorMessage,
} from "@/services/errorHandler";

import {
  useVisitStore,
} from "@/store/visitStore";

import {
  usePatientStore,
} from "@/store/patientStore";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import {
  mapPatientToCreateDto,
} from "@/mappers/patientMapper";

type PatientForm = {
  id?: string;

  identifierType: string;
  identifierNumber: string;
  documentType: string;

  fullName: string;
  dateOfBirth: Date | null;

  age: string;
  ageUnit:
    | "Days"
    | "Months"
    | "Years";

  gender:
    | "male"
    | "female";

  maritalStatus:
    | "Single"
    | "Married"
    | "Divorced"
    | "Widowed";

  childrenCount: string;

  phone: string;

  occupation: string;
  otherOccupation: string;

  governorate: string;
  otherGovernorate: string;

  city: string;
  otherCity: string;

  district: string;
  street: string;
};

type Props = {
  patient: PatientForm;
  existingPatientId?: string;
};

export default function PatientActions({
  patient,
  existingPatientId,
}: Props) {
  const { currentClinic } = useClinicStore();

  const clinicId =
    currentClinic?.clinic.id;
  const {
    visit,
    updateVisit,
  } = useVisitStore();

  const {
    addPatient,
    setCurrentPatient,
  } = usePatientStore();

  const [
    loadingAction,
    setLoadingAction,
  ] = useState<
    "start" | "waiting" | null
  >(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
    errorPatientId,
    setErrorPatientId,
  ] = useState<string | null>(null);

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

  /*
   * =========================
   * Add To Waiting
   * =========================
   */
  const handleAddToWaiting =
    async () => {
      if (loadingAction) {
        return;
      }

      if (!clinicId) {
        setErrorMessage(
          "No clinic selected.",
        );
        return;
      }

      try {
        setLoadingDoctors(true);

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
          setErrorMessage(
            "There are no active doctors in this clinic.",
          );
          return;
        }

        setDoctors(clinicDoctors);
        setSelectedDoctorId(null);
        setDoctorModalVisible(true);
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error),
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

  const handleConfirmDoctor =
    async () => {
      if (
        !clinicId ||
        !selectedDoctorId ||
        loadingAction
      ) {
        return;
      }

      try {
        setLoadingAction("waiting");
        setDoctorModalVisible(false);

        let targetPatientId: string;

        if (existingPatientId) {
          const updatedPatient =
            await updatePatient(
              existingPatientId,
              {
                maritalStatus:
                  patient.maritalStatus === "Single"
                    ? "SINGLE"
                    : patient.maritalStatus === "Married"
                      ? "MARRIED"
                      : patient.maritalStatus === "Divorced"
                        ? "DIVORCED"
                        : "WIDOWED",
                childrenCount:
                  patient.childrenCount.trim() === ""
                    ? undefined
                    : Number(patient.childrenCount),
                phone:
                  patient.phone.trim() || undefined,
                occupation:
                  patient.occupation.trim() || undefined,
                governorate:
                  patient.governorate.trim() || undefined,
                city:
                  patient.city.trim() || undefined,
                district:
                  patient.district.trim() || undefined,
                streetAddress:
                  patient.street.trim() || undefined,
                fullName:
                  patient.fullName.trim(),
              },
            );

          addPatient(updatedPatient);
          setCurrentPatient(updatedPatient);
          targetPatientId = existingPatientId;

          setErrorPatientId(
            existingPatientId,
          );
        } else {
          const dto =
            mapPatientToCreateDto(
              patient,
            );

          const patientResponse =
            await createPatient(
              dto,
            );

          addPatient(
            patientResponse,
          );

          setCurrentPatient(
            patientResponse,
          );

          targetPatientId =
            patientResponse.id;

          setErrorPatientId(
            patientResponse.id,
          );
        }

        const waitingVisit =
          await createWaitingVisit(
            targetPatientId,
            selectedDoctorId,
          );

        updateVisit({
          metadata: {
            ...visit.metadata,
            id: waitingVisit.id,
            patientId:
              targetPatientId,
            visitNumber:
              waitingVisit.visitCode,
            status:
              waitingVisit.visitStatus,
          },
        });

        router.replace({
          pathname:
            "/patient-overview",
          params: {
            patientId:
              targetPatientId,
          },
        });
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error),
        );

        if (existingPatientId) {
          setErrorPatientId(
            existingPatientId,
          );
        }
      } finally {
        setLoadingAction(null);
        setSelectedDoctorId(null);
      }
    };

  /*
   * =========================
   * Save & Start Visit
   * =========================
   */
  const handleStartVisit =
    async () => {
      /*
       * Prevent duplicate requests.
       */
      if (loadingAction) {
        return;
      }

      try {
        setLoadingAction(
          "start",
        );

        if (!clinicId) {
          throw new Error("No clinic selected.");
        }

        let targetPatientId: string;

        if (existingPatientId) {
          const updatedPatient =
            await updatePatient(
              existingPatientId,
              {
                maritalStatus:
                  patient.maritalStatus === "Single"
                    ? "SINGLE"
                    : patient.maritalStatus === "Married"
                      ? "MARRIED"
                      : patient.maritalStatus === "Divorced"
                        ? "DIVORCED"
                        : "WIDOWED",

                childrenCount:
                  patient.childrenCount.trim() === ""
                    ? undefined
                    : Number(patient.childrenCount),

                phone:
                  patient.phone.trim() || undefined,

                occupation:
                  patient.occupation.trim() || undefined,

                governorate:
                  patient.governorate.trim() || undefined,

                city:
                  patient.city.trim() || undefined,

                district:
                  patient.district.trim() || undefined,

                streetAddress:
                  patient.street.trim() || undefined,

                fullName:
                  patient.fullName.trim(),
              },
            );

          addPatient(updatedPatient);
          setCurrentPatient(updatedPatient);

          targetPatientId = existingPatientId;
        } else {
          const dto =
            mapPatientToCreateDto(
              patient,
            );

          const patientResponse =
            await createPatient(
              dto,
            );

          addPatient(
            patientResponse,
          );

          setCurrentPatient(
            patientResponse,
          );

          targetPatientId =
            patientResponse.id;
        }

        const waitingVisit =
          await createWaitingVisit(
            targetPatientId,
          );

        const startedVisit =
          await startVisit(
            waitingVisit.id,
          );

        updateVisit({
          metadata: {
            ...visit.metadata,

            id:
              startedVisit.id,

            patientId:
              targetPatientId,

            visitNumber:
              startedVisit.visitCode,

            status:
              startedVisit.visitStatus,
          },
        });

        router.replace({
          pathname: "/VisitScreen",
          params: {
            patientId: targetPatientId,
            visitId: startedVisit.id,
          },
        });
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error),
        );
      } finally {
        setLoadingAction(
          null,
        );
      }
    };

  const isLoading =
    loadingAction !== null;

    return (
    <>
      <Modal
        visible={errorMessage !== null}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setErrorMessage(null)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModal}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={COLORS.danger}
              />
            </View>

            <Text style={styles.errorTitle}>
              Please check the information
            </Text>

            <View style={styles.errorMessageBox}>
              {errorMessage
                ?.split("\n")
                .map((message, index) => (
                  <View
                    key={`${message}-${index}`}
                    style={styles.errorItem}
                  >
                    <View style={styles.errorBullet} />

                    <Text style={styles.errorText}>
                      {message}
                    </Text>
                  </View>
                ))}
            </View>

            <Pressable
              style={styles.errorButton}
              onPress={() => {
                const patientIdToOpen =
                  errorPatientId;

                setErrorMessage(null);
                setErrorPatientId(null);

                if (patientIdToOpen) {
                  router.replace({
                    pathname: "/patient-overview",
                    params: {
                      patientId: patientIdToOpen,
                    },
                  });
                }
              }}
            >
              <Text style={styles.errorButtonText}>
                OK
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={doctorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDoctorModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.doctorModal}>
            <View style={styles.doctorHeader}>
              <View>
                <Text
                  style={styles.doctorTitle}
                >
                  Select Doctor
                </Text>

                <Text
                  style={styles.doctorSubtitle}
                >
                  Choose the doctor who will handle this visit.
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setDoctorModalVisible(false)
                }
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
                  style={styles.doctorLoadingText}
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
                !selectedDoctorId &&
                  styles.disabledButton,
              ]}
              onPress={
                handleConfirmDoctor
              }
              disabled={
                !selectedDoctorId ||
                loadingAction !== null
              }
            >
              {loadingAction ===
              "waiting" ? (
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
                {loadingAction ===
                "waiting"
                  ? "Saving..."
                  : "Confirm Doctor"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Save & Start Visit */}
        <Pressable
          style={[
            styles.primaryButton,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleStartVisit}
          disabled={isLoading}
        >
          {loadingAction === "start" ? (
            <ActivityIndicator
              size="small"
              color={COLORS.white}
            />
          ) : (
            <Ionicons
              name="play-outline"
              size={20}
              color={COLORS.white}
            />
          )}

          <Text style={styles.primaryText}>
            {loadingAction === "start"
              ? "Starting..."
              : "Save & Start Visit"}
          </Text>
        </Pressable>

        {/* Add To Waiting */}
        <Pressable
          style={[
            styles.secondaryButton,
            isLoading &&
              styles.disabledSecondaryButton,
          ]}
          onPress={handleAddToWaiting}
          disabled={isLoading}
        >
          {loadingAction === "waiting" ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
            />
          ) : (
            <Ionicons
              name="save-outline"
              size={20}
              color={COLORS.primary}
            />
          )}

          <Text style={styles.secondaryText}>
            {loadingAction === "waiting"
              ? "Saving..."
              : "Add To Waiting"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles =
  StyleSheet.create({
    container: {
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },

    primaryButton: {
      height: 56,
      borderRadius:
        RADIUS.xl,
      backgroundColor:
        COLORS.primary,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: SPACING.sm,
      ...SHADOW,
    },

    secondaryButton: {
      height: 56,
      borderRadius:
        RADIUS.xl,
      backgroundColor:
        COLORS.card,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: SPACING.sm,
      ...SHADOW,
    },

    disabledButton: {
      opacity: 0.7,
    },

    disabledSecondaryButton: {
      opacity: 0.6,
    },

    primaryText: {
      color:
        COLORS.white,
      fontSize:
        TYPOGRAPHY.body,
      fontWeight:
        "700",
    },

    secondaryText: {
      color:
        COLORS.primary,
      fontSize:
        TYPOGRAPHY.body,
      fontWeight:
        "700",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: COLORS.placeholder,
      alignItems: "center",
      justifyContent: "center",
      padding: SPACING.lg,
    },

    errorModal: {
      width: "100%",
      maxWidth: 520,
      backgroundColor: COLORS.card,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      ...SHADOW,
    },

    errorIcon: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: "#FDECEC",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: SPACING.md,
    },

    errorTitle: {
      textAlign: "center",
      color: COLORS.text,
      fontSize: TYPOGRAPHY.subHeading,
      fontWeight: "700",
      marginBottom: SPACING.md,
    },

    errorMessageBox: {
      backgroundColor: COLORS.background,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      gap: SPACING.sm,
    },

    errorItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: SPACING.sm,
    },

    errorBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: COLORS.danger,
      marginTop: 7,
    },

    errorText: {
      flex: 1,
      color: COLORS.text,
      fontSize: TYPOGRAPHY.body,
      lineHeight: 21,
    },

    errorButton: {
      height: 48,
      borderRadius: RADIUS.lg,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginTop: SPACING.lg,
    },

    errorButtonText: {
      color: COLORS.white,
      fontSize: TYPOGRAPHY.body,
      fontWeight: "700",
    },

    doctorModal: {
      width: "100%",
      maxWidth: 520,
      backgroundColor: COLORS.card,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      ...SHADOW,
    },

    doctorHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: SPACING.lg,
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

    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.background,
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

    doctorName: {
      color: COLORS.text,
      fontSize: TYPOGRAPHY.body,
      fontWeight: "700",
    },

    doctorSpecialty: {
      color: COLORS.secondaryText,
      fontSize: TYPOGRAPHY.caption,
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
  });