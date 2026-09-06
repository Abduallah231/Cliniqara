ALTER TABLE "visit_complaint_analysis"
ADD COLUMN "associatedSymptoms" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "redFlags" JSONB NOT NULL DEFAULT '{}';

WITH section_fields AS (
  SELECT
    vca.id,
    COALESCE(
      jsonb_agg(field->>'code') FILTER (
        WHERE section->>'code' = 'ASSOCIATED_SYMPTOMS'
           OR section->>'title' = 'Associated Symptoms'
      ),
      '[]'::jsonb
    ) AS associated_fields,
    COALESCE(
      jsonb_agg(field->>'code') FILTER (
        WHERE section->>'code' = 'RED_FLAGS'
           OR section->>'title' = 'Red Flags'
      ),
      '[]'::jsonb
    ) AS red_flag_fields
  FROM "visit_complaint_analysis" vca
  JOIN "visit_chief_complaints" vcc
    ON vcc.id = vca."visitChiefComplaintId"
  JOIN "chief_complaint_templates" cct
    ON cct."chiefComplaintId" = vcc."chiefComplaintId"
  CROSS JOIN LATERAL jsonb_array_elements(cct.template->'sections') section
  CROSS JOIN LATERAL jsonb_array_elements(section->'fields') field
  GROUP BY vca.id
),
split_values AS (
  SELECT
    vca.id,
    COALESCE(
      jsonb_object_agg(entry.key, entry.value) FILTER (
        WHERE section_fields.associated_fields ? entry.key
      ),
      '{}'::jsonb
    ) AS associated_symptoms,
    COALESCE(
      jsonb_object_agg(entry.key, entry.value) FILTER (
        WHERE section_fields.red_flag_fields ? entry.key
      ),
      '{}'::jsonb
    ) AS red_flags,
    COALESCE(
      jsonb_object_agg(entry.key, entry.value) FILTER (
        WHERE NOT section_fields.associated_fields ? entry.key
          AND NOT section_fields.red_flag_fields ? entry.key
      ),
      '{}'::jsonb
    ) AS remaining_values
  FROM "visit_complaint_analysis" vca
  JOIN section_fields
    ON section_fields.id = vca.id
  CROSS JOIN LATERAL jsonb_each(vca.values::jsonb) entry
  GROUP BY vca.id
)
UPDATE "visit_complaint_analysis" vca
SET
  "associatedSymptoms" = split_values.associated_symptoms,
  "redFlags" = split_values.red_flags,
  values = split_values.remaining_values
FROM split_values
WHERE split_values.id = vca.id;
