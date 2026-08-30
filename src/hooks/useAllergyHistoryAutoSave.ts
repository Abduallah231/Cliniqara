import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAllergyHistory,
  saveAllergyHistory,
  type SaveAllergyHistoryInput,
} from "@/services/patientApi";
import { useVisitStore } from "@/store/visitStore";
import type {
  Allergy,
  AllergyHistory,
  AllergySeverity,
  AllergyType,
} from "@/models/VisitForm/history";

// ======================================================
// Types
// ======================================================

type UseAllergyHistoryAutoSaveParams = {
  patientId: string;
};

type SaveResult = {
  success: boolean;
};

// ======================================================
// Backend → Store
// ======================================================

function mapAllergyFromBackend(
  allergy: NonNullable<
    Awaited<ReturnType<typeof getAllergyHistory>>
  >["allergies"][number],
): Allergy {
  return {
    id: allergy.id,
    type: allergy.type as AllergyType,
    allergen: allergy.allergen,
    reaction: allergy.reaction,
    severity: allergy.severity as AllergySeverity,
    notes: allergy.notes,
  };
}

// ======================================================
// Build API Payload
// ======================================================

export function buildAllergyHistoryPayload(
  allergyHistory: AllergyHistory,
): SaveAllergyHistoryInput {
  return {
    hasAllergy: allergyHistory.hasAllergy,
    allergies: allergyHistory.allergies.map(
      (allergy) => ({
        type: allergy.type,
        allergen: allergy.allergen.trim(),
        reaction:
          allergy.reaction?.trim() || null,
        severity: allergy.severity,
        notes:
          allergy.notes?.trim() || null,
      }),
    ),
  };
}

// ======================================================
// Hook
// ======================================================

