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
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!visitId || !chiefComplaintId) {
      return;
    }

    // Don't save the initial form state.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveChiefComplaint(
        visitId,
        chiefComplaintId,
        answers,
      ).catch((error) => {
        console.error(
          "Failed to auto-save complaint analysis:",
          error,
        );
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    visitId,
    chiefComplaintId,
    JSON.stringify(answers),
  ]);
}