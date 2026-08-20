import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  BackHandler,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState, useCallback } from "react";
import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";

import HistoryTab from "@/components/visit/HistoryTab";


import {
  COLORS,
  SPACING
} from "@/theme";

export default function HistoryScreen() {
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

    router.replace("/(app)");
  };

  const handleGoToExamination = () => {
    if (navigationLock.current) {
      return;
    }

    if (!resolvedPatientId || !resolvedVisitId) {
      return;
    }

    navigationLock.current = true;
    setNavigating("next");

    router.push({
      pathname: "/visit/ExaminationScreen",
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

  useFocusEffect(() => {
  const onBackPress = () => {
    router.replace("/existing-patients");
    return true;
  };

  const subscription =
    BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

  return () => subscription.remove();
});
  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        title="Visit History"
        onBack={() => router.replace("/(app)")}
        onRightPress={() => router.push("/settings")}
      />

      <View style={styles.content}>
        <HistoryTab
          patientId={resolvedPatientId}
          visitId={resolvedVisitId}
        />
        </View>
        
        <View style={styles.floatingActions}>
        <AppButton
          title="Back"
          variant="secondary"
          loading={navigating === "back"}
          disabled={navigating !== null}
          style={styles.floatingBackButton}
          onPress={() => router.replace("/(app)")}
        />

        <AppButton
          title="Examination"
          loading={navigating === "next"}
          disabled={navigating !== null}
          style={styles.floatingNextButton}
          onPress={handleGoToExamination}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
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

    pointerEvents: "box-none",
  },

  floatingBackButton: {
    width: 110,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: COLORS.background,
    elevation: 7,

    shadowColor: "#000",
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

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

});