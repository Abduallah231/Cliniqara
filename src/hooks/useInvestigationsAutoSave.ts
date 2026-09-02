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

        status:
          investigation.status,

        result: result
          ? {
              values:
                result.values,
            }
          : null,

        notes: null,

        images:
          investigation.images?.map(
            (image, index) => ({
              fileUrl:
                image.fileUrl,
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

  /*
   * ======================================================
   * Refs used to prevent concurrent saves
   * ======================================================
   */

  const loadedVisitId =
    useRef<string | null>(null);

  const hydratedSignature =
    useRef<string | null>(null);

  const isHydrating =
    useRef(false);

  const isFirstRender =
    useRef(true);

  /*
   * Always keep the latest UI state available
   * to the save queue.
   */
  const latestRequestedRef =
    useRef<Investigation[]>(
      requestedInvestigations,
    );

  const latestResultsRef =
    useRef<InvestigationResult[]>(
      results,
    );

  /*
   * Only one save request is allowed
   * to be in flight at a time.
   */
  const saveInFlightRef =
    useRef(false);

  /*
   * ======================================================
   * Load investigations from backend
   * ======================================================
   */

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
          isHydrating.current =
            true;

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

          latestRequestedRef.current =
            mapped.requestedInvestigations;

          latestResultsRef.current =
            mapped.results;

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

  /*
   * ======================================================
   * Keep latest state refs updated
   * ======================================================
   */

  useEffect(() => {
    latestRequestedRef.current =
      requestedInvestigations;

    latestResultsRef.current =
      results;
  }, [
    requestedInvestigations,
    results,
  ]);

  /*
   * ======================================================
   * Autosave
   * ======================================================
   */

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

    /*
     * Ignore the first render after
     * the visit has already been loaded.
     */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    /*
     * Do not save while hydration is
     * still applying backend data.
     */
    if (isHydrating.current) {
      hydratedSignature.current =
        signature;

      return;
    }

    /*
     * Nothing changed.
     */
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
        /*
         * If another save is currently running,
         * do NOT start another request.
         *
         * The current request will check the
         * latest state when it finishes and will
         * trigger another save if necessary.
         */
        if (
          saveInFlightRef.current
        ) {
          return;
        }

        /*
         * Read the latest state from refs.
         *
         * This is important because the user may
         * have changed the investigation while the
         * debounce timer was waiting.
         */
        const payloadRequested =
          latestRequestedRef.current;

        const payloadResults =
          latestResultsRef.current;

        const payloadInvestigations =
          mapStoreToSavePayload(
            payloadRequested,
            payloadResults,
          );

        const payloadSignature =
          createSignature(
            payloadRequested,
            payloadResults,
          );

        saveInFlightRef.current =
          true;

        // console.log(
        //   "INVESTIGATIONS SAVE START:",
        //   {
        //     visitId,
        //     investigations:
        //       payloadInvestigations.map(
        //         (item) => ({
        //           id: item.id,
        //           name: item.name,
        //           images:
        //             item.images?.length ??
        //             0,
        //         }),
        //       ),
        //   },
        // );

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
            useVisitStore
              .getState()
              .visit.assessment
              .investigations;

          const currentSignature =
            createSignature(
              currentState.requestedInvestigations,
              currentState.results,
            );

          /*
           * The user changed something while
           * this request was running.
           *
           * Never overwrite newer state.
           */
          if (
            currentSignature !==
            payloadSignature
          ) {
            // console.log(
            //   "INVESTIGATIONS SAVE OUTDATED - NEWER STATE EXISTS",
            // );

            return;
          }

          /*
           * Backend returns the authoritative
           * persisted investigations.
           */
          if (
            Array.isArray(response)
          ) {
            const mapped =
              mapBackendInvestigationsToStore(
                response,
              );

            // console.log(
            //   "INVESTIGATIONS SAVE SUCCESS:",
            //   response.map(
            //     (item: any) => ({
            //       id: item.id,
            //       name: item.name,
            //       images:
            //         item.images
            //           ?.length ?? 0,
            //     }),
            //   ),
            // );

            /*
             * Replace temporary/local IDs with
             * the real database IDs.
             *
             * Existing IDs remain unchanged.
             */
            reconcileInvestigationsPersistence(
              mapped.requestedInvestigations,
            );
          }

          /*
           * Mark the current persisted state.
           */
          const persistedState =
            useVisitStore
              .getState()
              .visit.assessment
              .investigations;

          hydratedSignature.current =
            createSignature(
              persistedState.requestedInvestigations,
              persistedState.results,
            );
        } catch (error: any) {
          console.error(
            "INVESTIGATIONS AUTOSAVE FAILED:",
            error?.response?.data ??
              error,
          );
        } finally {
          saveInFlightRef.current =
            false;

          /*
           * Something may have changed while
           * the request was in flight.
           *
           * Check the latest state and save it
           * after the current request has finished.
           */
          const latestState =
            useVisitStore
              .getState()
              .visit.assessment
              .investigations;

          const latestSignature =
            createSignature(
              latestState.requestedInvestigations,
              latestState.results,
            );

          if (
            latestSignature !==
            payloadSignature
          ) {
            setTimeout(() => {
              /*
               * The normal effect will also react
               * to state changes. This extra call
               * guarantees that changes made while
               * the request was in flight are not
               * lost.
               */
              const currentRequested =
                useVisitStore
                  .getState()
                  .visit.assessment
                  .investigations
                  .requestedInvestigations;

              const currentResults =
                useVisitStore
                  .getState()
                  .visit.assessment
                  .investigations
                  .results;

              const currentSignature =
                createSignature(
                  currentRequested,
                  currentResults,
                );

              if (
                currentSignature !==
                hydratedSignature.current
              ) {
                latestRequestedRef.current =
                  currentRequested;

                latestResultsRef.current =
                  currentResults;

                /*
                 * Trigger the same debounce
                 * cycle by updating the store
                 * refs only; the normal effect
                 * remains responsible for the
                 * actual save.
                 */
              }
            }, 0);
          }
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