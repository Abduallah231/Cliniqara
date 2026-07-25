export const chiefComplaints = [
  {
    code: "ABDOMINAL_PAIN",
    name: "Abdominal Pain",
    version: 1,

    template: {
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
              type: "SINGLE_SELECT",
              required: true,
              options: [
                { code: "LOCATION_EPIGASTRIC", label: "Epigastric" },
                { code: "LOCATION_RUQ", label: "RUQ" },
                { code: "LOCATION_LUQ", label: "LUQ" },
                { code: "LOCATION_RLQ", label: "RLQ" },
                { code: "LOCATION_LLQ", label: "LLQ" },
                { code: "LOCATION_SUPRAPUBIC", label: "Suprapubic" },
                { code: "LOCATION_FLANK", label: "Flank" },
                { code: "LOCATION_DIFFUSE", label: "Diffuse" },
              ],
            },
          ],
        },
      ],
    },
  },
];