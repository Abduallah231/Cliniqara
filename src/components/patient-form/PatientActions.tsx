import {
  useState,
} from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  router,
} from "expo-router";

import {
  Alert,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  createPatient,
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
};

export default function PatientActions({
  patient,
}: Props) {
  const {
    visit,
    updateVisit,
  } = useVisitStore();

  const {
    addPatient,
  } = usePatientStore();

  const [
    loadingAction,
    setLoadingAction,
  ] = useState<
    "start" | "waiting" | null
  >(null);

  /*
   * =========================
   * Add To Waiting
   * =========================
   */
  const handleAddToWaiting =
    async () => {
      /*
       * Prevent duplicate requests.
       */
      if (loadingAction) {
        return;
      }

      try {
        setLoadingAction(
          "waiting",
        );

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

        const waitingVisit =
          await createWaitingVisit(
            patientResponse.id,
          );

        updateVisit({
          metadata: {
            ...visit.metadata,

            id:
              waitingVisit.id,

            patientId:
              patientResponse.id,

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
              patientResponse.id,
          },
        });
      } catch (error) {
        Alert.alert(
          "Error",
          getErrorMessage(
            error,
          ),
        );
      } finally {
        setLoadingAction(
          null,
        );
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

        const waitingVisit =
          await createWaitingVisit(
            patientResponse.id,
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
              patientResponse.id,

            visitNumber:
              startedVisit.visitCode,

            status:
              startedVisit.visitStatus,
          },
        });

        router.replace({
          pathname:
            "/visit/HistoryScreen",

          params: {
            patientId:
              patientResponse.id,

            visitId:
              startedVisit.id,
          },
        });
      } catch (error) {
        Alert.alert(
          "Error",
          getErrorMessage(
            error,
          ),
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
    <View
      style={styles.container}
    >
      {/* =========================
          Save & Start Visit
          ========================= */}
      <Pressable
        style={[
          styles.primaryButton,

          isLoading &&
            styles.disabledButton,
        ]}
        onPress={
          handleStartVisit
        }
        disabled={isLoading}
      >
        {loadingAction ===
        "start" ? (
          <ActivityIndicator
            size="small"
            color={
              COLORS.white
            }
          />
        ) : (
          <Ionicons
            name="play-outline"
            size={20}
            color={
              COLORS.white
            }
          />
        )}

        <Text
          style={
            styles.primaryText
          }
        >
          {loadingAction ===
          "start"
            ? "Starting..."
            : "Save & Start Visit"}
        </Text>
      </Pressable>

      {/* =========================
          Add To Waiting
          ========================= */}
      <Pressable
        style={[
          styles.secondaryButton,

          isLoading &&
            styles.disabledSecondaryButton,
        ]}
        onPress={
          handleAddToWaiting
        }
        disabled={isLoading}
      >
        {loadingAction ===
        "waiting" ? (
          <ActivityIndicator
            size="small"
            color={
              COLORS.primary
            }
          />
        ) : (
          <Ionicons
            name="save-outline"
            size={20}
            color={
              COLORS.primary
            }
          />
        )}

        <Text
          style={
            styles.secondaryText
          }
        >
          {loadingAction ===
          "waiting"
            ? "Saving..."
            : "Add To Waiting"}
        </Text>
      </Pressable>
    </View>
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
  });