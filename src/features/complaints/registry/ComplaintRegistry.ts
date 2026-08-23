import { ComplaintTemplate } from "../models/ComplaintTemplate";
import { abdominalPainTemplate } from "../templates/abdominalPain.template";
import { coughTemplate } from "../templates/cough.template";

export const ComplaintRegistry: Record<
  string,
  ComplaintTemplate
> = {
  ABDOMINAL_PAIN: abdominalPainTemplate,
  COUGH: coughTemplate,
};

export function getComplaintTemplate(code: string) {
  return ComplaintRegistry[code];
}