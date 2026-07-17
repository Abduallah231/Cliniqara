import { FieldType } from "../models/FieldType";
import { ComplaintTemplate } from "../models/ComplaintTemplate";

export const abdominalPainTemplate: ComplaintTemplate = {
  code: "ABDOMINAL_PAIN",

  title: "Abdominal Pain",

  version: 1,

  sections: [
    {
      code: "PAIN_LOCATION",

      title: "Location",

      required: true,

      fields: [
        {
          code: "LOCATION",

          label: "Location",

          type: FieldType.SINGLE_SELECT,

          required: true,

          options: [
            {
              code: "LOCATION_EPIGASTRIC",
              label: "Epigastric",
            },
            {
              code: "LOCATION_RUQ",
              label: "RUQ",
            },
            {
              code: "LOCATION_LUQ",
              label: "LUQ",
            },
            {
              code: "LOCATION_RLQ",
              label: "RLQ",
            },
            {
              code: "LOCATION_LLQ",
              label: "LLQ",
            },
            {
              code: "LOCATION_SUPRAPUBIC",
              label: "Suprapubic",
            },
            {
              code: "LOCATION_FLANK",
              label: "Flank",
            },
            {
              code: "LOCATION_DIFFUSE",
              label: "Diffuse",
            },
          ],
        },
      ],
    },

    {
      code: "PAIN_ONSET",

      title: "Onset",

      fields: [
        {
          code: "ONSET",

          label: "Onset",

          type: FieldType.SINGLE_SELECT,

          required: true,

          options: [
            {
              code: "ONSET_SUDDEN",
              label: "Sudden",
            },
            {
              code: "ONSET_GRADUAL",
              label: "Gradual",
            },
          ],
        },
      ],
    },

    {
      code: "PAIN_CHARACTER",

      title: "Character",

      fields: [
        {
          code: "CHARACTER",

          label: "Character",

          type: FieldType.MULTI_SELECT,

          required: true,

          options: [
            {
              code: "CHARACTER_BURNING",
              label: "Burning",
            },
            {
              code: "CHARACTER_COLICKY",
              label: "Colicky",
            },
            {
              code: "CHARACTER_WAVES",
              label: "Comes and goes in waves",
            },
            {
              code: "CHARACTER_SHARP",
              label: "Sharp",
            },
            {
              code: "CHARACTER_DULL_ACHE",
              label: "Dull Ache",
            },
          ],
        },
      ],
    },

    {
      code: "PAIN_RADIATION",

      title: "Radiation",

      fields: [
        {
          code: "RADIATION",

          label: "Radiation",

          type: FieldType.MULTI_SELECT,

          required: false,

          options: [
            {
              code: "RADIATION_BACK",
              label: "Back",
            },
            {
              code: "RADIATION_RIGHT_SHOULDER",
              label: "Right Shoulder",
            },
            {
              code: "RADIATION_GROIN",
              label: "Groin",
            },
            {
              code: "RADIATION_NONE",
              label: "No Radiation",
            },
          ],
        },
      ],
    },

    {
      code: "PAIN_SEVERITY",

      title: "Severity",

      fields: [
        {
          code: "SEVERITY",

          label: "Pain Severity",

          type: FieldType.SEVERITY,

          required: true,
        },
      ],
    },

    {
      code: "PAIN_TIMING",

      title: "Timing",

      fields: [
        {
          code: "TIMING",

          label: "Timing",

          type: FieldType.SINGLE_SELECT,

          required: false,

          options: [
            {
              code: "TIMING_CONSTANT",
              label: "Constant",
            },
            {
              code: "TIMING_INTERMITTENT",
              label: "Intermittent",
            },
          ],
        },
      ],
    },

    {
      code: "AGGRAVATING_RELIEVING",

      title: "Aggravating / Relieving Factors",

      fields: [
        {
          code: "FACTORS",

          label: "Factors",

          type: FieldType.MULTI_SELECT,

          required: false,

          options: [
            {
              code: "FACTOR_WORSE_AFTER_MEALS",
              label: "Worse After Meals",
            },
            {
              code: "FACTOR_WORSE_WITH_FATTY_FOOD",
              label: "Worse With Fatty Foods",
            },
            {
              code: "FACTOR_BETTER_WITH_FOOD",
              label: "Better With Food",
            },
            {
              code: "FACTOR_WORSE_WITH_FOOD",
              label: "Worse With Food",
            },
          ],
        },
      ],
    },

    {
      code: "ASSOCIATED_SYMPTOMS",

      title: "Associated Symptoms",

      fields: [
        {
          code: "ASSOCIATED_SYMPTOMS",

          label: "Associated Symptoms",

          type: FieldType.MULTI_SELECT,

          required: false,

          options: [
            { code: "SYMPTOM_ANOREXIA", label: "Anorexia" },
            { code: "SYMPTOM_NAUSEA", label: "Nausea" },
            { code: "SYMPTOM_VOMITING", label: "Vomiting" },
            { code: "SYMPTOM_ACID_REGURGITATION", label: "Acid Regurgitation" },
            { code: "SYMPTOM_DIARRHEA", label: "Diarrhea" },
            { code: "SYMPTOM_CONSTIPATION", label: "Constipation" },
            { code: "SYMPTOM_BLOATING", label: "Bloating" },
            { code: "SYMPTOM_FEVER", label: "Fever" },
            { code: "SYMPTOM_JAUNDICE", label: "Jaundice" },
            { code: "SYMPTOM_BACK_PAIN", label: "Back Pain" },
            { code: "SYMPTOM_SYNCOPE", label: "Syncope" },
            { code: "SYMPTOM_WEIGHT_LOSS", label: "Weight Loss" },
            { code: "SYMPTOM_GI_BLEEDING", label: "GI Bleeding" },
            { code: "SYMPTOM_URINARY", label: "Urinary Symptoms" },
            { code: "SYMPTOM_GYNAE", label: "Gynecological Symptoms" },
          ],
        },
      ],
    },

    {
      code: "RELEVANT_PMH",

      title: "Relevant Past Medical History",

      fields: [
        {
          code: "PMH",

          label: "Past Medical History",

          type: FieldType.MULTI_SELECT,

          required: false,

          options: [
            { code: "PMH_GALLSTONES", label: "Gallstones" },
            { code: "PMH_PEPTIC_ULCER", label: "Peptic Ulcer Disease" },
            { code: "PMH_KIDNEY_STONES", label: "Kidney Stones" },
            { code: "PMH_IBS", label: "IBS" },
            { code: "PMH_IBD", label: "IBD" },
            { code: "PMH_ABDOMINAL_SURGERY", label: "Previous Abdominal Surgery" },
            { code: "PMH_ANEMIA", label: "Anemia" },
          ],
        },
      ],
    },

    {
      code: "MEDICATION_HISTORY",

      title: "Relevant Medication History",

      fields: [
        {
          code: "MEDICATION_HISTORY",

          label: "Medication History",

          type: FieldType.MULTI_SELECT,

          required: false,

          options: [
            {
              code: "MEDICATION_NSAIDS",
              label: "NSAIDs",
            },
            {
              code: "MEDICATION_ANTIBIOTICS",
              label: "Antibiotics",
            },
          ],
        },
        {
          code: "OTHER_MEDICATIONS",

          label: "Other Medications",

          type: FieldType.TEXTAREA,

          required: false,

          placeholder: "Specify medications...",
        },
      ],
    },

    {
      code: "RED_FLAGS",

      title: "Red Flags",

      fields: [
        {
          code: "RED_FLAGS",

          label: "Red Flags",

          type: FieldType.MULTI_SELECT,

          required: false,

          options: [
            {
              code: "RED_FLAG_PERITONITIS",
              label: "Peritonitic Pain",
            },
            {
              code: "RED_FLAG_UPPER_GI_BLEEDING",
              label: "Upper GI Bleeding",
            },
            {
              code: "RED_FLAG_LOWER_GI_BLEEDING",
              label: "Lower GI Bleeding",
            },
            {
              code: "RED_FLAG_MELENA",
              label: "Melena",
            },
            {
              code: "RED_FLAG_PERSISTENT_VOMITING",
              label: "Persistent Vomiting",
            },
            {
              code: "RED_FLAG_WEIGHT_LOSS",
              label: "Weight Loss",
            },
            {
              code: "RED_FLAG_JAUNDICE",
              label: "Jaundice",
            },
            {
              code: "RED_FLAG_SYNCOPE_OR_SHOCK",
              label: "Syncope or Shock",
            },
          ],
        },
      ],
    },
  ],
};