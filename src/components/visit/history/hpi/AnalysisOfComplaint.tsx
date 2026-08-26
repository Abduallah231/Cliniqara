import { Text } from "react-native";
import { useEffect, useMemo, useState } from "react";

import ComplaintTemplateRenderer from "@/features/complaints/components/ComplaintTemplateRenderer";
import useComplaintAutoSave from "@/features/complaints/hooks/useComplaintAutoSave";

import { getChiefComplaintTemplate } from "@/services/chiefComplaintApi";
import { useVisitStore } from "@/store/visitStore";

import { ComplaintTemplate } from "@/features/complaints/models/ComplaintTemplate";

import GenericAnalysis from "./GenericAnalysis";

export default function AnalysisOfComplaint() {
  const visit = useVisitStore(
    (state) => state.visit
  );

  const updateAnalysisField =
    useVisitStore(
      (state) => state.updateAnalysisField
    );

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
            chiefComplaint.complaintId
          );

        if (!cancelled) {
          setTemplate(data.template);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load complaint template:",
            error
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

  /*
   * visitStore is the single local source of truth.
   *
   * ComplaintTemplateRenderer expects an object:
   * {
   *   [fieldId]: value
   * }
   *
   * So we derive that object from the store.
   */
  const values = useMemo(() => {
    const result: Record<string, any> = {};

    for (
      const field of
        visit.history.hpi.analysis.fields
    ) {
      result[field.fieldId] = field.value;
    }

    return result;
  }, [
    visit.history.hpi.analysis.fields,
  ]);



  /*
   * Renderer sends the fieldId + value.
   * Store also needs fieldLabel, so we resolve it
   * from the current template before updating the store.
   */
  const handleChange = (
    fieldId: string,
    value: any,
    unit?: string
  ) => {
    if (!template) {
      return;
    }

    const field = template.sections
      ?.flatMap((section: any) =>
        section.fields ?? []
      )
      .find(
        (item: any) =>
          item.fieldId === fieldId
      );

    updateAnalysisField(
      fieldId,
      field?.fieldLabel ?? fieldId,
      value,
      unit
    );
  };

  /*
   * Backend autosave uses the exact same values
   * derived from visitStore.
   */
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
      onChange={handleChange}
    />
  );
}