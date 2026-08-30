import { useEffect, useRef, useState } from "react";
import {
  getDrugHistory,
  saveDrugHistory,
  type DrugHistoryResponse,
  type SaveDrugHistoryInput,
} from "@/services/patientApi";
import { useVisitStore } from "@/store/visitStore";
import type {
  DrugHistory,
  Medication,
} from "@/models/VisitForm/history";

/**
 * Drug History persistence rules
 *
 * MANUAL SAVE:
 * - Add Medication
 * - Update Medication
 * - Delete Medication
 *
 * AUTO SAVE:
 * - Compliance
 * - Self Medication
 * - Self Medication Details
 * - Supplements
 * - Supplement Details
 *
 * Important:
 * Backend saves the whole Drug History payload.
 *
 * Therefore:
 * - AutoSave MUST use the last backend-confirmed
 *   medication list.
 * - AutoSave MUST NOT use unsaved medication changes.
 * - AutoSave MUST NOT send invalid dependent fields.
 */

const AUTO_SAVE_DELAY = 700;

/**
 * ======================================================
 * Backend -> Store
 * ======================================================
 */
function mapBackendToStore(
  data: DrugHistoryResponse | null,
): DrugHistory {
  if (!data) {
    return {
      currentMedications: [],
      compliance: null,
      selfMedication: false,
      selfMedicationDetails: null,
      supplements: false,
      supplementDetails: null,
    };
  }

  return {
    currentMedications: data.medications.map(
      (medication) => ({
        id: medication.id,
        medicationName:
          medication.medicationName,
        dose: medication.dose ?? null,
        durationValue:
          medication.durationValue ?? null,
        durationUnit:
          medication.durationUnit ?? null,
        notes:
          medication.notes ?? null,
      }),
    ),

    compliance:
      data.medicationCompliance ?? null,

    selfMedication:
      data.selfMedication,

    selfMedicationDetails:
      data.selfMedicationDetails ?? null,

    supplements:
      data.takesSupplements,

    supplementDetails:
      data.supplementDetails ?? null,
  };
}

/**
 * ======================================================
 * Medications -> API
 * ======================================================
 */
function mapMedicationsToApi(
  medications: Medication[],
): SaveDrugHistoryInput["medications"] {
  return medications.map((medication) => ({
    medicationName:
      medication.medicationName.trim(),

    dose:
      medication.dose?.trim() || null,

    durationValue:
      medication.durationValue ?? null,

    durationUnit:
      medication.durationUnit ?? null,

    notes:
      medication.notes?.trim() || null,
  }));
}

/**
 * ======================================================
 * Store -> API
 * ======================================================
 */
function mapStoreToApi(
  drugHistory: DrugHistory,
  medicationsOverride?: Medication[],
): SaveDrugHistoryInput {
  const medications =
    medicationsOverride ??
    drugHistory.currentMedications;

  return {
    medications:
      mapMedicationsToApi(medications),

    medicationCompliance:
      drugHistory.compliance ?? null,

    selfMedication:
      drugHistory.selfMedication,

    selfMedicationDetails:
      drugHistory.selfMedication
        ? drugHistory.selfMedicationDetails?.trim() ||
          null
        : null,

    takesSupplements:
      drugHistory.supplements,

    supplementDetails:
      drugHistory.supplements
        ? drugHistory.supplementDetails?.trim() ||
          null
        : null,
  };
}

/**
 * ======================================================
 * Backend -> complete Store
 * ======================================================
 */
function updateStoreFromBackend(
  data: DrugHistoryResponse | null,
) {
  const store = useVisitStore.getState();
  const currentVisit = store.visit;

  const drugHistory =
    mapBackendToStore(data);

  store.setVisit({
    ...currentVisit,
    history: {
      ...currentVisit.history,
      drugHistory,
    },
  });
}

/**
 * ======================================================
 * Update ONLY medications in Store
 * ======================================================
 *
 * Used after manual medication save.
 *
 * We intentionally do NOT replace the complete
 * DrugHistory because AutoSave fields may have
 * changed while the medication request was running.
 */
function updateStoreMedications(
  medications: Medication[],
) {
  const store = useVisitStore.getState();
  const currentVisit = store.visit;

  store.setVisit({
    ...currentVisit,
    history: {
      ...currentVisit.history,
      drugHistory: {
        ...currentVisit.history.drugHistory,
        currentMedications:
          medications,
      },
    },
  });
}

