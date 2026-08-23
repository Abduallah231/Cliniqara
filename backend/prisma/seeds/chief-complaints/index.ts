import { abdominalPainTemplate } from "./abdominal-pain.template";
import { coughTemplate } from "./cough.template";

export const chiefComplaints = [
  {
    code: "ABDOMINAL_PAIN",
    name: "Abdominal Pain",
    version: 1,
    template: abdominalPainTemplate,
  },
  {
    code: "COUGH",
    name: "Cough",
    version: 1,
    template: coughTemplate,
  },
];