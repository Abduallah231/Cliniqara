import { useCallback, useEffect, useRef, useState } from "react";

import {
  getPastHistory,
  savePastHistory,
  type SavePastHistoryInput,
} from "@/services/visitApi";

import { useVisitStore } from "@/store/visitStore";

import chronicDiseases from "@/data/chronicDiseases";

import type {
  Hospitalization,
  Operation,
  BloodTransfusion,
  MajorTrauma,
  ICUAdmission,
} from "@/models/VisitForm/history";

/* ======================================================
   Types
====================================================== */

export type PastHistoryAutoSaveSection =
  | "chronicDiseases"
  | "hospitalizations"
  | "operations"
  | "bloodTransfusions"
  | "majorTraumas"
  | "icuAdmissions";

/* ======================================================
   Helpers
====================================================== */

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeNullableText(
  value: unknown,
): string | null {
  const text = normalizeText(value);
  return text || null;
}

function normalizeDate(
  value: unknown,
): string | null {
  const text = normalizeText(value);
  return text || null;
}

/* ======================================================
   Chronic Diseases
====================================================== */

function mapChronicDiseases(
  diseases: SavePastHistoryInput["chronicDiseases"],
): SavePastHistoryInput["chronicDiseases"] {
  return diseases
    .map((disease) => ({
      diseaseCode: normalizeText(
        disease.diseaseCode,
      ),
      diseaseName: normalizeText(
        disease.diseaseName,
      ),
      notes: normalizeNullableText(
        disease.notes,
      ),
    }))
    .filter(
      (disease) =>
        disease.diseaseCode ||
        disease.diseaseName,
    );
}

/* ======================================================
   Hospitalizations
====================================================== */

function mapHospitalizations(
  items: Hospitalization[],
): SavePastHistoryInput["hospitalizations"] {
  return items
    .map((item) => ({
      reason: normalizeText(item.reason),
      date: normalizeDate(item.date),
      duration: normalizeNullableText(
        item.duration,
      ),
    }))
    .filter((item) => item.reason);
}

/* ======================================================
   Operations
====================================================== */

function mapOperations(
  items: Operation[],
): SavePastHistoryInput["operations"] {
  return items
    .map((item) => ({
      operationName: normalizeText(
        item.name,
      ),
      date: normalizeDate(item.date),
      indication: normalizeNullableText(
        item.indication,
      ),
    }))
    .filter(
      (item) => item.operationName,
    );
}

/* ======================================================
   Blood Transfusions
====================================================== */

function mapBloodTransfusions(
  items: BloodTransfusion[],
): SavePastHistoryInput["bloodTransfusions"] {
  return items.map((item) => ({
    reason: normalizeNullableText(
      item.reason,
    ),
    date: normalizeDate(item.date),
    reaction: normalizeNullableText(
      item.reaction,
    ),
  }));
}

/* ======================================================
   Major Traumas
====================================================== */

function mapMajorTraumas(
  items: MajorTrauma[],
): SavePastHistoryInput["majorTraumas"] {
  return items
    .map((item) => ({
      traumaType: normalizeText(
        item.type,
      ),
      date: normalizeDate(item.date),
      complications:
        normalizeNullableText(
          item.complications,
        ),
    }))
    .filter(
      (item) => item.traumaType,
    );
}

/* ======================================================
   ICU Admissions
====================================================== */

function mapICUAdmissions(
  items: ICUAdmission[],
): SavePastHistoryInput["icuAdmissions"] {
  return items
    .map((item) => ({
      reason: normalizeText(
        item.reason,
      ),
      date: normalizeDate(item.date),
      duration: normalizeNullableText(
        item.duration,
      ),
      ventilatorSupport:
        item.ventilatorSupport ?? false,
    }))
    .filter((item) => item.reason);
}

/* ======================================================
   API Mapper
====================================================== */

export function mapPastHistoryFieldsToApi({
  chronicDiseases,
  hospitalizations,
  operations,
  bloodTransfusions,
  majorTraumas,
  icuAdmissions,
}: {
  chronicDiseases: SavePastHistoryInput["chronicDiseases"];
  hospitalizations: Hospitalization[];
  operations: Operation[];
  bloodTransfusions: BloodTransfusion[];
  majorTraumas: MajorTrauma[];
  icuAdmissions: ICUAdmission[];
}): SavePastHistoryInput {
  return {
    chronicDiseases:
      mapChronicDiseases(
        chronicDiseases,
      ),

    hospitalizations:
      mapHospitalizations(
        hospitalizations,
      ),

    operations:
      mapOperations(operations),

    bloodTransfusions:
      mapBloodTransfusions(
        bloodTransfusions,
      ),

    majorTraumas:
      mapMajorTraumas(
        majorTraumas,
      ),

    icuAdmissions:
      mapICUAdmissions(
        icuAdmissions,
      ),
  };
}

