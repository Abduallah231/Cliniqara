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
  console.log("AUTOSAVE EFFECT:", {
    visitId,
    chiefComplaintId,
    answers,
    isFirstRender: isFirstRender.current,
  });

  if (!visitId || !chiefComplaintId) {
    console.log(
      "AUTOSAVE SKIPPED: missing visitId or chiefComplaintId"
    );
    return;
  }

  if (isFirstRender.current) {
    console.log(
      "AUTOSAVE SKIPPED: first render"
    );

    isFirstRender.current = false;
    return;
  }

  console.log(
    "AUTOSAVE SCHEDULED"
  );

  const timer = setTimeout(() => {
    console.log(
      "AUTOSAVE FIRING:",
      answers
    );

    saveChiefComplaint(
      visitId,
      chiefComplaintId,
      {
        answers,
      },
    )
      .then(() => {
        console.log(
          "AUTOSAVE SUCCESS"
        );
      })
      .catch((error) => {
        console.error(
          "AUTOSAVE FAILED:",
          error
        );
      });
  }, 500);

  return () => {
    console.log(
      "AUTOSAVE CLEANUP"
    );

    clearTimeout(timer);
  };
}, [
  visitId,
  chiefComplaintId,
  JSON.stringify(answers),
]);
}