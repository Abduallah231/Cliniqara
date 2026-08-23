import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import AssessmentTab from "@/components/visit/AssessmentTab";
import { usePatientStore } from "@/store/patientStore";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import useComplaintAutoSave from "@/features/complaints/hooks/useComplaintAutoSave";
import {
  Alert,
  StyleSheet,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  COLORS,
  SPACING,
} from "@/theme";

import { useState } from "react";

import {
  completeVisit,
} from "@/services/visitApi";

import {
  getErrorMessage,
} from "@/services/errorHandler";

export default function AssessmentScreen() {
  const {
    patientId,
    visitId,
    visitCode,
  } = useLocalSearchParams<{
    patientId?: string;
    visitId?: string;
    visitCode?: string;
  }>();
  const [
    completingVisit,
    setCompletingVisit,
  ] = useState(false);

  const resolvedPatientId =
    Array.isArray(patientId)
      ? patientId[0]
      : patientId;

  const resolvedVisitId =
    Array.isArray(visitId)
      ? visitId[0]
      : visitId;

  const resolvedVisitCode =
    Array.isArray(visitCode)
      ? visitCode[0]
      : visitCode;

  const handleCompleteVisit =
    async () => {
      /*
       * Prevent duplicate requests.
       */
      if (completingVisit) {
        return;
      }

      /*
       * Visit ID is required to complete
       * the backend visit.
       */
      if (!resolvedVisitId) {
        Alert.alert(
          "Unable to Save Visit",
          "Visit information is missing. Please reopen the visit and try again.",
        );
        return;
      }

      try {
        setCompletingVisit(true);

        await completeVisit({
          visitId: resolvedVisitId,
        });

        router.replace(
          "/patient-overview",
        );
      } catch (error) {
        Alert.alert(
          "Unable to Save Visit",
          getErrorMessage(error),
        );
      } finally {
        setCompletingVisit(false);
      }
    };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Visit Assessment"
        onBack={() => {
          if (!completingVisit) {
            router.back();
          }
        }}
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <View style={styles.content}>
        <AssessmentTab
          patientId={resolvedPatientId}
          visitId={resolvedVisitId}
        />
      </View>

      <View style={styles.floatingActions}>
        <AppButton
          title="Examination"
          variant="secondary"
          disabled={completingVisit}
          loading={false}
          style={styles.floatingBackButton}
          onPress={() => {
            if (completingVisit) return;

            router.back();
          }}
        />

        <AppButton
          title={
            completingVisit
              ? "Saving..."
              : "Save Visit"
          }
          icon="save-outline"
          loading={completingVisit}
          style={styles.floatingNextButton}
          onPress={handleCompleteVisit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },

  floatingActions: {
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.xl,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  floatingBackButton: {
    width: 150,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: COLORS.background,
    elevation: 7,

    shadowColor: COLORS.black,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  floatingNextButton: {
    width: 150,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: COLORS.background,
    elevation: 7,

    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

});