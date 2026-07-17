import { View } from "react-native";

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
    <View>
      {template.sections.map((section) => (
        <ComplaintSectionRenderer
          key={section.code}
          section={section}
          values={values}
          onChange={onChange}
        />
      ))}
    </View>
  );
}