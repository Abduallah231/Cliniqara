import {
  useEffect,
  useRef,
  useState,
} from "react";
import { saveVaccinationHistory } from "@/services/visitApi";
import { useVisitStore } from "@/store/visitStore";

interface Props {
  patientId?: string;
  vaccinationHistory: Record<string, any>;
  isHydrating?: boolean;
}

export default function useVaccinationHistoryAutoSave({
  patientId,
  vaccinationHistory,
  isHydrating = false,
}: Props) {
  // ======================================================
  // Auto-save state
  // ======================================================
  const [
    activeSaveCount,
    setActiveSaveCount,
  ] = useState(0);

  const isAutoSaving =
    activeSaveCount > 0;

  // ======================================================
  // One initialization state per section
  // ======================================================
  const statusInitialized =
    useRef(false);

  const partialInitialized =
    useRef(false);

  const unvaccinatedInitialized =
    useRef(false);

  const reactionInitialized =
    useRef(false);

  // ======================================================
  // Previous values per section
  // ======================================================
  const previousStatusKey =
    useRef<string | null>(null);

  const previousPartialKey =
    useRef<string | null>(null);

  const previousUnvaccinatedKey =
    useRef<string | null>(null);

  const previousReactionKey =
    useRef<string | null>(null);

  // ======================================================
  // Patient tracking
  // ======================================================
  const initializedPatientId =
    useRef<string | null>(null);

  // ======================================================
  // Save queue
  //
  // Backend upserts the complete vaccination history.
  // Each section triggers independently, but saves are
  // serialized and always read the latest Store state.
  // ======================================================
  const saveQueue =
    useRef<Promise<void>>(
      Promise.resolve(),
    );

  // ======================================================
  // Reset section initialization
  // when patient changes
  // ======================================================
  useEffect(() => {
    if (
      initializedPatientId.current ===
      patientId
    ) {
      return;
    }

    initializedPatientId.current =
      patientId ?? null;

    statusInitialized.current =
      false;

    partialInitialized.current =
      false;

    unvaccinatedInitialized.current =
      false;

    reactionInitialized.current =
      false;

    previousStatusKey.current =
      null;

    previousPartialKey.current =
      null;

    previousUnvaccinatedKey.current =
      null;

    previousReactionKey.current =
      null;
  }, [patientId]);

  // ======================================================
  // Queue save
  // ======================================================
  const queueSave = (
    sectionName: string,
  ) => {
    if (!patientId) {
      return;
    }

    saveQueue.current =
      saveQueue.current.then(
        async () => {
          const latestHistory =
            useVisitStore
              .getState()
              .visit
              .history
              .vaccinationHistory;

          setActiveSaveCount(
            (count) => count + 1,
          );

          try {
            await saveVaccinationHistory(
              patientId,
              {
                vaccinationStatus:
                  latestHistory.vaccinationStatus ??
                  undefined,

                missedVaccines:
                  latestHistory.missedVaccines ??
                  [],

                partialReason:
                  latestHistory.partialReason ??
                  undefined,

                partialOtherDetails:
                  latestHistory.partialOtherDetails ??
                  undefined,

                unvaccinatedReason:
                  latestHistory.unvaccinatedReason ??
                  undefined,

                unvaccinatedOtherDetails:
                  latestHistory.unvaccinatedOtherDetails ??
                  undefined,

                previousReaction:
                  latestHistory.previousReaction ??
                  undefined,

                reactionSeverity:
                  latestHistory.reactionSeverity ??
                  undefined,

                reactionDetails:
                  latestHistory.reactionDetails ??
                  undefined,
              },
            );
          } catch (error: any) {
            const message =
              error?.response?.data
                ?.message;

            /*
             * Expected intermediate state:
             *
             * PARTIALLY_VACCINATED may temporarily
             * have no missed vaccine selected.
             */
            if (
              message ===
              "At least one missed vaccine is required for a partially vaccinated patient."
            ) {
              return;
            }

            console.error(
              `VACCINATION HISTORY ${sectionName} AUTOSAVE FAILED:`,
              error?.response?.data ??
                error,
            );
          } finally {
            setActiveSaveCount(
              (count) =>
                Math.max(
                  0,
                  count - 1,
                ),
            );
          }
        },
      );
  };

  // ======================================================
  // SECTION 1
  // Vaccination Status
  // ======================================================
  useEffect(() => {
    if (
      !patientId ||
      isHydrating
    ) {
      return;
    }

    const status =
      vaccinationHistory.vaccinationStatus ??
      null;

    const key = JSON.stringify(
      status,
    );

    /*
     * First render after hydration:
     * establish baseline only.
     */
    if (
      !statusInitialized.current
    ) {
      statusInitialized.current =
        true;

      previousStatusKey.current =
        key;

      return;
    }

    if (
      previousStatusKey.current ===
      key
    ) {
      return;
    }

    previousStatusKey.current =
      key;

    /*
     * No status -> nothing to save.
     */
    if (!status) {
      return;
    }

    /*
     * PARTIALLY_VACCINATED requires
     * missed vaccines + partial reason.
     *
     * Wait for those fields.
     */
    if (
      status ===
      "PARTIALLY_VACCINATED"
    ) {
      const missedVaccines =
        vaccinationHistory.missedVaccines ??
        [];

      if (
        missedVaccines.length === 0
      ) {
        return;
      }

      if (
        !vaccinationHistory.partialReason
      ) {
        return;
      }

      if (
        vaccinationHistory.partialReason ===
          "OTHER" &&
        !vaccinationHistory.partialOtherDetails?.trim()
      ) {
        return;
      }
    }

    /*
     * UNVACCINATED requires reason.
     */
    if (
      status === "UNVACCINATED"
    ) {
      if (
        !vaccinationHistory.unvaccinatedReason
      ) {
        return;
      }

      if (
        vaccinationHistory.unvaccinatedReason ===
          "OTHER" &&
        !vaccinationHistory.unvaccinatedOtherDetails?.trim()
      ) {
        return;
      }
    }

    const timer = setTimeout(
      () => {
        queueSave(
          "STATUS",
        );
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    vaccinationHistory.vaccinationStatus,
  ]);

  // ======================================================
  // SECTION 2
  // Partially Vaccinated
  // ======================================================
  useEffect(() => {
    if (
      !patientId ||
      isHydrating
    ) {
      return;
    }

    const key =
      JSON.stringify({
        missedVaccines:
          vaccinationHistory.missedVaccines ??
          [],
        partialReason:
          vaccinationHistory.partialReason ??
          null,
        partialOtherDetails:
          vaccinationHistory.partialOtherDetails ??
          null,
      });

    /*
     * Establish initial baseline.
     */
    if (
      !partialInitialized.current
    ) {
      partialInitialized.current =
        true;

      previousPartialKey.current =
        key;

      return;
    }

    if (
      previousPartialKey.current ===
      key
    ) {
      return;
    }

    previousPartialKey.current =
      key;

    /*
     * This section only applies
     * to PARTIALLY_VACCINATED.
     */
    if (
      vaccinationHistory.vaccinationStatus !==
      "PARTIALLY_VACCINATED"
    ) {
      return;
    }

    const missedVaccines =
      vaccinationHistory.missedVaccines ??
      [];

    const partialReason =
      vaccinationHistory.partialReason;

    /*
     * Backend requires missed vaccines.
     */
    if (
      missedVaccines.length === 0
    ) {
      return;
    }

    /*
     * Backend requires partial reason.
     */
    if (!partialReason) {
      return;
    }

    /*
     * OTHER requires details.
     */
    if (
      partialReason ===
        "OTHER" &&
      !vaccinationHistory.partialOtherDetails?.trim()
    ) {
      return;
    }

    const timer = setTimeout(
      () => {
        queueSave(
          "PARTIAL",
        );
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    vaccinationHistory.vaccinationStatus,
    JSON.stringify(
      vaccinationHistory.missedVaccines ??
        [],
    ),
    vaccinationHistory.partialReason,
    vaccinationHistory.partialOtherDetails,
  ]);

  // ======================================================
  // SECTION 3
  // Unvaccinated
  // ======================================================
  useEffect(() => {
    if (
      !patientId ||
      isHydrating
    ) {
      return;
    }

    const key =
      JSON.stringify({
        unvaccinatedReason:
          vaccinationHistory.unvaccinatedReason ??
          null,
        unvaccinatedOtherDetails:
          vaccinationHistory.unvaccinatedOtherDetails ??
          null,
      });

    /*
     * Establish initial baseline.
     */
    if (
      !unvaccinatedInitialized.current
    ) {
      unvaccinatedInitialized.current =
        true;

      previousUnvaccinatedKey.current =
        key;

      return;
    }

    if (
      previousUnvaccinatedKey.current ===
      key
    ) {
      return;
    }

    previousUnvaccinatedKey.current =
      key;

    /*
     * This section only applies
     * to UNVACCINATED.
     */
    if (
      vaccinationHistory.vaccinationStatus !==
      "UNVACCINATED"
    ) {
      return;
    }

    const reason =
      vaccinationHistory.unvaccinatedReason;

    /*
     * Backend requires reason.
     */
    if (!reason) {
      return;
    }

    /*
     * OTHER requires details.
     */
    if (
      reason === "OTHER" &&
      !vaccinationHistory.unvaccinatedOtherDetails?.trim()
    ) {
      return;
    }

    const timer = setTimeout(
      () => {
        queueSave(
          "UNVACCINATED",
        );
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    vaccinationHistory.vaccinationStatus,
    vaccinationHistory.unvaccinatedReason,
    vaccinationHistory.unvaccinatedOtherDetails,
  ]);

  // ======================================================
  // SECTION 4
  // Previous Vaccine Reaction
  // ======================================================
  useEffect(() => {
    if (
      !patientId ||
      isHydrating
    ) {
      return;
    }

    const key =
      JSON.stringify({
        previousReaction:
          vaccinationHistory.previousReaction ??
          null,
        reactionSeverity:
          vaccinationHistory.reactionSeverity ??
          null,
        reactionDetails:
          vaccinationHistory.reactionDetails ??
          null,
      });

    /*
     * Establish initial baseline.
     */
    if (
      !reactionInitialized.current
    ) {
      reactionInitialized.current =
        true;

      previousReactionKey.current =
        key;

      return;
    }

    if (
      previousReactionKey.current ===
      key
    ) {
      return;
    }

    previousReactionKey.current =
      key;

    /*
     * Reaction section is not available
     * while vaccination status is UNKNOWN.
     */
    if (
      vaccinationHistory.vaccinationStatus ===
      "UNKNOWN"
    ) {
      return;
    }

    const previousReaction =
      vaccinationHistory.previousReaction;

    /*
     * No reaction:
     *
     * Valid state:
     * previousReaction = false
     * severity/details = null
     */
    if (
      previousReaction === false
    ) {
      const timer =
        setTimeout(() => {
          queueSave(
            "REACTION",
          );
        }, 500);

      return () => {
        clearTimeout(timer);
      };
    }

    /*
     * Nothing selected yet.
     */
    if (
      previousReaction !== true
    ) {
      return;
    }

    /*
     * Backend requires severity
     * and details when reaction = true.
     */
    if (
      !vaccinationHistory.reactionSeverity
    ) {
      return;
    }

    if (
      !vaccinationHistory.reactionDetails?.trim()
    ) {
      return;
    }

    const timer = setTimeout(
      () => {
        queueSave(
          "REACTION",
        );
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    vaccinationHistory.vaccinationStatus,
    vaccinationHistory.previousReaction,
    vaccinationHistory.reactionSeverity,
    vaccinationHistory.reactionDetails,
  ]);

  // ======================================================
  // Return
  // ======================================================
  return {
    isAutoSaving,
  };
}