import AppTopBar from "@/components/common/AppTopBar";
import AssessmentTab from "@/components/visit/AssessmentTab";
import ExaminationTab from "@/components/visit/ExaminationTab";
import HistoryTab from "@/components/visit/HistoryTab";
import {
  completeVisit,
  getVisit,
} from "@/services/visitApi";
import {
  mapBackendVisitToVisitForm,
} from "@/services/visitMapper";
import { useVisitStore } from "@/store/visitStore";
import VisitHeaderCard from "../../components/visit/VisitHeaderCard";

import {
  getErrorMessage,
} from "@/services/errorHandler";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  COLORS,
  SPACING,
} from "@/theme";

import { useEffect, useState } from "react";

type VisitSection =
  | "history"
  | "examination"
  | "assessment";

export default function VisitScreen() {
  const {
    patientId,
    visitId,
    visitCode,
  } = useLocalSearchParams<{
    patientId?: string;
    visitId?: string;
    visitCode?: string;
  }>();

  const [activeSection, setActiveSection] =
    useState<VisitSection>("history");

  const [completingVisit, setCompletingVisit] =
    useState(false);

  const [loadingVisit, setLoadingVisit] =
    useState(true);

  const {
    resetVisit,
    updateVisit,
  } = useVisitStore();

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

    useEffect(() => {
      if (!resolvedVisitId) {
        setLoadingVisit(false);
        return;
      }

      let mounted = true;

      const loadVisit = async () => {
        try {
          setLoadingVisit(true);
          resetVisit();

          const backendVisit =
            await getVisit(resolvedVisitId);

          if (!mounted) {
            return;
          }

          /*
          * Keep the visit identity synchronized
          * with the backend.
          */
          const visitForm =
            mapBackendVisitToVisitForm(backendVisit);

          updateVisit(visitForm);

        } catch (error) {
          if (!mounted) {
            return;
          }

          Alert.alert(
            "Unable to Load Visit",
            getErrorMessage(error),
            [
              {
                text: "Back",
                onPress: () =>
                  router.back(),
              },
            ],
          );
        } finally {
          if (mounted) {
            setLoadingVisit(false);
          }
        }
      };

      loadVisit();

      return () => {
        mounted = false;
        resetVisit();
      };
    }, [
      resolvedVisitId,
      resetVisit,
    ]);

  const handleCompleteVisit = async () => {
    if (completingVisit) {
      return;
    }

    if (!resolvedVisitId) {
      Alert.alert(
        "Unable to Save Visit",
        "Visit information is missing. Please reopen the visit and try again.",
      );
      return;
    }

    /*
    * Always read the latest visit state directly
    * from Zustand before completing the visit.
    */
    const currentVisit =
      useVisitStore.getState().visit;

    const missingRequirements: string[] = [];

    // ======================================================
    // 1. Chief Complaint
    // ======================================================

    const chiefComplaint =
      currentVisit.history.chiefComplaint;

    const hasChiefComplaint =
      Boolean(
        chiefComplaint.complaintId ||
        chiefComplaint.complaintName?.trim(),
      );

    if (!hasChiefComplaint) {
      missingRequirements.push(
        "Chief Complaint",
      );
    }

    // ======================================================
    // 2. Diagnosis
    // ======================================================

    const diagnosis =
      currentVisit.assessment.diagnosis;

    const hasPrimaryDiagnosis =
      Boolean(
        diagnosis.primaryDiagnosis?.diagnosis?.trim(),
      );

    const hasDifferentialDiagnosis =
      diagnosis.differentialDiagnoses.length >
      0;

    /*
    * One diagnosis is enough:
    *
    * Primary Diagnosis
    * OR
    * at least one Differential Diagnosis
    */
    const hasDiagnosis =
      hasPrimaryDiagnosis ||
      hasDifferentialDiagnosis;

    if (!hasDiagnosis) {
      missingRequirements.push(
        "Diagnosis",
      );
    }

    // ======================================================
    // 3. Prescription
    // ======================================================

    const prescription =
      currentVisit.assessment.prescription;

    const hasPrescriptionMedication =
      prescription.medications.length > 0;

    const hasPrescriptionAdvice =
      Boolean(
        prescription.advice?.trim(),
      );

    const hasPrescriptionNotes =
      Boolean(
        prescription.notes?.trim(),
      );

    const hasPrescriptionFollowUp =
      Boolean(
        prescription.followUp?.trim(),
      );

    /*
    * Any prescription content is enough:
    *
    * Medication
    * OR Advice
    * OR Notes
    * OR Follow-up
    */
    const hasPrescription =
      hasPrescriptionMedication ||
      hasPrescriptionAdvice ||
      hasPrescriptionNotes ||
      hasPrescriptionFollowUp;

    if (!hasPrescription) {
      missingRequirements.push(
        "Prescription",
      );
    }

    // ======================================================
    // Validation result
    // ======================================================

    if (missingRequirements.length > 0) {
      Alert.alert(
        "Cannot Save Visit",
        `Please complete:\n\n${missingRequirements
          .map((item) => `• ${item}`)
          .join("\n")}`,
      );
      return;
    }

    // ======================================================
    // Complete visit
    // ======================================================

    try {
      setCompletingVisit(true);

      await completeVisit({
        visitId: resolvedVisitId,
      });

      router.replace({
        pathname: "/patient-overview",
        params: {
          patientId: resolvedPatientId,
        },
      });
    } catch (error) {
      Alert.alert(
        "Unable to Save Visit",
        getErrorMessage(error),
      );
    } finally {
      setCompletingVisit(false);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "history":
        return <HistoryTab />;

      case "examination":
        return <ExaminationTab />;

      case "assessment":
        return <AssessmentTab visitId={resolvedVisitId} />;
    }
  };

  const getVisitHeaderConfig = () => {
    switch (activeSection) {
      case "history":
        return {
          sectionTitle: "Medical History",
          icon: "document-text-outline" as const,
        };

      case "examination":
        return {
          sectionTitle: "Medical Examination",
          icon: "medkit-outline" as const,
        };

      case "assessment":
        return {
          sectionTitle: "Assessment",
          icon: "clipboard-outline" as const,
        };
    }
  };

  if (loadingVisit) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "bottom"]}
      >
        <AppTopBar
          title="Patient Visit"
          onBack={() => {
            if (!completingVisit) {
              router.back();
            }
          }}
          onRightPress={() =>
            router.push("/settings")
          }
        />

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Loading visit...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Patient Visit"
        onBack={() => {
          if (!completingVisit) {
            router.back();
          }
        }}
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <View style={styles.sectionNavigation}>
        <Pressable
          disabled={completingVisit}
          onPress={() => setActiveSection("history")}
          android_ripple={{ color: "#B8D3F5" }}
          style={[
            styles.sectionItem,
            activeSection === "history" &&
              styles.sectionItemActive,
          ]}
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={
              activeSection === "history"
                ? COLORS.white
                : COLORS.primary
            }
          />

          <Text
            style={[
              styles.sectionItemTitle,
              activeSection === "history" &&
                styles.sectionItemTitleActive,
            ]}
          >
            History
          </Text>
        </Pressable>

        <Pressable
          disabled={completingVisit}
          onPress={() =>
            setActiveSection("examination")
          }
          android_ripple={{ color: "#B8D3F5" }}
          style={[
            styles.sectionItem,
            styles.sectionItemWithLeftBorder,
            activeSection === "examination" &&
              styles.sectionItemActive,
          ]}
        >
          <Ionicons
            name="medkit-outline"
            size={22}
            color={
              activeSection === "examination"
                ? COLORS.white
                : COLORS.primary
            }
          />

          <Text
            style={[
              styles.sectionItemTitle,
              activeSection === "examination" &&
                styles.sectionItemTitleActive,
            ]}
          >
            Examination
          </Text>
        </Pressable>

        <Pressable
          disabled={completingVisit}
          onPress={() =>
            setActiveSection("assessment")
          }
          android_ripple={{ color: "#B8D3F5" }}
          style={[
            styles.sectionItem,
            styles.sectionItemWithLeftBorder,
            activeSection === "assessment" &&
              styles.sectionItemActive,
          ]}
        >
          <Ionicons
            name="clipboard-outline"
            size={22}
            color={
              activeSection === "assessment"
                ? COLORS.white
                : COLORS.primary
            }
          />

          <Text
            style={[
              styles.sectionItemTitle,
              activeSection === "assessment" &&
                styles.sectionItemTitleActive,
            ]}
          >
            Assessment
          </Text>
        </Pressable>
      </View>

      <AppKeyboardAwareScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.visitHeaderContainer}>
          <VisitHeaderCard
            sectionTitle={
              getVisitHeaderConfig().sectionTitle
            }
            icon={getVisitHeaderConfig().icon}
            visitId={resolvedVisitId}
          />
        </View>

        {renderActiveSection()}
      </AppKeyboardAwareScrollView>

      <View style={styles.floatingActions}>
  {activeSection !== "history" && (
    <Pressable
      disabled={completingVisit}
      onPress={() => {
        if (activeSection === "assessment") {
          setActiveSection("examination");
        } else {
          setActiveSection("history");
        }
      }}
      android_ripple={{ color: "#DCEBFF" }}
      style={styles.floatingBackButton}
    >
      <Ionicons
        name={
          activeSection === "assessment"
            ? "medkit-outline"
            : "document-text-outline"
        }
        size={25}
        color={COLORS.primary}
      />
    </Pressable>
  )}

  {activeSection !== "assessment" ? (
    <Pressable
      disabled={completingVisit}
      onPress={() => {
        if (activeSection === "history") {
          setActiveSection("examination");
        } else {
          setActiveSection("assessment");
        }
      }}
      android_ripple={{ color: "#DCEBFF" }}
      style={[
        styles.floatingNextButton,
        activeSection === "history" &&
          styles.historyNextButton,
      ]}
    >
      <Ionicons
        name={
          activeSection === "history"
            ? "medkit-outline"
            : "clipboard-outline"
        }
        size={25}
        color={COLORS.white}
      />
    </Pressable>
  ) : (
    <Pressable
      disabled={completingVisit}
      onPress={handleCompleteVisit}
      android_ripple={{ color: "#DCEBFF" }}
      style={styles.saveVisitButton}
    >
      <Ionicons
        name="save-outline"
        size={21}
        color={COLORS.white}
      />

      <Text style={styles.saveVisitText}>
        {completingVisit ? "Saving..." : "Save"}
      </Text>
    </Pressable>
  )}
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  sectionNavigation: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: 0,

    minHeight: 52,
    padding: 3,
    borderRadius: 17,

    backgroundColor: "#E7F1FF",
    borderWidth: 1.5,
    borderColor: COLORS.primary,

    shadowColor: COLORS.black,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 5,

    zIndex: 10,
  },
  
  sectionItem: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 4,
    gap: 6,
  },

  sectionItemWithLeftBorder: {
    borderLeftWidth: 1.5,
    borderLeftColor: "#8FB3E3",
  },

  sectionItemActive: {
    backgroundColor: COLORS.primary,
    elevation: 6,
    shadowColor: COLORS.black,
    shadowOpacity: 0.22,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  
  sectionItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  sectionItemTitleActive: {
    color: COLORS.white,
    fontWeight: "700",
  },

  historyContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },

  contentScroll: {
    flex: 1,
  },

  contentContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },

  visitHeaderContainer: {
    paddingHorizontal: SPACING.md,
  },

  floatingActions: {
    position: "absolute",

    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.md,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  floatingBackButton: {
    width: 70,
    height: 50,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#C9DDF5",
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.14,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  floatingNextButton: {
    width: 70,
    height: 50,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  historyNextButton: {
    marginLeft: "auto",
  },

  saveVisitButton: {
    minWidth: 104,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  saveVisitText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },

  loadingText: {
    color: COLORS.secondaryText,
    fontSize: 16,
    fontWeight: "600",
  },
});