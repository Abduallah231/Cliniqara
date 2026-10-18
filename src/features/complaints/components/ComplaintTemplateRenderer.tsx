

import AppView from "@/components/common/AppView";
import { ComplaintTemplate } from "../models/ComplaintTemplate";
import ComplaintSectionRenderer from "./ComplaintSectionRenderer";

type Props = {
  template: ComplaintTemplate;
  values: Record<string, any>;
  onChange: (fieldCode: string, value: any) => void;
};

export default function ComplaintTemplateRenderer({
  template,
  values,
  onChange,
}: Props) {
  return (
    <AppView>
      {template.sections.map((section) => (
        <ComplaintSectionRenderer
          key={section.code}
          section={section}
          values={values}
          onChange={onChange}
        />
      ))}
    </AppView>
  );
}