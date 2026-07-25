import { useEffect } from "react";
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
  useEffect(() => {
    if (!visitId || !chiefComplaintId) {
      return;
    }

    saveChiefComplaint(
      visitId,
      chiefComplaintId,
      answers
    ).catch(console.error);

  }, [
    visitId,
    chiefComplaintId,
    JSON.stringify(answers),
  ]);
}