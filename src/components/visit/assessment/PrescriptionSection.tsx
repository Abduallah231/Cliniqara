import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import PrescriptionForm from "./PrescriptionForm";
import { useVisitStore } from "@/store/visitStore";
import {
  getPrescription,
} from "@/services/visitApi";
import {
  mapPrescriptionFromBackend,
} from "@/hooks/usePrescriptionAutoSave";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import { router } from "expo-router";

import usePrescriptionAutoSave from "@/hooks/usePrescriptionAutoSave";

export default function PrescriptionSection() {
  const prescription = useVisitStore(
    (state) =>
      state.visit.assessment.prescription,
  );

  const setVisit = useVisitStore(
    (state) => state.setVisit,
  );

  const addPrescriptionMedication =
    useVisitStore(
      (state) =>
        state.addPrescriptionMedication,
    );

  const updatePrescriptionMedication =
    useVisitStore(
      (state) =>
        state.updatePrescriptionMedication,
    );

  const removePrescriptionMedication =
    useVisitStore(
      (state) =>
        state.removePrescriptionMedication,
    );

  const updatePrescriptionAdvice =
    useVisitStore(
      (state) =>
        state.updatePrescriptionAdvice,
    );

  const updatePrescriptionNotes =
    useVisitStore(
      (state) =>
        state.updatePrescriptionNotes,
    );

  const updatePrescriptionFollowUp =
    useVisitStore(
      (state) =>
        state.updatePrescriptionFollowUp,
    );

  const visitId =
    useVisitStore(
      (state) => state.visit.metadata.id,
    );

  const [isHydrating, setIsHydrating] =
    useState(false);

  const loadedVisitId =
    useRef<string | null>(null);

  usePrescriptionAutoSave({
    visitId,
    prescription,
    isHydrating,
  });

  // ======================================================
  // Load Prescription
  // ======================================================
  useEffect(() => {
    if (
      !visitId ||
      loadedVisitId.current === visitId
    ) {
      return;
    }

    const loadPrescription = async () => {
      try {
        setIsHydrating(true);

        const data =
          await getPrescription(visitId);

        /*
         * No prescription has been saved
         * for this visit yet.
         *
         * Keep the current empty UI state.
         */
        if (!data) {
          loadedVisitId.current = visitId;
          return;
        }

        const mappedPrescription =
          mapPrescriptionFromBackend(data);

        setVisit({
          ...useVisitStore.getState().visit,
          assessment: {
            ...useVisitStore.getState()
              .visit.assessment,
            prescription:
              mappedPrescription,
          },
        });

        loadedVisitId.current = visitId;
      } catch (error) {
        console.error(
          "Failed to load prescription:",
          error,
        );
      } finally {
        setIsHydrating(false);
      }
    };

    loadPrescription();
  }, [visitId, setVisit]);

  // ======================================================
  // Medication
  // ======================================================
  const addMedication = () => {
    addPrescriptionMedication({
      medication: "",
      instructions: "",
      durationValue: "",
      durationUnit: "DAYS",
    });
  };

  const removeMedication = (
    index: number,
  ) => {
    /*
     * Keep at least one medication card
     * in the current UI.
     */
    if (
      prescription.medications.length ===
      1
    ) {
      return;
    }

    removePrescriptionMedication(index);
  };

  return (
    <View style={styles.container}>
      {/* ==================================================
          Import Prescription Template
          This belongs to PrescriptionSection only
      ================================================== */}
      <Pressable
        style={styles.templateButton}
        onPress={() => {
          if (!visitId) {
            return;
          }

          router.push({
            pathname:
              "/prescription-template-import",
            params: {
              visitId,
            },
          });
        }}
      >
        <Ionicons
          name="library-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.templateText}>
          Import Prescription Template
        </Text>
      </Pressable>

      {/* ==================================================
          Shared Prescription Form
      ================================================== */}
      <PrescriptionForm
        medications={
          prescription.medications
        }
        advice={prescription.advice}
        notes={prescription.notes}
        followUp={prescription.followUp}
        onAddMedication={
          addMedication
        }
        onUpdateMedication={(
          index,
          updates,
        ) =>
          updatePrescriptionMedication(
            index,
            updates,
          )
        }
        onRemoveMedication={
          removeMedication
        }
        onUpdateAdvice={
          updatePrescriptionAdvice
        }
        onUpdateNotes={
          updatePrescriptionNotes
        }
        onUpdateFollowUp={
          updatePrescriptionFollowUp
        }
      />

      {/* ==================================================
          Print Prescription
          This belongs to PrescriptionSection only
      ================================================== */}
      <Pressable
        style={styles.printButton}
        onPress={() => {
          // TODO:
          // Open prescription preview / print
        }}
      >
        <Ionicons
          name="print-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text
          style={
            styles.printButtonText
          }
        >
          Print Prescription
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  templateButton: {
    height: 54,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  templateText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  printButton: {
    height: 52,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  printButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});