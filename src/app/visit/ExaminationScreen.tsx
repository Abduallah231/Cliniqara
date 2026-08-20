import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import ExaminationTab from "@/components/visit/ExaminationTab";
import {
  COLORS,
  SPACING
} from "@/theme";
import {
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useRef, useState, useCallback } from "react";
export default function ExaminationScreen() {
  const [navigating, setNavigating] = useState<
      "back" | "next" | null
    >(null);
  
    const navigationLock = useRef(false);
  
    useFocusEffect(
      useCallback(() => {
        // Reset navigation state whenever the screen becomes active again
        navigationLock.current = false;
        setNavigating(null);
  
        return () => {
          // Unlock when leaving the screen
          navigationLock.current = false;
          setNavigating(null);
        };
      }, [])
    );
  
    console.log("HISTORY NAVIGATING:", navigating);
  
      const handleBack = () => {
        if (navigationLock.current) {
          return;
        }

        navigationLock.current = true;
        setNavigating("back");

        router.back();
      };

      const handleGoToAssessment = () => {
        if (navigationLock.current) {
          return;
        }

        if (!resolvedPatientId || !resolvedVisitId) {
          return;
        }

        navigationLock.current = true;
        setNavigating("next");

        router.push({
          pathname: "/visit/AssessmentScreen",
          params: {
            patientId: resolvedPatientId,
            visitId: resolvedVisitId,
            visitCode: resolvedVisitCode,
          },
        });
      };
  const {
    patientId,
    visitId,
    visitCode,
  } = useLocalSearchParams<{
    patientId?: string;
    visitId?: string;
    visitCode?: string;
  }>();

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
  
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
      
    >
      <AppTopBar
              title="Visit Examination"
              onBack={() => router.back()}
              onRightPress={() => router.push("/settings")}
            />


      <View style={styles.content}>
        <ExaminationTab
          patientId={resolvedPatientId}
          visitId={resolvedVisitId}
        />
      </View>

      <View style={styles.floatingActions}>
        <AppButton
          title="History"
          variant="secondary"
          loading={navigating === "back"}
          disabled={navigating !== null}
          style={styles.floatingBackButton}
          onPress={handleBack}
        />

        <AppButton
          title="Assessment"
          style={styles.floatingNextButton}
          loading={navigating === "next"}
          disabled={navigating !== null}
          onPress={handleGoToAssessment}
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
    width: 110,
    borderRadius: 16,

    elevation: 7,
    borderWidth: 5,
    borderColor: COLORS.background,
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
    elevation: 7,
    borderWidth: 5,
    borderColor: COLORS.background,
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

});