/* ======================================================
   Backend Mapper
====================================================== */

export function mapPastHistoryFromBackend(
  data: Record<string, any>,
) {
  return {
    chronicDiseases:
      Array.isArray(
        data?.chronicDiseases,
      )
        ? data.chronicDiseases
        : [],

    hospitalizations:
      Array.isArray(
        data?.hospitalizations,
      )
        ? data.hospitalizations.map(
            (item: any) => ({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              reason:
                item.reason ?? "",

              date:
                item.date ?? "",

              duration:
                item.duration ?? "",
            }),
          )
        : [],

    operations:
      Array.isArray(
        data?.operations,
      )
        ? data.operations.map(
            (item: any) => ({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              name:
                item.operationName ??
                "",

              date:
                item.date ?? "",

              indication:
                item.indication ??
                "",
            }),
          )
        : [],

    bloodTransfusions:
      Array.isArray(
        data?.bloodTransfusions,
      )
        ? data.bloodTransfusions.map(
            (item: any) => ({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              reason:
                item.reason ?? "",

              date:
                item.date ?? "",

              reaction:
                item.reaction ?? "",
            }),
          )
        : [],

    majorTraumas:
      Array.isArray(
        data?.majorTraumas,
      )
        ? data.majorTraumas.map(
            (item: any) => ({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              type:
                item.traumaType ??
                "",

              date:
                item.date ?? "",

              complications:
                item.complications ??
                "",
            }),
          )
        : [],

    icuAdmissions:
      Array.isArray(
        data?.icuAdmissions,
      )
        ? data.icuAdmissions.map(
            (item: any) => ({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              reason:
                item.reason ?? "",

              date:
                item.date ?? "",

              duration:
                item.duration ?? "",

              ventilatorSupport:
                item.ventilatorSupport ??
                false,
            }),
          )
        : [],
  };
}

/* ======================================================
   Hook
====================================================== */

