import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Alert } from "react-native";
import { createPatient } from "@/services/patientApi";
import { createWaitingVisit } from "@/services/visitApi";
import { startVisit } from "@/services/visitApi";
import { getErrorMessage } from "@/services/errorHandler";
import { useVisitStore } from "@/store/visitStore";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { mapPatientToCreateDto } from "@/mappers/patientMapper";

export default function PatientActions() {
  const { visit, updateVisit } = useVisitStore();
  const handleAddToWaiting = async () => {
    try {

      const dto = mapPatientToCreateDto(
        visit.patient
      );

      const patientResponse =
        await createPatient(dto);

      const waitingVisit =
        await createWaitingVisit(
          patientResponse.id
      );

      updateVisit({
        metadata: {
          ...visit.metadata,
          id: waitingVisit.id,
          patientId: patientResponse.id,
          visitNumber: waitingVisit.visitCode,
          status: waitingVisit.visitStatus,
        },
      });

      router.replace("/patient-overview");

    } catch (error) {
      Alert.alert(
        "Error",
        getErrorMessage(error)
      );
    }
  };

  const handleStartVisit = async () => {
    try {
      const dto = mapPatientToCreateDto(
        visit.patient
      );

      const patientResponse =
        await createPatient(dto);

      const waitingVisit =
        await createWaitingVisit(
          patientResponse.id
        );

      const startedVisit =
        await startVisit(
          waitingVisit.id
        );

      updateVisit({
        metadata: {
          ...visit.metadata,
          id: startedVisit.id,
          patientId: patientResponse.id,
          visitNumber: startedVisit.visitCode,
          status: startedVisit.visitStatus,
        },
      });

      router.replace(
        "/visit/HistoryScreen"
      );

    } catch (error) {
      Alert.alert(
        "Error",
        getErrorMessage(error)
      );
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.primaryButton}
        onPress={handleStartVisit}
      >
        <Ionicons
          name="play-outline"
          size={20}
          color={COLORS.white}
        />

        <Text style={styles.primaryText}>
          Save & Start Visit
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={handleAddToWaiting}
      >
        <Ionicons
          name="save-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.secondaryText}>
          Add To Waiting
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  primaryButton: {
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  secondaryButton: {
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  primaryText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  secondaryText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});