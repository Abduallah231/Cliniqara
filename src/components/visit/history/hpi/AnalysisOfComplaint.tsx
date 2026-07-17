import { Text } from "react-native";
import type { SelectionOption } from "@/models/selection";

import ComplaintTemplateRenderer from "@/features/complaints/components/ComplaintTemplateRenderer";
import useComplaintForm from "@/features/complaints/hooks/useComplaintForm";
import GenericAnalysis from "./GenericAnalysis";

import { getComplaintTemplate } from "@/features/complaints/registry/ComplaintRegistry";

type Props = {
  chiefComplaint?: SelectionOption;
};

export default function AnalysisOfComplaint({
  chiefComplaint,
}: Props) {
  if (!chiefComplaint) {
    return (
      <Text>
        Please select a chief complaint first.
      </Text>
    );
  }

  const template = getComplaintTemplate(
    chiefComplaint.id
  );

  if (!template) {
    return <GenericAnalysis />;
  }

  const {
    values,
    setValue,
  } = useComplaintForm(template);

  return (
    <ComplaintTemplateRenderer
      template={template}
      values={values}
      onChange={setValue}
    />
  );
}