export default function usePastHistoryAutoSave({
  patientId,
}: {
  patientId?: string;
}) {
  /* ====================================================
     Zustand
  ==================================================== */

  const pastHistory =
    useVisitStore(
      (state) =>
        state.visit.history.pastHistory,
    );

  const {
    updatePastHistoryField,

    addHospitalization,
    removeHospitalization,

    addOperation,
    removeOperation,

    addBloodTransfusion,
    removeBloodTransfusion,

    addMajorTrauma,
    removeMajorTrauma,

    addICUAdmission,
    removeICUAdmission,
  } = useVisitStore();

  /* ====================================================
     UI State
  ==================================================== */

  const [
    isHydrating,
    setIsHydrating,
  ] = useState(Boolean(patientId));

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    autoSavingSection,
    setAutoSavingSection,
  ] =
    useState<PastHistoryAutoSaveSection | null>(
      null,
    );

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(null);

  /* ====================================================
     Refs
  ==================================================== */

  const patientIdRef =
    useRef<string | undefined>(
      patientId,
    );

  const patientGenerationRef =
    useRef(0);

  const loadedPatientIdRef =
    useRef<string | null>(null);

  const hydrationCancelledRef =
    useRef(false);

  const saveTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const savePromiseRef =
    useRef<Promise<boolean> | null>(
      null,
    );

  const lastSavedSignatureRef =
    useRef<string | null>(null);

  const isHydratingRef =
    useRef(isHydrating);

  /* ====================================================
     Keep Refs Updated
  ==================================================== */

  useEffect(() => {
    patientIdRef.current =
      patientId;

    isHydratingRef.current =
      isHydrating;
  }, [
    patientId,
    isHydrating,
  ]);

  /* ====================================================
     Current Store Snapshot
     
     IMPORTANT:
     Always read Zustand directly.
     This prevents stale React render snapshots.
  ==================================================== */

  const getCurrentPastHistory =
    useCallback(() => {
      return useVisitStore.getState()
        .visit.history.pastHistory;
    }, []);

  /* ====================================================
     Build Current API Payload
  ==================================================== */

  const buildCurrentPayload =
    useCallback(() => {
      const current =
        getCurrentPastHistory();

      const chronicField =
        current.fields.find(
          (field) =>
            field.fieldId ===
            "chronicDiseases",
        );

      const selectedCodes =
        Array.isArray(
          chronicField?.value,
        )
          ? (chronicField.value as string[])
          : [];

      const chronicDiseaseItems =
        selectedCodes.map(
          (code) => {
            const disease =
              chronicDiseases.find(
                (item) =>
                  item.code === code,
              );

            return {
              diseaseCode: code,
              diseaseName:
                disease?.name ?? code,
              notes: null,
            };
          },
        );

      return mapPastHistoryFieldsToApi(
        {
          chronicDiseases:
            chronicDiseaseItems,

          hospitalizations:
            current.hospitalizations,

          operations:
            current.operations,

          bloodTransfusions:
            current.bloodTransfusions,

          majorTraumas:
            current.majorTraumas,

          icuAdmissions:
            current.icuAdmissions,
        },
      );
    }, [
      getCurrentPastHistory,
    ]);

  /* ====================================================
     Full Payload Signature
  ==================================================== */

  const getCurrentSignature =
    useCallback(() => {
      return JSON.stringify(
        buildCurrentPayload(),
      );
    }, [
      buildCurrentPayload,
    ]);

  /* ====================================================
     Persist Latest Snapshot
     
     There is NEVER more than one request
     running at the same time.
     
     If another save is requested while one is
     running, we wait for the current request and
     then read Zustand again.
  ==================================================== */

  const persistLatest =
    useCallback(
      async (
        section?: PastHistoryAutoSaveSection,
      ): Promise<boolean> => {
        const currentPatientId =
          patientIdRef.current;

        const currentGeneration =
          patientGenerationRef.current;

        if (!currentPatientId) {
          return false;
        }

        if (
          isHydratingRef.current
        ) {
          return false;
        }

        /*
         * Wait for an existing request.
         */
        if (savePromiseRef.current) {
          await savePromiseRef.current;
        }

        /*
         * After waiting, always read the latest
         * patient id again.
         */
        if (
          patientIdRef.current !==
            currentPatientId ||
          patientGenerationRef.current !==
            currentGeneration ||
          isHydratingRef.current
        ) {
          return false;
        }

        /*
         * Keep checking until the latest Zustand
         * snapshot is synchronized.
         *
         * This handles a user edit occurring while
         * the previous request was in flight.
         */
        while (true) {
          if (
            patientIdRef.current !==
              currentPatientId ||
            patientGenerationRef.current !==
              currentGeneration ||
            isHydratingRef.current
          ) {
            return false;
          }

          const payload =
            buildCurrentPayload();

          const signature =
            JSON.stringify(payload);

          /*
           * Nothing changed since last successful save.
           */
          if (
            signature ===
            lastSavedSignatureRef.current
          ) {
            return true;
          }

          setSaveError(null);
          setIsSaving(true);

          if (section) {
            setAutoSavingSection(
              section,
            );
          }

          const requestPromise =
            savePastHistory(
              currentPatientId,
              payload,
            )
              .then(() => {
                if (
                  patientIdRef.current ===
                    currentPatientId &&
                  patientGenerationRef.current ===
                    currentGeneration
                ) {
                  lastSavedSignatureRef.current =
                    signature;
                }

                return true;
              })
              .catch((error: any) => {
                console.error(
                  "PAST HISTORY SAVE FAILED:",
                  error?.response
                    ?.data ?? error,
                );

                if (
                  patientIdRef.current ===
                    currentPatientId &&
                  patientGenerationRef.current ===
                    currentGeneration
                ) {
                  setSaveError(
                    error?.response
                      ?.data?.message ??
                      error?.message ??
                      "Failed to save past history.",
                  );
                }

                return false;
              });

          savePromiseRef.current =
            requestPromise;

          let success =
            false;

          try {
            success =
              await requestPromise;
          } finally {
            if (
              savePromiseRef.current ===
              requestPromise
            ) {
              savePromiseRef.current =
                null;
            }

            setIsSaving(false);

            setAutoSavingSection(
              (current) =>
                current === section
                  ? null
                  : current,
            );
          }

          if (!success) {
            return false;
          }

          /*
           * Check Zustand again.
           *
           * If the user changed anything while the
           * request was running, another request will
           * immediately synchronize the latest state.
           */
          const latestSignature =
            getCurrentSignature();

          if (
            latestSignature ===
            lastSavedSignatureRef.current
          ) {
            return true;
          }

          /*
           * Patient changed while request was running.
           */
          if (
            patientIdRef.current !==
              currentPatientId ||
            patientGenerationRef.current !==
              currentGeneration
          ) {
            return false;
          }

          /*
           * Continue the while loop and save the
           * latest snapshot.
           */
        }
      },
      [
        buildCurrentPayload,
        getCurrentSignature,
      ],
    );

  /* ====================================================
     Manual Save
     
     Used by:
     - Hospitalizations
     - Operations
     - Blood Transfusions
     - Major Trauma
     - ICU Admissions
  ==================================================== */

  const saveNow =
    useCallback(async () => {
      if (
        saveTimerRef.current
      ) {
        clearTimeout(
          saveTimerRef.current,
        );

        saveTimerRef.current =
          null;
      }

      return persistLatest();
    }, [
      persistLatest,
    ]);

  /* ====================================================
     Hydration
     
     Hook owns loading from backend.
  ==================================================== */

  useEffect(() => {
    patientGenerationRef.current += 1;

    const generation =
      patientGenerationRef.current;

    hydrationCancelledRef.current =
      false;

    if (
      saveTimerRef.current
    ) {
      clearTimeout(
        saveTimerRef.current,
      );

      saveTimerRef.current =
        null;
    }

    lastSavedSignatureRef.current =
      null;

    if (!patientId) {
      loadedPatientIdRef.current =
        null;

      isHydratingRef.current =
        false;

      setIsHydrating(false);

      return;
    }

    if (
      loadedPatientIdRef.current ===
      patientId
    ) {
      return;
    }

    isHydratingRef.current =
      true;

    setIsHydrating(true);

    const load = async () => {
      try {
        /*
         * Prevent autosave while we replace the
         * local state with backend data.
         */

        /*
         * Clear current records first.
         * This prevents old patient's records from
         * remaining visible while loading another patient.
         */
        const current =
          useVisitStore
            .getState()
            .visit.history
            .pastHistory;

        updatePastHistoryField(
          "chronicDiseases",
          "Chronic Diseases",
          [],
        );

        current.hospitalizations.forEach(
          (item) =>
            removeHospitalization(
              item.id,
            ),
        );

        current.operations.forEach(
          (item) =>
            removeOperation(
              item.id,
            ),
        );

        current.bloodTransfusions.forEach(
          (item) =>
            removeBloodTransfusion(
              item.id,
            ),
        );

        current.majorTraumas.forEach(
          (item) =>
            removeMajorTrauma(
              item.id,
            ),
        );

        current.icuAdmissions.forEach(
          (item) =>
            removeICUAdmission(
              item.id,
            ),
        );

        const data =
          await getPastHistory(
            patientId,
          );

        if (
          hydrationCancelledRef.current ||
          patientIdRef.current !==
            patientId ||
          patientGenerationRef.current !==
            generation
        ) {
          return;
        }

        const mapped =
          mapPastHistoryFromBackend(
            data ?? {},
          );

        /* ---------------------------------------------
           Chronic Diseases
        --------------------------------------------- */

        updatePastHistoryField(
          "chronicDiseases",
          "Chronic Diseases",
          mapped.chronicDiseases.map(
            (item: any) =>
              item.diseaseCode,
          ),
        );

        /* ---------------------------------------------
           Hospitalizations
        --------------------------------------------- */

        mapped.hospitalizations.forEach(
          (item: any) =>
            addHospitalization({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              reason:
                item.reason ?? "",

              date:
                item.date ?? "",

              duration:
                item.duration ?? "",
            }),
        );

        /* ---------------------------------------------
           Operations
        --------------------------------------------- */

        mapped.operations.forEach(
          (item: any) =>
            addOperation({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              name:
                item.name ?? "",

              date:
                item.date ?? "",

              indication:
                item.indication ?? "",
            }),
        );

        /* ---------------------------------------------
           Blood Transfusions
        --------------------------------------------- */

        mapped.bloodTransfusions.forEach(
          (item: any) =>
            addBloodTransfusion({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              reason:
                item.reason ?? "",

              date:
                item.date ?? "",

              reaction:
                item.reaction ?? "",
            }),
        );

        /* ---------------------------------------------
           Major Trauma
        --------------------------------------------- */

        mapped.majorTraumas.forEach(
          (item: any) =>
            addMajorTrauma({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              type:
                item.type ?? "",

              date:
                item.date ?? "",

              complications:
                item.complications ??
                "",
            }),
        );

        /* ---------------------------------------------
           ICU Admissions
        --------------------------------------------- */

        mapped.icuAdmissions.forEach(
          (item: any) =>
            addICUAdmission({
              id:
                item.id ??
                `${Date.now()}-${Math.random()}`,

              reason:
                item.reason ?? "",

              date:
                item.date ?? "",

              duration:
                item.duration ?? "",

              ventilatorSupport:
                item.ventilatorSupport ??
                false,
            }),
        );

        /*
         * The backend snapshot is now our baseline.
         *
         * IMPORTANT:
         * Do this before allowing autosave.
         */
        const hydratedPayload =
          mapPastHistoryFieldsToApi({
            chronicDiseases:
              mapped.chronicDiseases.map(
                (item: any) => ({
                  diseaseCode:
                    item.diseaseCode ??
                    "",
                  diseaseName:
                    item.diseaseName ??
                    item.diseaseCode ??
                    "",
                  notes:
                    item.notes ?? null,
                }),
              ),

            hospitalizations:
              mapped.hospitalizations,

            operations:
              mapped.operations,

            bloodTransfusions:
              mapped.bloodTransfusions,

            majorTraumas:
              mapped.majorTraumas,

            icuAdmissions:
              mapped.icuAdmissions,
          });

        lastSavedSignatureRef.current =
          JSON.stringify(
            hydratedPayload,
          );

        loadedPatientIdRef.current =
          patientId;
      } catch (error: any) {
        console.error(
          "Failed to load past history:",
          error?.response
            ?.data ?? error,
        );

        if (
          patientIdRef.current ===
          patientId &&
          patientGenerationRef.current ===
            generation
        ) {
          setSaveError(
            error?.response
              ?.data?.message ??
              error?.message ??
              "Failed to load past history.",
          );
        }
      } finally {
        if (
          patientIdRef.current ===
            patientId &&
          patientGenerationRef.current ===
            generation
        ) {
          hydrationCancelledRef.current =
            false;

          isHydratingRef.current =
            false;

          setIsHydrating(false);
        }
      }
    };

    void load();

    return () => {
      hydrationCancelledRef.current =
        true;

      if (
        saveTimerRef.current
      ) {
        clearTimeout(
          saveTimerRef.current,
        );

        saveTimerRef.current =
          null;
      }
    };
  }, [
    patientId,

    updatePastHistoryField,

    addHospitalization,
    removeHospitalization,

    addOperation,
    removeOperation,

    addBloodTransfusion,
    removeBloodTransfusion,

    addMajorTrauma,
    removeMajorTrauma,

    addICUAdmission,
    removeICUAdmission,
  ]);

  /* ====================================================
     Chronic Diseases Autosave
     
     ONLY this section is automatic.
  ==================================================== */

  const chronicDiseasesValue =
    pastHistory.fields.find(
      (field) =>
        field.fieldId ===
        "chronicDiseases",
    )?.value;

  const chronicDiseasesSignature =
    JSON.stringify(
      Array.isArray(
        chronicDiseasesValue,
      )
        ? chronicDiseasesValue
        : [],
    );

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (
      isHydrating ||
      isHydratingRef.current
    ) {
      return;
    }

    if (
      lastSavedSignatureRef.current ===
      null
    ) {
      return;
    }

    /*
     * Clear previous debounce.
     */
    if (
      saveTimerRef.current
    ) {
      clearTimeout(
        saveTimerRef.current,
      );
    }

    /*
     * Wait 500ms after the last change.
     */
    saveTimerRef.current =
      setTimeout(() => {
        void persistLatest(
          "chronicDiseases",
        );
      }, 500);

    return () => {
      if (
        saveTimerRef.current
      ) {
        clearTimeout(
          saveTimerRef.current,
        );

        saveTimerRef.current =
          null;
      }
    };
  }, [
    patientId,
    isHydrating,
    chronicDiseasesSignature,
    persistLatest,
  ]);

  /* ====================================================
     Return
  ==================================================== */

  return {
    isHydrating,

    isSaving,

    isAutoSaving:
      autoSavingSection !== null,

    autoSavingSection,

    saveError,

    saveNow,
  };
}