import { Text } from "react-native";
import ComplaintTemplateRenderer from "@/features/complaints/components/ComplaintTemplateRenderer";
import useComplaintForm from "@/features/complaints/hooks/useComplaintForm";
import GenericAnalysis from "./GenericAnalysis";
import { useEffect, useState } from "react";
import { getChiefComplaintTemplate } from "@/services/chiefComplaintApi";
import { useVisitStore } from "@/store/visitStore";
import { ComplaintTemplate } from "@/features/complaints/models/ComplaintTemplate";
import useComplaintAutoSave from "@/features/complaints/hooks/useComplaintAutoSave";

export default function AnalysisOfComplaint() {
  const { visit } = useVisitStore();

  const chiefComplaint = visit.history.chiefComplaint;

  const [template, setTemplate] = useState<ComplaintTemplate>();
  useEffect(() => {
    if (!chiefComplaint.complaintId) {
      setTemplate(undefined);
      return;
    }
    async function loadTemplate() {
      try {
        const data = await getChiefComplaintTemplate(
          chiefComplaint.complaintId
        );
        setTemplate(data.template);;
      } catch (e) {
        console.error(e);
      }
    }
    loadTemplate();
  }, [chiefComplaint.complaintId]);

  const { values, setValue } =
    useComplaintForm(template);

  useComplaintAutoSave({
    visitId: visit.metadata.id,
    chiefComplaintId: chiefComplaint.complaintId,
    answers: values,
  });

  if (!chiefComplaint.complaintId) {
    return <Text>Please select a chief complaint first.</Text>;
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