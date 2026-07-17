import { FieldType } from "../models/FieldType";
import { ComplaintTemplate } from "../models/ComplaintTemplate";

export const coughTemplate: ComplaintTemplate = {
  code: "COUGH",
  title: "Cough",
  version: 1,

  sections: [
    {
      code: "COUGH_DURATION",
      title: "Duration",
      required: true,
      fields: [
        {
          code: "DURATION",
          label: "Duration",
          type: FieldType.DURATION,
          required: true,
        },
        {
          code: "COUGH_DURATION_CLASS",
          label: "Classification",
          type: FieldType.SINGLE_SELECT,
          required: true,
          options: [
            {
              code: "ACUTE",
              label: "Acute (<3 weeks)",
            },
            {
              code: "SUBACUTE",
              label: "Subacute (3–8 weeks)",
            },
            {
              code: "CHRONIC",
              label: "Chronic (>8 weeks)",
            },
          ],
        },
      ],
    },

    {
      code: "COUGH_CHARACTER",
      title: "Character",
      fields: [
        {
          code: "CHARACTER",
          label: "Character",
          type: FieldType.SINGLE_SELECT,
          required: true,
          options: [
            {
              code: "DRY",
              label: "Dry",
            },
            {
              code: "PRODUCTIVE",
              label: "Productive",
            },
          ],
        },
      ],
    },

    {
      code: "SPUTUM",
      title: "Sputum History",
      fields: [
        {
          code: "SPUTUM_APPEARANCE",
          label: "Sputum Appearance",
          type: FieldType.MULTI_SELECT,
          required: false,
          options: [
            {
              code: "CLEAR_WHITE",
              label: "Clear / White",
            },
            {
              code: "YELLOW_GREEN",
              label: "Yellow / Green",
            },
            {
              code: "FOUL_SMELLING",
              label: "Foul Smelling",
            },
            {
              code: "BLOOD_STAINED",
              label: "Blood Stained",
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
          code: "SYMPTOMS",
          label: "Associated Symptoms",
          type: FieldType.MULTI_SELECT,
          required: false,
          options: [
            {
              code: "FEVER",
              label: "Fever",
            },
            {
              code: "DYSPNEA",
              label: "Dyspnea",
            },
            {
              code: "WHEEZE",
              label: "Wheeze",
            },
            {
              code: "CHEST_PAIN",
              label: "Chest Pain",
            },
            {
              code: "WEIGHT_LOSS",
              label: "Weight Loss",
            },
            {
              code: "NIGHT_SWEATS",
              label: "Night Sweats",
            },
            {
              code: "RUNNY_NOSE",
              label: "Runny Nose",
            },
            {
              code: "SORE_THROAT",
              label: "Sore Throat",
            },
            {
              code: "FATIGUE",
              label: "Fatigue",
            },
            {
              code: "THROAT_CLEARING",
              label: "Throat Clearing",
            },
            {
              code: "MUCUS_IN_THROAT",
              label: "Sensation of Mucus in Throat",
            },
            {
              code: "HEARTBURN",
              label: "Heartburn",
            },
            {
              code: "ORTHOPNEA",
              label: "Orthopnea",
            },
            {
              code: "RECURRENT_INFECTIONS",
              label: "Recurrent Infections",
            },
          ],
        },
      ],
    },

    {
      code: "TIMING",
      title: "Timing",
      fields: [
        {
          code: "COUGH_TIMING",
          label: "Timing",
          type: FieldType.MULTI_SELECT,
          required: false,
          options: [
            {
              code: "NIGHT",
              label: "Night Time",
            },
            {
              code: "MORNING",
              label: "Morning",
            },
            {
              code: "AFTER_MEALS",
              label: "After Meals",
            },
            {
              code: "SEASONAL",
              label: "Seasonal",
            },
          ],
        },
      ],
    },

    {
      code: "TRIGGERS",
      title: "Triggering Factors",
      fields: [
        {
          code: "TRIGGERS",
          label: "Triggering Factors",
          type: FieldType.MULTI_SELECT,
          required: false,
          options: [
            {
              code: "EXERCISE",
              label: "Exercise",
            },
            {
              code: "COLD_AIR",
              label: "Cold Air",
            },
            {
              code: "DUST",
              label: "Dust",
            },
            {
              code: "LYING_FLAT",
              label: "Lying Flat",
            },
          ],
        },
      ],
    },

    {
      code: "MEDICATION_HISTORY",
      title: "Medication History",
      fields: [
        {
          code: "ACE_INHIBITOR",
          label: "ACE Inhibitor Use",
          type: FieldType.BOOLEAN,
          required: false,
        },
      ],
    },

    {
      code: "OCCUPATIONAL_HISTORY",
      title: "Occupational History",
      fields: [
        {
          code: "OCCUPATIONAL_EXPOSURE",
          label: "Occupational Exposure",
          type: FieldType.MULTI_SELECT,
          required: false,
          options: [
            {
              code: "DUST_EXPOSURE",
              label: "Dust Exposure",
            },
            {
              code: "CHEMICALS",
              label: "Chemicals",
            },
            {
              code: "FACTORY_WORK",
              label: "Factory Work",
            },
            {
              code: "MINING",
              label: "Mining",
            },
          ],
        },
      ],
    },

    {
      code: "EXPOSURE_HISTORY",
      title: "Exposure History",
      fields: [
        {
          code: "EXPOSURES",
          label: "Exposure History",
          type: FieldType.MULTI_SELECT,
          required: false,
          options: [
            {
              code: "SICK_CONTACT",
              label: "Sick Contacts",
            },
            {
              code: "TB_CONTACT",
              label: "TB Exposure",
            },
            {
              code: "RECENT_TRAVEL",
              label: "Recent Travel",
            },
          ],
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
              code: "HEMOPTYSIS",
              label: "Hemoptysis",
            },
            {
              code: "WEIGHT_LOSS",
              label: "Weight Loss",
            },
            {
              code: "PERSISTENT_FEVER",
              label: "Persistent Fever",
            },
            {
              code: "SIGNIFICANT_DYSPNEA",
              label: "Significant Dyspnea",
            },
            {
              code: "NEW_COUGH_OLDER_SMOKER",
              label: "New Cough in Older Smoker",
            },
          ],
        },
      ],
    },
  ],
};