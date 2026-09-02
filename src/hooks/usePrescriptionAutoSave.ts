import { useEffect, useRef } from "react";
import {
  getPrescription,
  savePrescription,
} from "@/services/visitApi";
import type {
  PrescriptionMedicationInput,
  PrescriptionResponse,
  PrescriptionDurationUnit,
} from "@/services/visitApi";
import type {
  Prescription,
  PrescriptionMedication,
} from "@/models/VisitForm/assessment";

interface UsePrescriptionAutoSaveProps {
  visitId?: string;
  prescription: Prescription;
  isHydrating?: boolean;
}

function mapMedicationFromBackend(
  medication: PrescriptionResponse["medications"][number],
): PrescriptionMedication {
  return {
    medication: medication.medication,
    instructions: medication.instructions ?? "",
    durationValue:
      medication.durationValue !== null &&
      medication.durationValue !== undefined
        ? String(medication.durationValue)
        : "",
    durationUnit:
      isPrescriptionDurationUnit(medication.durationUnit)
        ? medication.durationUnit
        : "DAYS",
  };
}

function isPrescriptionDurationUnit(
  value: string | null,
): value is PrescriptionDurationUnit {
  return (
    value === "DAYS" ||
    value === "WEEKS" ||
    value === "MONTHS" ||
    value === "YEARS"
  );
}

export function mapPrescriptionFromBackend(
  data: PrescriptionResponse,
): Prescription {
  return {
    medications: data.medications.map(
      mapMedicationFromBackend,
    ),
    advice: data.advice ?? "",
    notes: data.notes ?? "",
    followUp: data.followUp ?? "",
  };
}

function mapDurationValueToBackend(
  value: string,
): number | null {
  const text = value.trim();

  if (!text) {
    return null;
  }

  const parsed = Number(text);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

function mapMedicationToBackend(
  medication: PrescriptionMedication,
  index: number,
): PrescriptionMedicationInput {
  return {
    medication: medication.medication,
    instructions:
      medication.instructions.trim() || null,
    durationValue: mapDurationValueToBackend(
      medication.durationValue,
    ),
    durationUnit:
      medication.durationUnit || null,
    sortOrder: index,
  };
}

export function mapPrescriptionToBackend(
  prescription: Prescription,
) {
  return {
    medications:
      prescription.medications.map(
        mapMedicationToBackend,
      ),
    advice:
      prescription.advice.trim() || null,
    notes:
      prescription.notes.trim() || null,
    followUp:
      prescription.followUp.trim() || null,
  };
}

export default function usePrescriptionAutoSave({
  visitId,
  prescription,
  isHydrating = false,
}: UsePrescriptionAutoSaveProps) {
  const isFirstRender = useRef(true);
  const hydratedSignature = useRef<string | null>(
    null,
  );

  useEffect(() => {
    if (!visitId) {
      return;
    }

    const signature = JSON.stringify(
      prescription,
    );

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHydrating) {
      hydratedSignature.current = signature;
      return;
    }

    if (
      hydratedSignature.current === signature
    ) {
      hydratedSignature.current = null;
      return;
    }

    const timer = setTimeout(() => {
      savePrescription(
        visitId,
        mapPrescriptionToBackend(
          prescription,
        ),
      ).catch((error: any) => {
        console.error(
          "PRESCRIPTION AUTOSAVE FAILED:",
          error?.response?.data ?? error,
        );
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    isHydrating,
    JSON.stringify(prescription),
  ]);
}