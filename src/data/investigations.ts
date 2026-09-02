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
  // ======================================================
  // Hematology
  // ======================================================

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
      "RDW",
      "Neutrophils",
      "Lymphocytes",
      "Monocytes",
      "Eosinophils",
      "Basophils",
    ],
  },
  {
    name: "Peripheral Blood Smear",
    type: "text",
  },
  {
    name: "Reticulocyte Count",
    type: "single",
  },
  {
    name: "ESR",
    type: "single",
  },
  {
    name: "CRP",
    type: "single",
  },
  {
    name: "Procalcitonin",
    type: "single",
  },
  {
    name: "Blood Film",
    type: "text",
  },
  {
    name: "G6PD",
    type: "single",
  },
  {
    name: "Coombs Test",
    type: "single",
  },
  {
    name: "Direct Coombs Test",
    type: "single",
  },
  {
    name: "Indirect Coombs Test",
    type: "single",
  },
  {
    name: "Hemoglobin Electrophoresis",
    type: "text",
  },
  {
    name: "Sickle Cell Test",
    type: "single",
  },
  {
    name: "PT",
    type: "single",
  },
  {
    name: "INR",
    type: "single",
  },
  {
    name: "aPTT",
    type: "single",
  },
  {
    name: "Fibrinogen",
    type: "single",
  },
  {
    name: "D-Dimer",
    type: "single",
  },

  // ======================================================
  // Iron Studies
  // ======================================================

  {
    name: "Iron Profile",
    type: "multi",
    fields: [
      "Serum Iron",
      "Ferritin",
      "TIBC",
      "Transferrin",
      "Transferrin Saturation",
    ],
  },
  {
    name: "Ferritin",
    type: "single",
  },
  {
    name: "Serum Iron",
    type: "single",
  },
  {
    name: "TIBC",
    type: "single",
  },
  {
    name: "Transferrin",
    type: "single",
  },

  // ======================================================
  // Diabetes / Glucose
  // ======================================================

  {
    name: "FBS",
    type: "single",
  },
  {
    name: "RBS",
    type: "single",
  },
  {
    name: "PPBS",
    type: "single",
  },
  {
    name: "HbA1c",
    type: "single",
  },
  {
    name: "Insulin",
    type: "single",
  },
  {
    name: "C-Peptide",
    type: "single",
  },
  {
    name: "Oral Glucose Tolerance Test",
    type: "multi",
    fields: [
      "Fasting Glucose",
      "1 Hour Glucose",
      "2 Hour Glucose",
      "3 Hour Glucose",
    ],
  },

  // ======================================================
  // Renal Function
  // ======================================================

  {
    name: "Renal Function Tests",
    type: "multi",
    fields: [
      "Urea",
      "Creatinine",
      "eGFR",
      "Uric Acid",
    ],
  },
  {
    name: "Urea",
    type: "single",
  },
  {
    name: "Creatinine",
    type: "single",
  },
  {
    name: "eGFR",
    type: "single",
  },
  {
    name: "Uric Acid",
    type: "single",
  },
  {
    name: "Urine Albumin/Creatinine Ratio",
    type: "single",
  },
  {
    name: "24 Hour Urine Protein",
    type: "single",
  },

  // ======================================================
  // Electrolytes / Minerals
  // ======================================================

  {
    name: "Electrolytes",
    type: "multi",
    fields: [
      "Na",
      "K",
      "Cl",
      "Bicarbonate",
    ],
  },
  {
    name: "Na",
    type: "single",
  },
  {
    name: "K",
    type: "single",
  },
  {
    name: "Cl",
    type: "single",
  },
  {
    name: "Calcium",
    type: "single",
  },
  {
    name: "Ionized Calcium",
    type: "single",
  },
  {
    name: "Magnesium",
    type: "single",
  },
  {
    name: "Phosphate",
    type: "single",
  },

  // ======================================================
  // Liver Function
  // ======================================================

  {
    name: "Liver Function Tests",
    type: "multi",
    fields: [
      "ALT",
      "AST",
      "ALP",
      "GGT",
      "Total Bilirubin",
      "Direct Bilirubin",
      "Albumin",
      "Total Protein",
    ],
  },
  {
    name: "ALT",
    type: "single",
  },
  {
    name: "AST",
    type: "single",
  },
  {
    name: "ALP",
    type: "single",
  },
  {
    name: "GGT",
    type: "single",
  },
  {
    name: "Total Bilirubin",
    type: "single",
  },
  {
    name: "Direct Bilirubin",
    type: "single",
  },
  {
    name: "Albumin",
    type: "single",
  },
  {
    name: "Total Protein",
    type: "single",
  },

  // ======================================================
  // Lipid Profile
  // ======================================================

  {
    name: "Lipid Profile",
    type: "multi",
    fields: [
      "Total Cholesterol",
      "LDL",
      "HDL",
      "Triglycerides",
      "VLDL",
      "Non-HDL Cholesterol",
    ],
  },
  {
    name: "Total Cholesterol",
    type: "single",
  },
  {
    name: "LDL",
    type: "single",
  },
  {
    name: "HDL",
    type: "single",
  },
  {
    name: "Triglycerides",
    type: "single",
  },

  // ======================================================
  // Thyroid
  // ======================================================

  {
    name: "Thyroid Function Tests",
    type: "multi",
    fields: [
      "TSH",
      "FT4",
      "FT3",
    ],
  },
  {
    name: "TSH",
    type: "single",
  },
  {
    name: "FT4",
    type: "single",
  },
  {
    name: "FT3",
    type: "single",
  },
  {
    name: "Anti-TPO",
    type: "single",
  },
  {
    name: "Anti-Thyroglobulin Antibody",
    type: "single",
  },
  {
    name: "Thyroglobulin",
    type: "single",
  },

  // ======================================================
  // Adrenal / Pituitary
  // ======================================================

  {
    name: "Cortisol",
    type: "single",
  },
  {
    name: "ACTH",
    type: "single",
  },
  {
    name: "Prolactin",
    type: "single",
  },
  {
    name: "Growth Hormone",
    type: "single",
  },
  {
    name: "IGF-1",
    type: "single",
  },

  // ======================================================
  // Reproductive / Gynecology
  // ======================================================

  {
    name: "FSH",
    type: "single",
  },
  {
    name: "LH",
    type: "single",
  },
  {
    name: "Estradiol",
    type: "single",
  },
  {
    name: "Progesterone",
    type: "single",
  },
  {
    name: "Testosterone",
    type: "single",
  },
  {
    name: "Free Testosterone",
    type: "single",
  },
  {
    name: "DHEA-S",
    type: "single",
  },
  {
    name: "AMH",
    type: "single",
  },
  {
    name: "Beta-hCG",
    type: "single",
  },
  {
    name: "Pregnancy Test",
    type: "single",
  },
  {
    name: "Vaginal Swab",
    type: "text",
  },
  {
    name: "Cervical Smear",
    type: "text",
  },
  {
    name: "Pap Smear",
    type: "report",
  },
  {
    name: "HPV Test",
    type: "single",
  },

  // ======================================================
  // Cardiac
  // ======================================================

  {
    name: "Troponin",
    type: "single",
  },
  {
    name: "Troponin I",
    type: "single",
  },
  {
    name: "Troponin T",
    type: "single",
  },
  {
    name: "CK",
    type: "single",
  },
  {
    name: "CK-MB",
    type: "single",
  },
  {
    name: "BNP",
    type: "single",
  },
  {
    name: "NT-proBNP",
    type: "single",
  },
  {
    name: "ECG",
    type: "text",
  },
  {
    name: "Echocardiography",
    type: "report",
  },
  {
    name: "Echo",
    type: "report",
  },
  {
    name: "Holter Monitoring",
    type: "report",
  },
  {
    name: "Exercise Stress Test",
    type: "report",
  },

  // ======================================================
  // Infection / Microbiology
  // ======================================================

  {
    name: "Blood Culture",
    type: "text",
  },
  {
    name: "Urine Culture",
    type: "text",
  },
  {
    name: "Stool Culture",
    type: "text",
  },
  {
    name: "Sputum Culture",
    type: "text",
  },
  {
    name: "Wound Culture",
    type: "text",
  },
  {
    name: "Throat Swab",
    type: "text",
  },
  {
    name: "Nasal Swab",
    type: "text",
  },
  {
    name: "CSF Analysis",
    type: "multi",
    fields: [
      "Appearance",
      "WBC",
      "RBC",
      "Protein",
      "Glucose",
      "Gram Stain",
      "Culture",
    ],
  },
  {
    name: "Stool Analysis",
    type: "multi",
    fields: [
      "Color",
      "Consistency",
      "Blood",
      "Mucus",
      "WBC",
      "RBC",
      "Ova",
      "Parasites",
    ],
  },
  {
    name: "Malaria Test",
    type: "single",
  },
  {
    name: "Dengue NS1",
    type: "single",
  },
  {
    name: "Dengue IgM",
    type: "single",
  },
  {
    name: "Dengue IgG",
    type: "single",
  },
  {
    name: "Widal Test",
    type: "text",
  },
  {
    name: "H. pylori Stool Antigen",
    type: "single",
  },
  {
    name: "H. pylori Urea Breath Test",
    type: "single",
  },

  // ======================================================
  // Viral Serology
  // ======================================================

  {
    name: "HBsAg",
    type: "single",
  },
  {
    name: "Anti-HBs",
    type: "single",
  },
  {
    name: "Anti-HBc",
    type: "single",
  },
  {
    name: "HBeAg",
    type: "single",
  },
  {
    name: "Anti-HBe",
    type: "single",
  },
  {
    name: "HCV Antibody",
    type: "single",
  },
  {
    name: "HCV PCR",
    type: "text",
  },
  {
    name: "HIV Test",
    type: "single",
  },
  {
    name: "HIV PCR",
    type: "text",
  },
  {
    name: "CMV IgM",
    type: "single",
  },
  {
    name: "CMV IgG",
    type: "single",
  },
  {
    name: "EBV VCA IgM",
    type: "single",
  },
  {
    name: "EBV VCA IgG",
    type: "single",
  },
  {
    name: "Rubella IgM",
    type: "single",
  },
  {
    name: "Rubella IgG",
    type: "single",
  },

  // ======================================================
  // Urine
  // ======================================================

  {
    name: "Urine Analysis",
    type: "multi",
    fields: [
      "Color",
      "Appearance",
      "Specific Gravity",
      "pH",
      "Protein",
      "Glucose",
      "Ketones",
      "Blood",
      "Nitrite",
      "Leukocyte Esterase",
      "RBC",
      "WBC",
      "Bacteria",
      "Casts",
      "Crystals",
    ],
  },
  {
    name: "Urine Protein",
    type: "single",
  },
  {
    name: "Urine Albumin",
    type: "single",
  },
  {
    name: "Urine Pregnancy Test",
    type: "single",
  },

  // ======================================================
  // Stool
  // ======================================================

  {
    name: "Stool Examination",
    type: "multi",
    fields: [
      "Color",
      "Consistency",
      "Occult Blood",
      "Mucus",
      "RBC",
      "WBC",
      "Ova",
      "Parasites",
      "Yeast",
    ],
  },
  {
    name: "Fecal Occult Blood",
    type: "single",
  },
  {
    name: "Calprotectin",
    type: "single",
  },

  // ======================================================
  // Pancreatic
  // ======================================================

  {
    name: "Amylase",
    type: "single",
  },
  {
    name: "Lipase",
    type: "single",
  },

  // ======================================================
  // Bone / Metabolic
  // ======================================================

  {
    name: "Vitamin D",
    type: "single",
  },
  {
    name: "Vitamin B12",
    type: "single",
  },
  {
    name: "Folate",
    type: "single",
  },
  {
    name: "PTH",
    type: "single",
  },
  {
    name: "Bone Profile",
    type: "multi",
    fields: [
      "Calcium",
      "Phosphate",
      "ALP",
      "Vitamin D",
      "PTH",
    ],
  },

  // ======================================================
  // Autoimmune / Rheumatology
  // ======================================================

  {
    name: "ANA",
    type: "single",
  },
  {
    name: "Anti-dsDNA",
    type: "single",
  },
  {
    name: "Rheumatoid Factor",
    type: "single",
  },
  {
    name: "Anti-CCP",
    type: "single",
  },
  {
    name: "C3",
    type: "single",
  },
  {
    name: "C4",
    type: "single",
  },
  {
    name: "ANCA",
    type: "single",
  },

  // ======================================================
  // Allergy
  // ======================================================

  {
    name: "Total IgE",
    type: "single",
  },
  {
    name: "Specific IgE",
    type: "text",
  },
  {
    name: "Allergy Skin Test",
    type: "report",
  },

  // ======================================================
  // Arterial / Venous Blood Gas
  // ======================================================

  {
    name: "ABG",
    type: "multi",
    fields: [
      "pH",
      "PaO2",
      "PaCO2",
      "HCO3",
      "SaO2",
      "Base Excess",
      "Lactate",
    ],
  },
  {
    name: "VBG",
    type: "multi",
    fields: [
      "pH",
      "PvO2",
      "PvCO2",
      "HCO3",
      "Lactate",
    ],
  },
  {
    name: "Lactate",
    type: "single",
  },

  // ======================================================
  // Imaging - X-Ray
  // ======================================================

  {
    name: "Chest X-Ray",
    type: "report",
  },
  {
    name: "Abdominal X-Ray",
    type: "report",
  },
  {
    name: "Pelvic X-Ray",
    type: "report",
  },
  {
    name: "Cervical Spine X-Ray",
    type: "report",
  },
  {
    name: "Thoracic Spine X-Ray",
    type: "report",
  },
  {
    name: "Lumbar Spine X-Ray",
    type: "report",
  },
  {
    name: "X-Ray",
    type: "report",
  },

  // ======================================================
  // Ultrasound
  // ======================================================

  {
    name: "Abdominal Ultrasound",
    type: "report",
  },
  {
    name: "Pelvic Ultrasound",
    type: "report",
  },
  {
    name: "Transvaginal Ultrasound",
    type: "report",
  },
  {
    name: "Obstetric Ultrasound",
    type: "report",
  },
  {
    name: "Renal Ultrasound",
    type: "report",
  },
  {
    name: "Thyroid Ultrasound",
    type: "report",
  },
  {
    name: "Breast Ultrasound",
    type: "report",
  },
  {
    name: "Doppler Ultrasound",
    type: "report",
  },

  // ======================================================
  // CT
  // ======================================================

  {
    name: "CT Brain",
    type: "report",
  },
  {
    name: "CT Chest",
    type: "report",
  },
  {
    name: "CT Abdomen",
    type: "report",
  },
  {
    name: "CT Pelvis",
    type: "report",
  },
  {
    name: "CT Abdomen and Pelvis",
    type: "report",
  },
  {
    name: "CT Pulmonary Angiography",
    type: "report",
  },
  {
    name: "CT Angiography",
    type: "report",
  },

  // ======================================================
  // MRI
  // ======================================================

  {
    name: "MRI Brain",
    type: "report",
  },
  {
    name: "MRI Spine",
    type: "report",
  },
  {
    name: "MRI Cervical Spine",
    type: "report",
  },
  {
    name: "MRI Thoracic Spine",
    type: "report",
  },
  {
    name: "MRI Lumbar Spine",
    type: "report",
  },
  {
    name: "MRI Abdomen",
    type: "report",
  },
  {
    name: "MRI Pelvis",
    type: "report",
  },
  {
    name: "MRI Knee",
    type: "report",
  },
  {
    name: "MRI Shoulder",
    type: "report",
  },
  {
    name: "MRI Musculoskeletal",
    type: "report",
  },
  {
    name: "MRI",
    type: "report",
  },

  // ======================================================
  // Nuclear Medicine
  // ======================================================

  {
    name: "Bone Scan",
    type: "report",
  },
  {
    name: "Thyroid Scan",
    type: "report",
  },
  {
    name: "PET CT",
    type: "report",
  },
  {
    name: "V/Q Scan",
    type: "report",
  },

  // ======================================================
  // Pulmonary Function
  // ======================================================

  {
    name: "Spirometry",
    type: "report",
  },
  {
    name: "Pulmonary Function Test",
    type: "report",
  },
  {
    name: "Peak Flow",
    type: "single",
  },
  {
    name: "Bronchoscopy",
    type: "report",
  },

  // ======================================================
  // Gastrointestinal
  // ======================================================

  {
    name: "Upper GI Endoscopy",
    type: "report",
  },
  {
    name: "Colonoscopy",
    type: "report",
  },
  {
    name: "Sigmoidoscopy",
    type: "report",
  },
  {
    name: "ERCP",
    type: "report",
  },
  {
    name: "H. pylori Test",
    type: "single",
  },

  // ======================================================
  // Neurology
  // ======================================================

  {
    name: "EEG",
    type: "report",
  },
  {
    name: "EMG",
    type: "report",
  },
  {
    name: "Nerve Conduction Study",
    type: "report",
  },
  {
    name: "Lumbar Puncture",
    type: "report",
  },

  // ======================================================
  // Ophthalmology
  // ======================================================

  {
    name: "Visual Acuity",
    type: "multi",
    fields: [
      "Right Eye",
      "Left Eye",
    ],
  },
  {
    name: "Intraocular Pressure",
    type: "multi",
    fields: [
      "Right Eye",
      "Left Eye",
    ],
  },
  {
    name: "Fundoscopy",
    type: "report",
  },
  {
    name: "OCT",
    type: "report",
  },
  {
    name: "Visual Field Test",
    type: "report",
  },

  // ======================================================
  // ENT
  // ======================================================

  {
    name: "Audiometry",
    type: "report",
  },
  {
    name: "Tympanometry",
    type: "report",
  },
  {
    name: "ENT Endoscopy",
    type: "report",
  },

  // ======================================================
  // Pathology
  // ======================================================

  {
    name: "Biopsy",
    type: "report",
  },
  {
    name: "Histopathology",
    type: "report",
  },
  {
    name: "Fine Needle Aspiration",
    type: "report",
  },
  {
    name: "Cytology",
    type: "report",
  },
  {
    name: "Bone Marrow Examination",
    type: "report",
  },

  // ======================================================
  // Toxicology / Drug Levels
  // ======================================================

  {
    name: "Drug Screen",
    type: "text",
  },
  {
    name: "Paracetamol Level",
    type: "single",
  },
  {
    name: "Salicylate Level",
    type: "single",
  },
  {
    name: "Lithium Level",
    type: "single",
  },
  {
    name: "Digoxin Level",
    type: "single",
  },
];

export default investigations;