import { useEffect, useRef } from "react";
import { saveChiefComplaint } from "@/services/visitApi";
import { useVisitStore } from "@/store/visitStore";

interface Props {
  visitId?: string;
  chiefComplaintId?: string;
  answers: Record<string, any>;
  isHydrating?: boolean;
}

export default function useComplaintAutoSave({
  visitId,
  chiefComplaintId,
  answers,
  isHydrating = false,
}: Props) {
  const previousComplaintId =
    useRef<string | undefined>(
      chiefComplaintId
    );

  const hydratedSignature =
    useRef<string | null>(null);

  const isFirstRender =
    useRef(true);

  useEffect(() => {
    if (
      !visitId ||
      !chiefComplaintId
    ) {
      return;
    }

    /*
     * First render:
     * never autosave existing Zustand state.
     */
    if (isFirstRender.current) {
      isFirstRender.current =
        false;

      return;
    }

    /*
     * Complaint changed.
     *
     * The store clears the previous analysis.
     * Do not save that transition.
     */
    if (
      previousComplaintId.current !==
      chiefComplaintId
    ) {
      previousComplaintId.current =
        chiefComplaintId;

      hydratedSignature.current =
        null;

      return;
    }

    const signature =
      JSON.stringify(answers);

    /*
     * Backend hydration.
     */
    if (isHydrating) {
      hydratedSignature.current =
        signature;

      return;
    }

    /*
     * The current state is exactly what
     * came from backend.
     *
     * Do not send it back immediately.
     */
    if (
      hydratedSignature.current ===
      signature
    ) {
      hydratedSignature.current =
        null;

      return;
    }

    const timer =
      setTimeout(() => {
        // A debounced save from the previous complaint may fire just after
        // the user selects another one. Never let that stale write win.
        if (
          useVisitStore.getState().visit.history.chiefComplaint.complaintId !==
          chiefComplaintId
        ) {
          return;
        }

        saveChiefComplaint(
          visitId,
          chiefComplaintId,
          {
            answers,
          }
        ).catch((error) => {
          console.error(
            "CHIEF COMPLAINT AUTOSAVE FAILED:",
            error
          );
        });
      }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    chiefComplaintId,
    isHydrating,
    JSON.stringify(answers),
  ]);
}
