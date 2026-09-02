import { useEffect, useRef } from "react";

import {
  getInvestigations,
  saveInvestigations,
} from "@/services/visitApi";

import type {
  InvestigationInput,
} from "@/services/visitApi";

import type {
  Investigation,
  InvestigationResult,
} from "@/models/VisitForm/assessment";

import { useVisitStore } from "@/store/visitStore";

interface Props {
  visitId?: string;
  requestedInvestigations: Investigation[];
  results: InvestigationResult[];
}

function getInvestigationIdentifier(
  investigation: Investigation,
): string {
  return (
    investigation.id ??
    investigation.name
  );
}

function mapBackendInvestigationsToStore(
  investigations: any[],
): {
  requestedInvestigations: Investigation[];
  results: InvestigationResult[];
} {
  const requestedInvestigations: Investigation[] =
    investigations.map(
      (investigation) => ({
        id: investigation.id,

        code:
          investigation.code ??
          undefined,

        name: investigation.name,

        status: investigation.status,

        images:
          investigation.images?.map(
            (image: any) => ({
              fileUrl: image.fileUrl,
              sortOrder:
                image.sortOrder ?? 0,
            }),
          ) ?? [],
      }),
    );

  const results: InvestigationResult[] =
    investigations
      .filter(
        (investigation) =>
          investigation.result !==
            null &&
          investigation.result !==
            undefined,
      )
      .map((investigation) => ({
        investigationId:
          investigation.id ??
          investigation.name,

        values:
          investigation.result?.values ??
          [],
      }));

  return {
    requestedInvestigations,
    results,
  };
}

function mapStoreToSavePayload(
  requestedInvestigations: Investigation[],
  results: InvestigationResult[],
): InvestigationInput[] {
  return requestedInvestigations.map(
    (investigation) => {
      const identifier =
        getInvestigationIdentifier(
          investigation,
        );

      const result = results.find(
        (item) =>
          item.investigationId ===
            identifier ||
          item.investigationId ===
            investigation.id ||
          (!investigation.id &&
            item.investigationId ===
              investigation.name),
      );

      return {
        id: investigation.id,

        code:
          investigation.code ??
          null,

        name: investigation.name,

        status: investigation.status,

        result: result
          ? {
              values: result.values,
            }
          : null,

        notes: null,

        images:
          investigation.images?.map(
            (image, index) => ({
              fileUrl: image.fileUrl,
              sortOrder:
                image.sortOrder ??
                index,
            }),
          ) ?? [],
      };
    },
  );
}

function createSignature(
  requestedInvestigations: Investigation[],
  results: InvestigationResult[],
): string {
  return JSON.stringify({
    requestedInvestigations,
    results,
  });
}

export default function useInvestigationsAutoSave({
  visitId,
  requestedInvestigations,
  results,
}: Props) {
  const setInvestigationsAssessment =
    useVisitStore(
      (state) =>
        state.setInvestigationsAssessment,
    );

  const reconcileInvestigationsPersistence =
    useVisitStore(
      (state) =>
        state.reconcileInvestigationsPersistence,
    );

  const loadedVisitId = useRef<
    string | null
  >(null);

  const hydratedSignature =
    useRef<string | null>(null);

  const isHydrating =
    useRef(false);

  const isFirstRender =
    useRef(true);

  // ======================================================
  // Load investigations from backend
  // ======================================================

  useEffect(() => {
    if (
      !visitId ||
      loadedVisitId.current ===
        visitId
    ) {
      return;
    }

    let cancelled = false;

    const loadInvestigations =
      async () => {
        try {
          isHydrating.current = true;

          const data =
            await getInvestigations(
              visitId,
            );

          if (cancelled) {
            return;
          }

          const mapped =
            mapBackendInvestigationsToStore(
              data,
            );

          setInvestigationsAssessment(
            mapped.requestedInvestigations,
            mapped.results,
          );

          hydratedSignature.current =
            createSignature(
              mapped.requestedInvestigations,
              mapped.results,
            );

          loadedVisitId.current =
            visitId;
        } catch (error: any) {
          console.error(
            "FAILED TO LOAD INVESTIGATIONS:",
            error?.response?.data ??
              error,
          );
        } finally {
          if (!cancelled) {
            isHydrating.current =
              false;
          }
        }
      };

    loadInvestigations();

    return () => {
      cancelled = true;
    };
  }, [
    visitId,
    setInvestigationsAssessment,
  ]);

  // ======================================================
  // Autosave
  // ======================================================

  useEffect(() => {
    if (!visitId) {
      return;
    }

    if (
      loadedVisitId.current !==
      visitId
    ) {
      return;
    }

    const signature =
      createSignature(
        requestedInvestigations,
        results,
      );

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHydrating.current) {
      hydratedSignature.current =
        signature;

      return;
    }

    if (
      hydratedSignature.current ===
      signature
    ) {
      hydratedSignature.current =
        null;

      return;
    }

    const timer = setTimeout(
      async () => {
        const payloadInvestigations =
          mapStoreToSavePayload(
            requestedInvestigations,
            results,
          );

        const payloadSignature =
          createSignature(
            requestedInvestigations,
            results,
          );

        try {
          const response =
            await saveInvestigations(
              visitId,
              {
                investigations:
                  payloadInvestigations,
              },
            );

          const currentState =
            useVisitStore.getState()
              .visit.assessment
              .investigations;

          const currentSignature =
            createSignature(
              currentState.requestedInvestigations,
              currentState.results,
            );

          /**
           * User changed something while
           * request was in flight.
           *
           * Never overwrite newer UI state.
           */
          if (
            currentSignature !==
            payloadSignature
          ) {
            return;
          }

          /**
           * Backend recreates the investigation
           * rows and therefore generates new IDs.
           *
           * We need the new IDs for future image
           * uploads and future result updates.
           */
          if (response) {
            const backendInvestigations = response;

            const mapped =
              mapBackendInvestigationsToStore(
                backendInvestigations,
              );

            reconcileInvestigationsPersistence(
              mapped.requestedInvestigations,
            );
          }

          hydratedSignature.current =
            createSignature(
              useVisitStore
                .getState()
                .visit.assessment
                .investigations
                .requestedInvestigations,
              useVisitStore
                .getState()
                .visit.assessment
                .investigations
                .results,
            );
        } catch (error: any) {
          console.error(
            "INVESTIGATIONS AUTOSAVE FAILED:",
            error?.response?.data ??
              error,
          );
        }
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    requestedInvestigations,
    results,
    reconcileInvestigationsPersistence,
  ]);
}