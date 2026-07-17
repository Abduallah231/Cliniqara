import { View } from "react-native";

import ComplaintTemplateRenderer from "./ComplaintTemplateRenderer";
import { abdominalPainTemplate } from "../templates/abdominalPain.template";
import useComplaintForm from "../hooks/useComplaintForm";

export default function ComplaintEngineTest() {
  const {
  values,
  setValue,
} = useComplaintForm(abdominalPainTemplate);

  return (
    <View>
      <ComplaintTemplateRenderer
          template={abdominalPainTemplate}
          values={values}
          onChange={setValue}
      />
    </View>
  );
}