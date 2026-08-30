import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getFamilyHistory,
  saveFamilyHistory as saveFamilyHistoryApi,
  type SaveFamilyHistoryInput,
} from "@/services/patientApi";

import { useVisitStore } from "@/store/visitStore";

import type {
  FamilyDisease,
  FamilyRelation,
} from "@/models/VisitForm/history";

// ======================================================
// Types
// ======================================================

type UseFamilyHistoryAutoSaveParams = {
  patientId: string;
};

type FamilyHistorySaveState = {
  isHydrating: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  deletingFamilyDiseaseId: string | null;
};

// ======================================================
// Backend → Store
// ======================================================

function mapFamilyHistoryFromBackend(
  data: Awaited<ReturnType<typeof getFamilyHistory>>,
): FamilyDisease[] {
  if (!data?.familyHistory) {
    return [];
  }

  return data.familyHistory.map(
    (item): FamilyDisease => ({
      id: item.id,

      relation:
        item.relation as FamilyRelation,

      otherRelation:
        item.otherRelation ?? null,

      diseases:
        item.diseases ?? [],

      alive:
        item.alive,

      ageAtDeath:
        item.ageAtDeath ?? null,

      causeOfDeath:
        item.causeOfDeath ?? null,

      notes:
        item.notes ?? null,
    }),
  );
}

// ======================================================
// Store → Backend
// ======================================================

export function buildFamilyHistoryPayload(
  familyDiseases: FamilyDisease[],
): SaveFamilyHistoryInput {
  return {
    familyHistory: familyDiseases.map(
      (member) => {
        const base = {
          relation: member.relation,

          otherRelation:
            member.relation === "OTHER"
              ? member.otherRelation?.trim() ||
                null
              : null,

          diseases: member.diseases
            .map((disease) =>
              disease.trim(),
            )
            .filter(Boolean),

          alive: member.alive,

          notes:
            member.notes?.trim() || null,
        };

        // ==================================================
        // Living family member
        //
        // IMPORTANT:
        // Do NOT send ageAtDeath or causeOfDeath
        // at all when alive === true.
        // ==================================================
        if (member.alive) {
          return base;
        }

        // ==================================================
        // Deceased family member
        // ==================================================
        return {
          ...base,
          ageAtDeath:
            member.ageAtDeath ?? null,

          causeOfDeath:
            member.causeOfDeath?.trim() ||
            null,
        };
      },
    ),
  };
}

// ======================================================
// Hook
// ======================================================

