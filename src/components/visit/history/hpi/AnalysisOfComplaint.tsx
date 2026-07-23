import { Text } from "react-native";
import ComplaintTemplateRenderer from "@/features/complaints/components/ComplaintTemplateRenderer";
import useComplaintForm from "@/features/complaints/hooks/useComplaintForm";
import GenericAnalysis from "./GenericAnalysis";
import { getComplaintTemplate } from "@/features/complaints/registry/ComplaintRegistry";
import { useVisitStore } from "@/store/visitStore";

export default function AnalysisOfComplaint() {
  const { visit } = useVisitStore();

  const chiefComplaint = visit.history.chiefComplaint;

  const template = chiefComplaint.complaintId
    ? getComplaintTemplate(chiefComplaint.complaintId)
    : undefined;

  const { values, setValue } =
    useComplaintForm(template);

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