export default function useAllergyHistoryAutoSave({
  patientId,
}: UseAllergyHistoryAutoSaveParams) {
  const {
    visit,
    updateHasAllergy,
    addAllergy,
    removeAllergy,
  } = useVisitStore();

  const [isHydrating, setIsHydrating] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isAutoSaving, setIsAutoSaving] =
    useState(false);

  const [isLoaded, setIsLoaded] =
    useState(false);

  const timerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const lastSavedPayloadRef =
    useRef<string | null>(null);

  /**
   * Prevents the useEffect auto-save from
   * sending another request immediately after
   * a manual Add / Update / Delete / No action.
   */
  const skipNextAutoSaveRef =
    useRef(false);

  /**
   * Used to prevent concurrent save operations.
   */
  const saveInFlightRef =
    useRef(false);

  // ======================================================
  // Hydration
  // ======================================================

  useEffect(() => {
    if (!patientId) {
      setIsHydrating(false);
      setIsLoaded(false);
      return;
    }

    let cancelled = false;

    const loadAllergyHistory =
      async () => {
        try {
          setIsHydrating(true);
          setIsLoaded(false);

          const data =
            await getAllergyHistory(
              patientId,
            );

          if (cancelled) {
            return;
          }

          /**
           * Backend has no record yet.
           *
           * Keep the current empty Store state.
           */
          if (!data) {
            lastSavedPayloadRef.current =
              JSON.stringify({
                hasAllergy: false,
                allergies: [],
              });

            setIsLoaded(true);
            return;
          }

          /**
           * Important:
           *
           * First remove the current Store
           * allergies so hydration cannot
           * duplicate existing entries.
           */
          const currentAllergies =
            useVisitStore
              .getState()
              .visit.history
              .allergyHistory
              .allergies;

          currentAllergies.forEach(
            (allergy) => {
              useVisitStore
                .getState()
                .removeAllergy(
                  allergy.id,
                );
            },
          );

          /**
           * Restore hasAllergy.
           */
          useVisitStore
            .getState()
            .updateHasAllergy(
              data.hasAllergy,
            );

          /**
           * Restore allergies.
           */
          data.allergies.forEach(
            (allergy) => {
              useVisitStore
                .getState()
                .addAllergy(
                  mapAllergyFromBackend(
                    allergy,
                  ),
                );
            },
          );

          /**
           * Mark the hydrated state as the
           * latest state already saved in DB.
           */
          const hydratedHistory =
            useVisitStore
              .getState()
              .visit.history
              .allergyHistory;

          lastSavedPayloadRef.current =
            JSON.stringify(
              buildAllergyHistoryPayload(
                hydratedHistory,
              ),
            );

          setIsLoaded(true);
        } catch (error) {
          console.error(
            "FAILED TO LOAD ALLERGY HISTORY",
            error,
          );
        } finally {
          if (!cancelled) {
            setIsHydrating(false);
          }
        }
      };

    loadAllergyHistory();

    return () => {
      cancelled = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [patientId]);

  // ======================================================
  // Manual Save
  // ======================================================

  const saveAllergyHistoryNow =
    useCallback(
      async (): Promise<SaveResult> => {
        if (!patientId) {
          throw new Error(
            "Patient ID is required.",
          );
        }

        if (isHydrating) {
          throw new Error(
            "Allergy history is still loading.",
          );
        }

        if (saveInFlightRef.current) {
          return {
            success: false,
          };
        }

        const allergyHistory =
          useVisitStore
            .getState()
            .visit.history
            .allergyHistory;

        const payload =
          buildAllergyHistoryPayload(
            allergyHistory,
          );

        /**
         * Backend validation:
         *
         * hasAllergy = true requires at least
         * one allergy.
         */
        if (
          payload.hasAllergy &&
          payload.allergies.length === 0
        ) {
          return {
            success: false,
          };
        }

        /**
         * Tell the auto-save effect that this
         * exact Store mutation is being saved
         * manually.
         */
        skipNextAutoSaveRef.current =
          true;

        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        saveInFlightRef.current = true;
        setIsSaving(true);

        try {
          const saved =
            await saveAllergyHistory(
              patientId,
              payload,
            );

          /**
           * Backend returns the complete
           * Allergy History.
           *
           * Update the saved-state key using
           * the actual Store state.
           */
          lastSavedPayloadRef.current =
            JSON.stringify(payload);

          /**
           * Important:
           *
           * Backend generated IDs may differ
           * from temporary frontend IDs.
           *
           * We intentionally don't replace the
           * Store here because this operation is
           * followed by normal Store state flow.
           *
           * The next hydration will restore
           * canonical backend IDs.
           */
          void saved;

          return {
            success: true,
          };
        } catch (error) {
          /**
           * Allow a future Store change to be
           * saved after a failed request.
           */
          skipNextAutoSaveRef.current =
            false;

          console.error(
            "FAILED TO SAVE ALLERGY HISTORY",
            {
              error,
              payload,
            },
          );

          throw error;
        } finally {
          saveInFlightRef.current = false;
          setIsSaving(false);
        }
      },
      [patientId, isHydrating],
    );

  // ======================================================
  // Auto Save
  // ======================================================

  useEffect(() => {
    if (
      !patientId ||
      isHydrating ||
      !isLoaded
    ) {
      return;
    }

    /**
     * If a manual operation just changed
     * the Store and is going to save it,
     * don't create another request.
     */
    if (
      skipNextAutoSaveRef.current
    ) {
      skipNextAutoSaveRef.current =
        false;
      return;
    }

    if (saveInFlightRef.current) {
      return;
    }

    const allergyHistory =
      visit.history.allergyHistory;

    const payload =
      buildAllergyHistoryPayload(
        allergyHistory,
      );

    const payloadKey =
      JSON.stringify(payload);

    /**
     * Nothing changed compared with the
     * latest successful backend save.
     */
    if (
      payloadKey ===
      lastSavedPayloadRef.current
    ) {
      return;
    }

    /**
     * IMPORTANT:
     *
     * Backend rejects:
     *
     * hasAllergy=true + allergies=[]
     *
     * Therefore don't auto-save an incomplete
     * Yes state.
     */
    if (
      payload.hasAllergy &&
      payload.allergies.length === 0
    ) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(
      async () => {
        if (saveInFlightRef.current) {
          return;
        }

        saveInFlightRef.current = true;
        setIsAutoSaving(true);

        try {
          await saveAllergyHistory(
            patientId,
            payload,
          );

          lastSavedPayloadRef.current =
            payloadKey;
        } catch (error) {
          console.error(
            "FAILED ALLERGY HISTORY AUTO-SAVE",
            {
              error,
              payload,
            },
          );
        } finally {
          saveInFlightRef.current = false;
          setIsAutoSaving(false);
        }
      },
      500,
    );

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    patientId,
    visit.history.allergyHistory,
    isHydrating,
    isLoaded,
  ]);

  // ======================================================
  // Clear All Allergies
  // ======================================================

  const clearAllergies =
    useCallback(() => {
      const currentAllergies =
        useVisitStore
          .getState()
          .visit.history
          .allergyHistory
          .allergies;

      currentAllergies.forEach(
        (allergy) => {
          removeAllergy(allergy.id);
        },
      );

      updateHasAllergy(false);
    }, [
      removeAllergy,
      updateHasAllergy,
    ]);

  // ======================================================
  // Return
  // ======================================================

  return {
    isHydrating,
    isSaving,
    isAutoSaving,
    isLoaded,
    saveAllergyHistory:
      saveAllergyHistoryNow,
    clearAllergies,
    addAllergy,
    updateHasAllergy,
  };
}