import {
  useCallback,
  useState,
} from "react";
import {
  createWaitingVisit,
  startVisit,
  getOpenPatientVisit,
} from "@/services/visitApi";
import type { Visit } from "@/types/visit";
import {
  getErrorMessage,
} from "@/services/errorHandler";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";

import OverviewTab from "@/components/patient-overview/OverviewTab";
import PatientOverviewHeader from "@/components/patient-overview/PatientOverviewHeader";
import PatientOverviewTabs, {
  PatientOverviewTab,
} from "@/components/patient-overview/PatientOverviewTabs";
import VisitsTab from "@/components/patient-overview/VisitsTab";
import {
  getPatient,
} from "@/services/patientApi";

import {
  usePatientStore,
} from "@/store/patientStore";
import {
  COLORS,
  SPACING,
} from "@/theme";
export default function PatientOverviewScreen() {
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
  const { patientId } =
    useLocalSearchParams<{
      patientId: string;
    }>();

  const {
    currentPatient,
    setCurrentPatient,
  } = usePatientStore();

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadPatient = async () => {
        if (!patientId) {
          return;
        }

        try {
          const patient =
            await getPatient(patientId);

          if (mounted) {
            setCurrentPatient(patient);
          }

          const visit =
            await getOpenPatientVisit(patient.id);

          if (mounted) {
            setOpenVisit(visit);
          }
        } catch (error) {
          console.error(
            "Failed to load patient:",
            error,
          );
        }
      };

      loadPatient();

      return () => {
        mounted = false;
      };
    }, [
      patientId,
      setCurrentPatient,
    ]),
  );
  const [activeTab, setActiveTab] =
    useState<PatientOverviewTab>(
      "overview"
    );

  const [openVisit, setOpenVisit] =
    useState<Visit | null>(null);

  const [visitActionLoading, setVisitActionLoading] =
    useState(false);

  const [ creatingVisit, setCreatingVisit, ] = useState(false);

  if (!currentPatient) {
    return null;
  }

  const handleNewVisit = async () => {
    if (creatingVisit) {
      return;
    }

    if (!patientId) {
      Alert.alert(
        "Unable to Start Visit",
        "Patient information is missing."
      );
      return;
    }

    try {
      setCreatingVisit(true);

      const waitingVisit =
        await createWaitingVisit(
          patientId
        );

      const startedVisit =
        await startVisit(
          waitingVisit.id
        );

      router.push({
        pathname: "/visit/HistoryScreen",
        params: {
          patientId,
          visitId: startedVisit.id,
        },
      });
    } catch (error) {
      Alert.alert(
        "Unable to Start Visit",
        getErrorMessage(error)
      );
    } finally {
      setCreatingVisit(false);
    }
  };

  const handleVisitAction = async () => {
    if (visitActionLoading) {
      return;
    }

    try {
      setVisitActionLoading(true);

      if (!openVisit) {
        if (!patientId) {
          Alert.alert(
            "Unable to Start Visit",
            "Patient information is missing."
          );
          return;
        }

        const waitingVisit =
          await createWaitingVisit(patientId);

        const startedVisit =
          await startVisit(waitingVisit.id);

        router.push({
          pathname: "/visit/HistoryScreen",
          params: {
            patientId,
            visitId: startedVisit.id,
          },
        });

        return;
      }

      if (openVisit.visitStatus === "WAITING") {
        const startedVisit = await startVisit(
          openVisit.id,
        );

        router.push({
          pathname: "/visit/HistoryScreen",
          params: {
            patientId,
            visitId: startedVisit.id,
          },
        });

        return;
      }

      if (openVisit.visitStatus === "IN_PROGRESS") {
        router.push({
          pathname: "/visit/HistoryScreen",
          params: {
            patientId,
            visitId: openVisit.id,
          },
        });
      }
    } catch (error) {
      Alert.alert(
        "Unable to Open Visit",
        "Please try again.",
      );
    } finally {
      setVisitActionLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Patient Overview"
        onBack={() =>
          router.replace("/existing-patients")
        }
        onRightPress={() =>
          router.push("/settings")
        }
      />
        <ScrollView>
              <View style={styles.content}>
                <PatientOverviewHeader
                  patient={currentPatient}
                />

        <PatientOverviewTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <View style={styles.body}>
          {activeTab ===
          "overview" ? (
            <OverviewTab patient={currentPatient} />
          ) : (
            <VisitsTab />
          )}
        </View>
      </View>
    </ScrollView>
      <View style={styles.navigationBar}>
        <AppButton
          title="Back"
          variant="secondary"
          style={styles.backButton}
          onPress={() =>
            router.replace("/existing-patients")
          }
        />

        <AppButton
          title={
            visitActionLoading
              ? "Loading..."
              : !openVisit
                ? "New Visit"
                : openVisit.visitStatus === "WAITING"
                  ? "Start Visit"
                  : "Continue Visit"
          }
          icon={
            !openVisit
              ? "add-outline"
              : openVisit.visitStatus === "WAITING"
                ? "play-outline"
                : "arrow-forward-outline"
          }
          loading={visitActionLoading}
          style={styles.nextButton}
          onPress={handleVisitAction}
        />
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.md,
  },

  body: {
    flex: 1,
  },

  navigationBar: {
    position: "absolute",

    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.xl,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    padding: 4,

    borderRadius: 20,

    backgroundColor:
      "rgba(255,255,255,0.15)",
  },

  backButton: {
    width: 110,

    borderWidth: 1.5,

    borderColor: COLORS.border,

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

    borderColor: COLORS.border,

    shadowColor: COLORS.black,

    shadowOpacity: 0.18,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },
});