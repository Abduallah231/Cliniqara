import { useEffect, useRef } from "react";

import {
  getProcedures,
  getReferrals,
  saveProcedures,
  saveReferrals,
} from "@/services/visitApi";

import { useVisitStore } from "@/store/visitStore";

import type {
  Procedure,
  Referral,
} from "@/models/VisitForm/assessment";

interface UseProceduresReferralsAutoSaveParams {
  visitId?: string;
  isHydrating: boolean;
}

const DEBOUNCE_MS = 500;

export function useProceduresReferralsAutoSave({
  visitId,
  isHydrating,
}: UseProceduresReferralsAutoSaveParams) {
  const procedures = useVisitStore(
    state =>
      state.visit.assessment
        .proceduresReferrals.procedures
  );

  const referrals = useVisitStore(
    state =>
      state.visit.assessment
        .proceduresReferrals.referrals
  );

  const hydratedVisitId =
    useRef<string | undefined>(undefined);

  const proceduresTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const referralsTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const proceduresHydratedSignature =
    useRef<string | null>(null);

  const referralsHydratedSignature =
    useRef<string | null>(null);

  /*
   * ==========================================
   * LOAD / HYDRATE
   * ==========================================
   */

  useEffect(() => {
    if (!visitId) {
      hydratedVisitId.current = undefined;
      return;
    }

    if (
      hydratedVisitId.current === visitId
    ) {
      return;
    }

    let mounted = true;

    const load = async () => {
      try {
        const [
          backendProcedures,
          backendReferrals,
        ] = await Promise.all([
          getProcedures(visitId),
          getReferrals(visitId),
        ]);

        if (!mounted) {
          return;
        }

        const mappedProcedures: Procedure[] =
          backendProcedures.map(item => ({
            details: item.details,
          }));

        const mappedReferrals: Referral[] =
          backendReferrals.map(item => ({
            details: item.details,
          }));

        /*
         * Hydration is done through the
         * dedicated setters so we don't
         * simulate user actions while loading.
         */
        useVisitStore
          .getState()
          .setProcedures(mappedProcedures);

        useVisitStore
          .getState()
          .setReferrals(mappedReferrals);

        /*
         * Remember the exact hydrated state.
         * This prevents the first Zustand
         * change after hydration from being
         * interpreted as a user edit.
         */
        proceduresHydratedSignature.current =
          JSON.stringify(mappedProcedures);

        referralsHydratedSignature.current =
          JSON.stringify(mappedReferrals);

        hydratedVisitId.current = visitId;
      } catch (error) {
        /*
         * Do not mark the visit as hydrated
         * when loading failed.
         *
         * The caller remains responsible for
         * displaying/logging the error if needed.
         */
        console.error(
          "Failed to load procedures/referrals:",
          error
        );
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [visitId]);

  /*
   * ==========================================
   * PROCEDURES AUTOSAVE
   * ==========================================
   */

  useEffect(() => {
    if (!visitId || isHydrating) {
      return;
    }

    /*
     * Don't autosave before the initial
     * backend state has been loaded.
     */
    if (
      hydratedVisitId.current !== visitId
    ) {
      return;
    }

    const signature =
      JSON.stringify(procedures);

    /*
     * Ignore the Zustand update caused by
     * hydration itself.
     */
    if (
      signature ===
      proceduresHydratedSignature.current
    ) {
      return;
    }

    if (proceduresTimer.current) {
      clearTimeout(proceduresTimer.current);
    }

    proceduresTimer.current = setTimeout(
      async () => {
        try {
          await saveProcedures(visitId, {
            procedures: procedures.map(
              procedure => ({
                details: procedure.details,
              })
            ),
          });

          /*
           * The state currently represented by
           * the successful request becomes the
           * new hydrated/saved baseline.
           */
          proceduresHydratedSignature.current =
            JSON.stringify(procedures);
        } catch (error) {
          console.error(
            "Failed to save procedures:",
            error
          );
        }
      },
      DEBOUNCE_MS
    );

    return () => {
      if (proceduresTimer.current) {
        clearTimeout(
          proceduresTimer.current
        );
        proceduresTimer.current = null;
      }
    };
  }, [
    visitId,
    isHydrating,
    procedures,
  ]);

  /*
   * ==========================================
   * REFERRALS AUTOSAVE
   * ==========================================
   */

  useEffect(() => {
    if (!visitId || isHydrating) {
      return;
    }

    /*
     * Don't autosave before the initial
     * backend state has been loaded.
     */
    if (
      hydratedVisitId.current !== visitId
    ) {
      return;
    }

    const signature =
      JSON.stringify(referrals);

    /*
     * Ignore the Zustand update caused by
     * hydration itself.
     */
    if (
      signature ===
      referralsHydratedSignature.current
    ) {
      return;
    }

    if (referralsTimer.current) {
      clearTimeout(referralsTimer.current);
    }

    referralsTimer.current = setTimeout(
      async () => {
        try {
          await saveReferrals(visitId, {
            referrals: referrals.map(
              referral => ({
                details: referral.details,
              })
            ),
          });

          referralsHydratedSignature.current =
            JSON.stringify(referrals);
        } catch (error) {
          console.error(
            "Failed to save referrals:",
            error
          );
        }
      },
      DEBOUNCE_MS
    );

    return () => {
      if (referralsTimer.current) {
        clearTimeout(
          referralsTimer.current
        );

        referralsTimer.current = null;
      }
    };
  }, [
    visitId,
    isHydrating,
    referrals,
  ]);

  /*
   * ==========================================
   * CLEANUP
   * ==========================================
   */

  useEffect(() => {
    return () => {
      if (proceduresTimer.current) {
        clearTimeout(
          proceduresTimer.current
        );
      }

      if (referralsTimer.current) {
        clearTimeout(
          referralsTimer.current
        );
      }
    };
  }, []);
}