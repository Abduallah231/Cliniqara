import { useEffect, useRef } from "react";
import { savePediatricHistory } from "@/services/visitApi";

interface Props {
  visitId?: string;
  pediatricHistory: Record<string, any>;
}

export default function usePediatricHistoryAutoSave({
  visitId,
  pediatricHistory,
}: Props) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!visitId) {
      return;
    }

    /*
     * Do not save the initial state.
     * The first render represents the current
     * local/backend-loaded visit state.
     */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      savePediatricHistory(
        visitId,
        pediatricHistory,
      ).catch((error: any) => {
        console.error(
          "PEDIATRIC HISTORY AUTOSAVE FAILED:",
          error?.response?.data ?? error,
        );
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    JSON.stringify(pediatricHistory),
  ]);
}