/**
 * ======================================================
 * Clone medications
 * ======================================================
 */
function cloneMedications(
  medications: Medication[],
): Medication[] {
  return medications.map(
    (medication) => ({
      ...medication,
    }),
  );
}

/**
 * ======================================================
 * Validate AutoSave-dependent fields
 * ======================================================
 *
 * Backend requires:
 *
 * selfMedication = true
 *        =>
 * selfMedicationDetails must contain text
 *
 * supplements = true
 *        =>
 * supplementDetails must contain text
 *
 * We do NOT send an invalid request.
 */
function canAutoSaveDrugHistory(
  drugHistory: DrugHistory,
): boolean {
  if (
    drugHistory.selfMedication &&
    !drugHistory.selfMedicationDetails?.trim()
  ) {
    return false;
  }

  if (
    drugHistory.supplements &&
    !drugHistory.supplementDetails?.trim()
  ) {
    return false;
  }

  return true;
}

export default function useDrugHistoryAutoSave(
  patientId: string,
) {
  const drugHistory =
    useVisitStore(
      (state) =>
        state.visit.history.drugHistory,
    );

  const [isHydrating, setIsHydrating] =
    useState(false);

  const [
    isSavingMedications,
    setIsSavingMedications,
  ] = useState(false);

  const [isAutoSaving, setIsAutoSaving] =
    useState(false);

  const [
    autoSaveError,
    setAutoSaveError,
  ] = useState<string | null>(null);

  const [
    medicationSaveError,
    setMedicationSaveError,
  ] = useState<string | null>(null);

  /**
   * ======================================================
   * Last medications confirmed by Backend
   * ======================================================
   *
   * IMPORTANT:
   *
   * Store may contain unsaved medication changes.
   *
   * AutoSave MUST NEVER use those changes.
   */
  const persistedMedicationsRef =
    useRef<Medication[]>([]);

  /**
   * ======================================================
   * Hydration state
   * ======================================================
   */
  const hydratedPatientIdRef =
    useRef<string | null>(null);

  /**
   * ======================================================
   * AutoSave debounce timer
   * ======================================================
   */
  const autoSaveTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  /**
   * ======================================================
   * Request version
   * ======================================================
   *
   * Prevents old patient requests from modifying
   * current patient state.
   */
  const requestVersionRef =
    useRef(0);

  /**
   * ======================================================
   * Backend request queue
   * ======================================================
   *
   * Manual Save and AutoSave use the same endpoint.
   *
   * Requests are therefore serialized.
   */
  const requestQueueRef =
    useRef<Promise<unknown>>(
      Promise.resolve(),
    );

  const enqueueRequest = <T,>(
    request: () => Promise<T>,
  ): Promise<T> => {
    const nextRequest =
      requestQueueRef.current
        .catch(() => undefined)
        .then(request);

    requestQueueRef.current =
      nextRequest.catch(
        () => undefined,
      );

    return nextRequest;
  };

  /**
   * ======================================================
   * Manual Save synchronous lock
   * ======================================================
   *
   * React state alone is not enough to prevent
   * extremely fast double presses.
   */
  const medicationSaveLockRef =
    useRef(false);

  /**
   * ======================================================
   * Load Drug History from Backend
   * ======================================================
   */
  useEffect(() => {
    if (!patientId) {
      return;
    }

    const requestVersion =
      ++requestVersionRef.current;

    /**
     * Reset hydration state for the new patient.
     */
    hydratedPatientIdRef.current =
      null;

    /**
     * Reset AutoSave baseline.
     */
    previousAutoSavePayloadKeyRef.current =
      null;

    /**
     * Cancel any old debounce timer.
     */
    if (autoSaveTimerRef.current) {
      clearTimeout(
        autoSaveTimerRef.current,
      );

      autoSaveTimerRef.current =
        null;
    }

    const loadDrugHistory =
      async () => {
        try {
          setIsHydrating(true);
          setAutoSaveError(null);
          setMedicationSaveError(null);

          const data =
            await getDrugHistory(
              patientId,
            );

          if (
            requestVersion !==
            requestVersionRef.current
          ) {
            return;
          }

          const mapped =
            mapBackendToStore(data);

          /**
           * Backend-confirmed medications
           * become the persisted medication snapshot.
           */
          persistedMedicationsRef.current =
            cloneMedications(
              mapped.currentMedications,
            );

          /**
           * Hydrate complete Drug History.
           */
          updateStoreFromBackend(data);

          hydratedPatientIdRef.current =
            patientId;
        } catch (error) {
          if (
            requestVersion !==
            requestVersionRef.current
          ) {
            return;
          }

          console.error(
            "Failed to load drug history:",
            error,
          );

          setAutoSaveError(
            "Failed to load drug history.",
          );
        } finally {
          if (
            requestVersion ===
            requestVersionRef.current
          ) {
            setIsHydrating(false);
          }
        }
      };

    loadDrugHistory();

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(
          autoSaveTimerRef.current,
        );

        autoSaveTimerRef.current =
          null;
      }
    };
  }, [patientId]);

  /**
   * ======================================================
   * AutoSave Payload Key
   * ======================================================
   *
   * Medication list is deliberately excluded.
   */
  const autoSavePayloadKey =
    JSON.stringify({
      compliance:
        drugHistory.compliance,

      selfMedication:
        drugHistory.selfMedication,

      selfMedicationDetails:
        drugHistory.selfMedicationDetails,

      supplements:
        drugHistory.supplements,

      supplementDetails:
        drugHistory.supplementDetails,
    });

  const previousAutoSavePayloadKeyRef =
    useRef<string | null>(null);

  /**
   * ======================================================
   * AutoSave
   * ======================================================
   */
  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (
      isHydrating ||
      hydratedPatientIdRef.current !==
        patientId
    ) {
      return;
    }

    /**
     * First render after hydration:
     *
     * Establish baseline only.
     * DO NOT save.
     */
    if (
      previousAutoSavePayloadKeyRef.current ===
      null
    ) {
      previousAutoSavePayloadKeyRef.current =
        autoSavePayloadKey;

      return;
    }

    /**
     * Nothing actually changed.
     */
    if (
      previousAutoSavePayloadKeyRef.current ===
      autoSavePayloadKey
    ) {
      return;
    }

    /**
     * Update baseline immediately.
     *
     * If the state is temporarily invalid,
     * a later change (e.g. entering details)
     * produces a new key and triggers AutoSave.
     */
    previousAutoSavePayloadKeyRef.current =
      autoSavePayloadKey;

    /**
     * Cancel previous debounce.
     */
    if (autoSaveTimerRef.current) {
      clearTimeout(
        autoSaveTimerRef.current,
      );

      autoSaveTimerRef.current =
        null;
    }

    autoSaveTimerRef.current =
      setTimeout(() => {
        /**
         * Always read latest Store state.
         */
        const latestStore =
          useVisitStore.getState();

        const latestDrugHistory =
          latestStore.visit.history
            .drugHistory;

        /**
         * ==================================================
         * IMPORTANT BACKEND VALIDATION
         * ==================================================
         *
         * Do NOT send:
         *
         * selfMedication=true
         * selfMedicationDetails=null/""
         *
         * or:
         *
         * supplements=true
         * supplementDetails=null/""
         */
        if (
          !canAutoSaveDrugHistory(
            latestDrugHistory,
          )
        ) {
          return;
        }

        /**
         * ==================================================
         * IMPORTANT:
         * Use ONLY persisted medications.
         * ==================================================
         */
        const persistedMedications =
          cloneMedications(
            persistedMedicationsRef.current,
          );

        const payload =
          mapStoreToApi(
            latestDrugHistory,
            persistedMedications,
          );

        setIsAutoSaving(true);
        setAutoSaveError(null);

        enqueueRequest(
          async () => {
            const data =
              await saveDrugHistory(
                patientId,
                payload,
              );

            /**
             * Backend response becomes authoritative
             * for the persisted medication snapshot.
             */
            const mapped =
              mapBackendToStore(data);

            persistedMedicationsRef.current =
              cloneMedications(
                mapped.currentMedications,
              );

            /**
             * Only update AutoSave fields.
             *
             * DO NOT replace medications in Store.
             */
            const current =
              useVisitStore.getState()
                .visit;

            useVisitStore
              .getState()
              .setVisit({
                ...current,
                history: {
                  ...current.history,
                  drugHistory: {
                    ...current.history
                      .drugHistory,

                    compliance:
                      mapped.compliance,

                    selfMedication:
                      mapped.selfMedication,

                    selfMedicationDetails:
                      mapped.selfMedicationDetails,

                    supplements:
                      mapped.supplements,

                    supplementDetails:
                      mapped.supplementDetails,
                  },
                },
              });
          },
        )
          .catch((error: any) => {
            console.error(
              "Failed to auto-save drug history:",
              error,
            );

            console.error(
              "Drug History AutoSave response:",
              error?.response?.data,
            );

            console.error(
              "Drug History AutoSave status:",
              error?.response?.status,
            );

            console.error(
              "Drug History AutoSave payload:",
              payload,
            );

            setAutoSaveError(
              "Failed to save drug history.",
            );
          })
          .finally(() => {
            setIsAutoSaving(false);
          });

        autoSaveTimerRef.current =
          null;
      }, AUTO_SAVE_DELAY);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(
          autoSaveTimerRef.current,
        );

        autoSaveTimerRef.current =
          null;
      }
    };
  }, [
    patientId,
    isHydrating,
    autoSavePayloadKey,
  ]);

  /**
   * ======================================================
   * MANUAL MEDICATION SAVE
   * ======================================================
   *
   * Called ONLY after:
   * - Add Medication
   * - Update Medication
   * - Delete Medication
   *
   * Persists the COMPLETE medication list.
   */
  const saveMedications =
    async (): Promise<
      DrugHistoryResponse
    > => {
      if (!patientId) {
        throw new Error(
          "Patient ID is required.",
        );
      }

      if (
        hydratedPatientIdRef.current !==
        patientId
      ) {
        throw new Error(
          "Drug history is still loading.",
        );
      }

      /**
       * Synchronous lock.
       *
       * Prevents double-submit even before
       * React updates isSavingMedications.
       */
      if (medicationSaveLockRef.current) {
        throw new Error(
          "Medication save already in progress.",
        );
      }

      medicationSaveLockRef.current =
        true;

      /**
       * Cancel any pending AutoSave debounce.
       *
       * This prevents an old AutoSave request from
       * being generated while medication changes
       * are being manually persisted.
       */
      if (autoSaveTimerRef.current) {
        clearTimeout(
          autoSaveTimerRef.current,
        );

        autoSaveTimerRef.current =
          null;
      }

      /**
       * Always read latest Store state.
       */
      const latestStore =
        useVisitStore.getState();

      const latestDrugHistory =
        latestStore.visit.history
          .drugHistory;

      /**
       * Snapshot of the last backend-confirmed
       * medication list for rollback.
       */
      const previousPersistedMedications =
        cloneMedications(
          persistedMedicationsRef.current,
        );

      /**
       * Snapshot current medication list.
       *
       * This is the list we intentionally want
       * to save manually.
       */
      const medicationsToSave =
        cloneMedications(
          latestDrugHistory.currentMedications,
        );

      /**
       * Backend saves the complete Drug History
       * payload, therefore AutoSave fields are
       * included in this manual request too.
       */
      const payload =
        mapStoreToApi(
          latestDrugHistory,
          medicationsToSave,
        );

      setIsSavingMedications(true);
      setMedicationSaveError(null);

      try {
        const data =
          await enqueueRequest(
            () =>
              saveDrugHistory(
                patientId,
                payload,
              ),
          );

        /**
         * Backend is authoritative.
         */
        const mapped =
          mapBackendToStore(data);

        persistedMedicationsRef.current =
          cloneMedications(
            mapped.currentMedications,
          );

        /**
         * IMPORTANT:
         *
         * Update ONLY medications in Store.
         *
         * AutoSave fields may have changed while
         * the manual medication request was running.
         *
         * Replacing the whole DrugHistory here could
         * overwrite those newer values with the older
         * request response.
         */
        updateStoreMedications(
          mapped.currentMedications,
        );

        return data;
      } catch (error) {
        console.error(
          "Failed to save medications:",
          error,
        );

        /**
         * Roll back ONLY medications.
         *
         * Preserve the current AutoSave fields.
         */
        updateStoreMedications(
          previousPersistedMedications,
        );

        setMedicationSaveError(
          "Failed to save medication changes.",
        );

        throw error;
      } finally {
        medicationSaveLockRef.current =
          false;

        setIsSavingMedications(false);
      }
    };

  /**
   * ======================================================
   * Cleanup
   * ======================================================
   */
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(
          autoSaveTimerRef.current,
        );

        autoSaveTimerRef.current =
          null;
      }

      medicationSaveLockRef.current =
        false;
    };
  }, []);

  return {
    isHydrating,
    isSavingMedications,
    isAutoSaving,
    autoSaveError,
    medicationSaveError,
    saveMedications,
  };
}