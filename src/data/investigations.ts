export type InvestigationType =
  | "single"
  | "multi"
  | "text"
  | "report";

export interface Investigation {
  name: string;
  type: InvestigationType;
  fields?: string[];
}

const investigations: Investigation[] = [
  {
    name: "CBC",
    type: "multi",
    fields: [
      "Hemoglobin",
      "WBC",
      "Platelets",
      "RBC",
      "Hematocrit",
      "MCV",
      "MCH",
      "MCHC",
    ],
  },

  {
    name: "Iron Profile",
    type: "multi",
    fields: [
      "Serum Iron",
      "Ferritin",
      "TIBC",
      "Transferrin Saturation",
    ],
  },

  { name: "Urinalysis", type: "multi", fields: [
      "Color",
      "Appearance",
      "Specific Gravity",
      "Protein",
      "Glucose",
      "Ketones",
      "Blood",
      "Nitrite",
      "Leukocytes",
      "RBC",
      "WBC",
    ],
  },

  { name: "ESR", type: "single" },
  { name: "CRP", type: "single" },
  { name: "Procalcitonin", type: "single" },
  { name: "Ferritin", type: "single" },

  { name: "FBS", type: "single" },
  { name: "RBS", type: "single" },
  { name: "HbA1c", type: "single" },

  { name: "Urea", type: "single" },
  { name: "Creatinine", type: "single" },
  { name: "Na", type: "single" },
  { name: "K", type: "single" },

  { name: "ALT", type: "single" },
  { name: "AST", type: "single" },
  { name: "ALP", type: "single" },
  { name: "Albumin", type: "single" },

  { name: "TSH", type: "single" },
  { name: "FT4", type: "single" },

  { name: "Troponin", type: "single" },

  { name: "Urine Culture", type: "text" },
  { name: "Blood Culture", type: "text" },
  { name: "ECG", type: "text" },
  { name: "Echo", type: "text" },

  { name: "Chest X-Ray", type: "report" },
  { name: "Abdominal Ultrasound", type: "report" },
  { name: "CT Brain", type: "report" },
  { name: "CT Chest", type: "report" },
  { name: "MRI Brain", type: "report" },
];

export default investigations;