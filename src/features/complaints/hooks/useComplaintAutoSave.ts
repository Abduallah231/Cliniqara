import { useEffect, useRef } from "react";
import { saveChiefComplaint } from "@/services/visitApi";

interface Props {
  visitId?: string;
  chiefComplaintId?: string;
  answers: Record<string, any>;
}

export default function useComplaintAutoSave({
  visitId,
  chiefComplaintId,
  answers,
}: Props) {
  const previousComplaintId =
    useRef<string | undefined>(
      chiefComplaintId
    );

  const skipNextSave = useRef(true);

  useEffect(() => {
    if (!visitId || !chiefComplaintId) {
      return;
    }

    /*
     * Chief complaint changed.
     *
     * The analysis fields were cleared in
     * visitStore, so do not autosave anything
     * during this transition.
     */
    if (
      previousComplaintId.current !==
      chiefComplaintId
    ) {
      previousComplaintId.current =
        chiefComplaintId;

      skipNextSave.current = true;

      return;
    }

    /*
     * Skip the first render for this complaint.
     */
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveChiefComplaint(
        visitId,
        chiefComplaintId,
        {
          answers,
        },
      ).catch((error) => {
        console.error(
          "AUTOSAVE FAILED:",
          error,
        );
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    chiefComplaintId,
    JSON.stringify(answers),
  ]);
}