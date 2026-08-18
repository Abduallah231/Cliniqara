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
  useLocalSearchParams,
} from "expo-router";

export default function ExaminationScreen() {
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

      <View style={styles.navigationBar}>
        <AppButton
          title="History"
          variant="secondary"
          style={styles.backButton}
          onPress={() => router.back()}
        />

        <AppButton
          title="Assessment"
          style={styles.nextButton}
          onPress={() =>
            router.push({
              pathname:
                "/visit/AssessmentScreen",
              params: {
                patientId: resolvedPatientId,
                visitId: resolvedVisitId,
                visitCode: resolvedVisitCode,
              },
            })
          }
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

  navigationBar: {
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.xl,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    
    padding: 4,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  backButton: {
    width: 110,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

  nextButton: {
    width: 150,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

});