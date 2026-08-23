import { Text } from "react-native";
import { useEffect, useState } from "react";

import ComplaintTemplateRenderer from "@/features/complaints/components/ComplaintTemplateRenderer";
import useComplaintForm from "@/features/complaints/hooks/useComplaintForm";
import useComplaintAutoSave from "@/features/complaints/hooks/useComplaintAutoSave";

import { getChiefComplaintTemplate } from "@/services/chiefComplaintApi";
import { useVisitStore } from "@/store/visitStore";

import { ComplaintTemplate } from "@/features/complaints/models/ComplaintTemplate";

import GenericAnalysis from "./GenericAnalysis";

export default function AnalysisOfComplaint() {
  const { visit } = useVisitStore();

  const chiefComplaint =
    visit.history.chiefComplaint;

  const [template, setTemplate] =
    useState<ComplaintTemplate>();

  useEffect(() => {
    let cancelled = false;

    async function loadTemplate() {
      if (!chiefComplaint.complaintId) {
        setTemplate(undefined);
        return;
      }

      try {
        const data =
          await getChiefComplaintTemplate(
            chiefComplaint.complaintId,
          );

        if (!cancelled) {
          setTemplate(data.template);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load complaint template:",
            error,
          );
          setTemplate(undefined);
        }
      }
    }

    loadTemplate();

    return () => {
      cancelled = true;
    };
  }, [chiefComplaint.complaintId]);

  const { values, setValue } =
    useComplaintForm(template);

  useComplaintAutoSave({
    visitId: visit.metadata.id,
    chiefComplaintId:
      chiefComplaint.complaintId,
    answers: values,
  });

  if (!chiefComplaint.complaintId) {
    return (
      <Text>
        Please select a chief complaint first.
      </Text>
    );
  }

  if (!template) {
    return <GenericAnalysis />;
  }

  return (
    <ComplaintTemplateRenderer
      template={template}
      values={values}
      onChange={setValue}
    />
  );
}