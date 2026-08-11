import {
  useCallback,
  useState,
} from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View
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

  if (!currentPatient) {
    return null;
  }

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
          title="New Visit"
          icon="add-outline"
          style={styles.nextButton}
          onPress={() =>
            router.push({
              pathname:
                "/visit/HistoryScreen",
              params: {
                patientId,
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