export default function useFamilyHistoryAutoSave({
  patientId,
}: UseFamilyHistoryAutoSaveParams): FamilyHistorySaveState & {
  saveFamilyHistory: () => Promise<void>;

  deleteFamilyDisease: (
    familyDiseaseId: string,
  ) => Promise<void>;
} {
  const {
    addFamilyDisease,
    removeFamilyDisease,
  } = useVisitStore();

  const [
    isHydrating,
    setIsHydrating,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    deletingFamilyDiseaseId,
    setDeletingFamilyDiseaseId,
  ] = useState<string | null>(null);

  const loadedPatientId =
    useRef<string | null>(null);

  const isMountedRef =
    useRef(true);

  // ======================================================
  // Cleanup
  // ======================================================

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ======================================================
  // Hydration
  //
  // Backend → Store
  // ======================================================

  useEffect(() => {
    if (
      !patientId ||
      loadedPatientId.current ===
        patientId
    ) {
      return;
    }

    let cancelled = false;

    const loadFamilyHistory =
      async () => {
        if (isMountedRef.current) {
          setIsHydrating(true);
        }

        try {
          const data =
            await getFamilyHistory(
              patientId,
            );

          if (cancelled) {
            return;
          }

          const familyDiseases =
            mapFamilyHistoryFromBackend(
              data,
            );

          const currentFamilyDiseases =
            useVisitStore
              .getState()
              .visit
              .history
              .familyHistory
              .familyDiseases;

          // ==================================================
          // Remove current Store records
          // ==================================================

          currentFamilyDiseases.forEach(
            (item) => {
              removeFamilyDisease(
                item.id,
              );
            },
          );

          // ==================================================
          // Add Backend records to Store
          // ==================================================

          familyDiseases.forEach(
            (item) => {
              addFamilyDisease(item);
            },
          );

          loadedPatientId.current =
            patientId;
        } catch (error) {
          console.error(
            "FAILED TO LOAD FAMILY HISTORY",
            error,
          );
        } finally {
          if (
            !cancelled &&
            isMountedRef.current
          ) {
            setIsHydrating(false);
          }
        }
      };

    loadFamilyHistory();

    return () => {
      cancelled = true;
    };
  }, [
    patientId,
    addFamilyDisease,
    removeFamilyDisease,
  ]);

  // ======================================================
  // Manual Save
  //
  // Store → Backend → DB
  // ======================================================

  const saveFamilyHistory =
    useCallback(async () => {
      if (
        !patientId ||
        isHydrating ||
        isSaving ||
        isDeleting
      ) {
        return;
      }

      setIsSaving(true);

      try {
        // ==================================================
        // Always read the latest Store state.
        // ==================================================

        const familyDiseases =
          useVisitStore
            .getState()
            .visit
            .history
            .familyHistory
            .familyDiseases;

        const payload =
          buildFamilyHistoryPayload(
            familyDiseases,
          );

        // IMPORTANT:
        // Call the API function, not the local
        // saveFamilyHistory callback.
        await saveFamilyHistoryApi(
          patientId,
          payload,
        );
      } catch (error: any) {
        console.error(
            "FAILED TO SAVE FAMILY HISTORY",
            {
            status: error?.response?.status,
            data: error?.response?.data,
            message: error?.message,
            },
        );

        throw error;
        } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    }, [
      patientId,
      isHydrating,
      isSaving,
      isDeleting,
    ]);

  // ======================================================
  // Delete + Manual Save
  //
  // Store → Backend → DB
  // ======================================================

  const deleteFamilyDisease =
    useCallback(
      async (
        familyDiseaseId: string,
      ) => {
        if (
          !patientId ||
          isHydrating ||
          isSaving ||
          isDeleting
        ) {
          return;
        }

        const currentFamilyDiseases =
          useVisitStore
            .getState()
            .visit
            .history
            .familyHistory
            .familyDiseases;

        const deletedFamilyDisease =
          currentFamilyDiseases.find(
            (item) =>
              item.id ===
              familyDiseaseId,
          );

        if (!deletedFamilyDisease) {
          return;
        }

        const previousFamilyDiseases =
          [...currentFamilyDiseases];

        setIsDeleting(true);

        setDeletingFamilyDiseaseId(
          familyDiseaseId,
        );

        try {
          // ==================================================
          // Remove from Store first
          // ==================================================

          removeFamilyDisease(
            familyDiseaseId,
          );

          // ==================================================
          // Read latest Store state
          // ==================================================

          const remainingFamilyDiseases =
            useVisitStore
              .getState()
              .visit
              .history
              .familyHistory
              .familyDiseases;

          const payload =
            buildFamilyHistoryPayload(
              remainingFamilyDiseases,
            );

          // ==================================================
          // Persist complete remaining list
          // ==================================================

          await saveFamilyHistoryApi(
            patientId,
            payload,
          );
        } catch (error: any) {
            console.error(
                "FAILED TO DELETE FAMILY HISTORY",
                {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
                },
            );

          // ==================================================
          // Restore previous Store state
          // ==================================================

          const currentAfterFailure =
            useVisitStore
              .getState()
              .visit
              .history
              .familyHistory
              .familyDiseases;

          currentAfterFailure.forEach(
            (item) => {
              removeFamilyDisease(
                item.id,
              );
            },
          );

          previousFamilyDiseases.forEach(
            (item) => {
              addFamilyDisease(item);
            },
          );

          console.error(
            "FAILED TO DELETE FAMILY HISTORY",
            error,
          );

          throw error;
        } finally {
          if (
            isMountedRef.current
          ) {
            setIsDeleting(false);

            setDeletingFamilyDiseaseId(
              null,
            );
          }
        }
      },
      [
        patientId,
        isHydrating,
        isSaving,
        isDeleting,
        addFamilyDisease,
        removeFamilyDisease,
      ],
    );

  // ======================================================
  // Return
  // ======================================================

  return {
    isHydrating,
    isSaving,
    isDeleting,
    deletingFamilyDiseaseId,
    saveFamilyHistory,
    deleteFamilyDisease,
  };
}