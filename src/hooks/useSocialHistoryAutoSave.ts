import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getSocialHistory,
  saveSocialHistory,
  type SaveSocialHistoryInput,
} from "@/services/patientApi";

export type SocialHistoryField = {
  fieldId: string;
  fieldLabel: string;
  value:
    | string
    | string[]
    | number
    | boolean
    | null;
  unit?: string;
};

type UseSocialHistoryAutoSaveParams = {
  patientId: string;
  fields: SocialHistoryField[];
  isHydrating: boolean;
};

type SocialHistorySection =
  | "smoking"
  | "alcohol"
  | "livingCondition"
  | "substanceUse"
  | "physicalActivity"
  | "sleep"
  | "socialSupport"
  | "sexualHistory";

// ======================================================
// Section Mapping
// ======================================================

const SECTION_FIELDS: Record<
  SocialHistorySection,
  string[]
> = {
  smoking: [
    "smoking",
    "cigarettesPerDay",
    "yearsSmoking",
    "yearsSinceQuitting",
  ],

  alcohol: [
    "alcohol",
    "alcoholFrequency",
    "yearsSinceStopping",
  ],

  livingCondition: [
    "livingCondition",
    "livingConditionNotes",
  ],

  substanceUse: [
    "substanceUse",
    "substanceNotes",
  ],

  physicalActivity: [
    "physicalActivity",
    "physicalActivityNotes",
  ],

  sleep: [
    "sleepDuration",
    "sleepNotes",
  ],

  socialSupport: [
    "socialSupport",
    "socialSupportNotes",
  ],

  sexualHistory: [
    "sexualHistory",
    "sexualHistoryNotes",
  ],
};

const SECTION_NAMES =
  Object.keys(
    SECTION_FIELDS,
  ) as SocialHistorySection[];

// ======================================================
// Helpers
// ======================================================

function getFieldValue(
  fields: SocialHistoryField[],
  fieldId: string,
) {
  return fields.find(
    (field) =>
      field.fieldId === fieldId,
  )?.value ?? null;
}

function toNumberOrNull(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function toStringOrNull(
  value: unknown,
): string | null {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  return value.trim();
}

function getSectionForField(
  fieldId: string,
): SocialHistorySection | null {
  for (
    const section of SECTION_NAMES
  ) {
    if (
      SECTION_FIELDS[section].includes(
        fieldId,
      )
    ) {
      return section;
    }
  }

  return null;
}

function getChangedSections(
  previousFields:
    | SocialHistoryField[]
    | null,
  currentFields:
    | SocialHistoryField[],
): SocialHistorySection[] {
  if (!previousFields) {
    return [];
  }

  const changedSections =
    new Set<SocialHistorySection>();

  const allFieldIds = new Set([
    ...previousFields.map(
      (field) => field.fieldId,
    ),
    ...currentFields.map(
      (field) => field.fieldId,
    ),
  ]);

  allFieldIds.forEach(
    (fieldId) => {
      const previousValue =
        getFieldValue(
          previousFields,
          fieldId,
        );

      const currentValue =
        getFieldValue(
          currentFields,
          fieldId,
        );

      if (
        JSON.stringify(
          previousValue,
        ) !==
        JSON.stringify(
          currentValue,
        )
      ) {
        const section =
          getSectionForField(
            fieldId,
          );

        if (section) {
          changedSections.add(
            section,
          );
        }
      }
    },
  );

  return Array.from(
    changedSections,
  );
}

// ======================================================
// UI → Backend
// ======================================================

const smokingToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["smoking"]
  >
> = {
  Never: "NEVER",
  Current: "CURRENT",
  Former: "FORMER",
};

const alcoholToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["alcohol"]
  >
> = {
  No: "NO",
  Current: "CURRENT",
  Former: "FORMER",
};

const alcoholFrequencyToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["alcoholFrequency"]
  >
> = {
  Occasional: "OCCASIONAL",
  Weekly: "WEEKLY",
  Daily: "DAILY",
  Heavy: "HEAVY",
};

const livingConditionToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["livingCondition"]
  >
> = {
  "Lives Alone": "LIVES_ALONE",
  "Lives With Family":
    "LIVES_WITH_FAMILY",
  "Nursing Home / Assisted Living":
    "NURSING_HOME",
  Homeless: "HOMELESS",
  Other: "OTHER",
};

const physicalActivityToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["physicalActivity"]
  >
> = {
  Sedentary: "SEDENTARY",
  Light: "LIGHT",
  Moderate: "MODERATE",
  Heavy: "HEAVY",
};

const sleepDurationToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["sleepDuration"]
  >
> = {
  "<5 h": "LESS_THAN_5",
  "5-7 h": "HOURS_5_TO_7",
  "7-9 h": "HOURS_7_TO_9",
  ">9 h": "MORE_THAN_9",
};

const socialSupportToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["socialSupport"]
  >
> = {
  Good: "GOOD",
  Limited: "LIMITED",
  "No Support": "NO_SUPPORT",
  "Caregiver Available":
    "CAREGIVER_AVAILABLE",
};

const sexualHistoryToApi: Record<
  string,
  NonNullable<
    SaveSocialHistoryInput["sexualHistory"]
  >
> = {
  "Not Discussed":
    "NOT_DISCUSSED",
  "Sexually Active":
    "SEXUALLY_ACTIVE",
  "Not Active": "NOT_ACTIVE",
};

// ======================================================
// Build API Payload
// ======================================================

export function buildSocialHistoryPayload(
  fields: SocialHistoryField[],
): SaveSocialHistoryInput {
  const get = (fieldId: string) =>
    getFieldValue(
      fields,
      fieldId,
    );

  const substanceValue =
    get("substanceUse");

  const substanceUse =
    Array.isArray(
      substanceValue,
    )
      ? substanceValue.filter(
          (
            item,
          ): item is string =>
            typeof item ===
            "string",
        )
      : [];

  return {
    smoking:
      typeof get("smoking") ===
      "string"
        ? smokingToApi[
            get("smoking") as string
          ] ?? null
        : null,

    cigarettesPerDay:
      toNumberOrNull(
        get(
          "cigarettesPerDay",
        ),
      ),

    yearsSmoking:
      toNumberOrNull(
        get("yearsSmoking"),
      ),

    yearsSinceQuitting:
      toNumberOrNull(
        get(
          "yearsSinceQuitting",
        ),
      ),

    alcohol:
      typeof get("alcohol") ===
      "string"
        ? alcoholToApi[
            get("alcohol") as string
          ] ?? null
        : null,

    alcoholFrequency:
      typeof get(
        "alcoholFrequency",
      ) === "string"
        ? alcoholFrequencyToApi[
            get(
              "alcoholFrequency",
            ) as string
          ] ?? null
        : null,

    yearsSinceStopping:
      toNumberOrNull(
        get(
          "yearsSinceStopping",
        ),
      ),

    livingCondition:
      typeof get(
        "livingCondition",
      ) === "string"
        ? livingConditionToApi[
            get(
              "livingCondition",
            ) as string
          ] ?? null
        : null,

    livingConditionNotes:
      toStringOrNull(
        get(
          "livingConditionNotes",
        ),
      ),

    substanceUse,

    substanceNotes:
      toStringOrNull(
        get("substanceNotes"),
      ),

    physicalActivity:
      typeof get(
        "physicalActivity",
      ) === "string"
        ? physicalActivityToApi[
            get(
              "physicalActivity",
            ) as string
          ] ?? null
        : null,

    physicalActivityNotes:
      toStringOrNull(
        get(
          "physicalActivityNotes",
        ),
      ),

    sleepDuration:
      typeof get(
        "sleepDuration",
      ) === "string"
        ? sleepDurationToApi[
            get(
              "sleepDuration",
            ) as string
          ] ?? null
        : null,

    sleepNotes:
      toStringOrNull(
        get("sleepNotes"),
      ),

    socialSupport:
      typeof get(
        "socialSupport",
      ) === "string"
        ? socialSupportToApi[
            get(
              "socialSupport",
            ) as string
          ] ?? null
        : null,

    socialSupportNotes:
      toStringOrNull(
        get(
          "socialSupportNotes",
        ),
      ),

    sexualHistory:
      typeof get(
        "sexualHistory",
      ) === "string"
        ? sexualHistoryToApi[
            get(
              "sexualHistory",
            ) as string
          ] ?? null
        : null,

    sexualHistoryNotes:
      toStringOrNull(
        get(
          "sexualHistoryNotes",
        ),
      ),
  };
}

// ======================================================
// Backend → UI
// ======================================================

const smokingFromApi = {
  NEVER: "Never",
  CURRENT: "Current",
  FORMER: "Former",
} as const;

const alcoholFromApi = {
  NO: "No",
  CURRENT: "Current",
  FORMER: "Former",
} as const;

const alcoholFrequencyFromApi = {
  OCCASIONAL: "Occasional",
  WEEKLY: "Weekly",
  DAILY: "Daily",
  HEAVY: "Heavy",
} as const;

const livingConditionFromApi = {
  LIVES_ALONE:
    "Lives Alone",
  LIVES_WITH_FAMILY:
    "Lives With Family",
  NURSING_HOME:
    "Nursing Home / Assisted Living",
  HOMELESS: "Homeless",
  OTHER: "Other",
} as const;

const physicalActivityFromApi = {
  SEDENTARY: "Sedentary",
  LIGHT: "Light",
  MODERATE: "Moderate",
  HEAVY: "Heavy",
} as const;

const sleepDurationFromApi = {
  LESS_THAN_5: "<5 h",
  HOURS_5_TO_7: "5-7 h",
  HOURS_7_TO_9: "7-9 h",
  MORE_THAN_9: ">9 h",
} as const;

const socialSupportFromApi = {
  GOOD: "Good",
  LIMITED: "Limited",
  NO_SUPPORT: "No Support",
  CAREGIVER_AVAILABLE:
    "Caregiver Available",
} as const;

const sexualHistoryFromApi = {
  NOT_DISCUSSED:
    "Not Discussed",
  SEXUALLY_ACTIVE:
    "Sexually Active",
  NOT_ACTIVE: "Not Active",
} as const;

function createField(
  fieldId: string,
  fieldLabel: string,
  value:
    SocialHistoryField["value"],
): SocialHistoryField {
  return {
    fieldId,
    fieldLabel,
    value,
  };
}

export function mapSocialHistoryFromBackend(
  data: Awaited<
    ReturnType<typeof getSocialHistory>
  >,
): SocialHistoryField[] {
  if (!data) {
    return [];
  }

  const fields: SocialHistoryField[] =
    [];

  if (data.smoking) {
    fields.push(
      createField(
        "smoking",
        "Smoking",
        smokingFromApi[
          data.smoking
        ],
      ),
    );
  }

  if (
    data.cigarettesPerDay !==
    null
  ) {
    fields.push(
      createField(
        "cigarettesPerDay",
        "Cigarettes Per Day",
        String(
          data.cigarettesPerDay,
        ),
      ),
    );
  }

  if (
    data.yearsSmoking !==
    null
  ) {
    fields.push(
      createField(
        "yearsSmoking",
        "Years Smoking",
        String(
          data.yearsSmoking,
        ),
      ),
    );
  }

  if (
    data.yearsSinceQuitting !==
    null
  ) {
    fields.push(
      createField(
        "yearsSinceQuitting",
        "Years Since Quitting",
        String(
          data.yearsSinceQuitting,
        ),
      ),
    );
  }

  if (data.alcohol) {
    fields.push(
      createField(
        "alcohol",
        "Alcohol",
        alcoholFromApi[
          data.alcohol
        ],
      ),
    );
  }

  if (
    data.alcoholFrequency
  ) {
    fields.push(
      createField(
        "alcoholFrequency",
        "Alcohol Frequency",
        alcoholFrequencyFromApi[
          data.alcoholFrequency
        ],
      ),
    );
  }

  if (
    data.yearsSinceStopping !==
    null
  ) {
    fields.push(
      createField(
        "yearsSinceStopping",
        "Years Since Stopping",
        String(
          data.yearsSinceStopping,
        ),
      ),
    );
  }

  if (
    data.livingCondition
  ) {
    fields.push(
      createField(
        "livingCondition",
        "Living Condition",
        livingConditionFromApi[
          data.livingCondition
        ],
      ),
    );
  }

  if (
    data.livingConditionNotes
  ) {
    fields.push(
      createField(
        "livingConditionNotes",
        "Living Condition Notes",
        data.livingConditionNotes,
      ),
    );
  }

  if (
    data.substanceUse
      .length > 0
  ) {
    fields.push(
      createField(
        "substanceUse",
        "Substance Use",
        data.substanceUse,
      ),
    );
  }

  if (data.substanceNotes) {
    fields.push(
      createField(
        "substanceNotes",
        "Substance Notes",
        data.substanceNotes,
      ),
    );
  }

  if (
    data.physicalActivity
  ) {
    fields.push(
      createField(
        "physicalActivity",
        "Physical Activity",
        physicalActivityFromApi[
          data.physicalActivity
        ],
      ),
    );
  }

  if (
    data.physicalActivityNotes
  ) {
    fields.push(
      createField(
        "physicalActivityNotes",
        "Physical Activity Notes",
        data.physicalActivityNotes,
      ),
    );
  }

  if (data.sleepDuration) {
    fields.push(
      createField(
        "sleepDuration",
        "Sleep Duration",
        sleepDurationFromApi[
          data.sleepDuration
        ],
      ),
    );
  }

  if (data.sleepNotes) {
    fields.push(
      createField(
        "sleepNotes",
        "Sleep Notes",
        data.sleepNotes,
      ),
    );
  }

  if (data.socialSupport) {
    fields.push(
      createField(
        "socialSupport",
        "Social Support",
        socialSupportFromApi[
          data.socialSupport
        ],
      ),
    );
  }

  if (
    data.socialSupportNotes
  ) {
    fields.push(
      createField(
        "socialSupportNotes",
        "Social Support Notes",
        data.socialSupportNotes,
      ),
    );
  }

  if (data.sexualHistory) {
    fields.push(
      createField(
        "sexualHistory",
        "Sexual History",
        sexualHistoryFromApi[
          data.sexualHistory
        ],
      ),
    );
  }

  if (
    data.sexualHistoryNotes
  ) {
    fields.push(
      createField(
        "sexualHistoryNotes",
        "Sexual History Notes",
        data.sexualHistoryNotes,
      ),
    );
  }

  return fields;
}

// ======================================================
// Auto Save
// ======================================================

export default function useSocialHistoryAutoSave({
  patientId,
  fields,
  isHydrating,
}: UseSocialHistoryAutoSaveParams) {
  const timerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const lastSavedPayloadRef =
    useRef<string | null>(null);

  const previousFieldsRef =
    useRef<
      SocialHistoryField[] | null
    >(null);

  const pendingSectionsRef =
    useRef<
      Set<SocialHistorySection>
    >(
      new Set(),
    );

  const [
    savingSections,
    setSavingSections,
  ] = useState<
    SocialHistorySection[]
  >([]);

  // ======================================================
  // Auto Save
  // ======================================================

  useEffect(() => {
    if (!patientId) {
      return;
    }

    /*
     * While loading:
     * keep the loaded state as our baseline.
     *
     * This prevents the GET response itself
     * from being treated as a user edit.
     */
    if (isHydrating) {
      previousFieldsRef.current =
        fields;

      lastSavedPayloadRef.current =
        JSON.stringify(
          buildSocialHistoryPayload(
            fields,
          ),
        );

      return;
    }

    const previousFields =
      previousFieldsRef.current;

    const changedSections =
      getChangedSections(
        previousFields,
        fields,
      );

    changedSections.forEach(
      (section) => {
        pendingSectionsRef.current.add(
          section,
        );
      },
    );

    previousFieldsRef.current =
      fields;

    const payload =
      buildSocialHistoryPayload(
        fields,
      );

    const payloadKey =
      JSON.stringify(payload);

    /*
     * No actual change.
     */
    if (
      payloadKey ===
        lastSavedPayloadRef.current &&
      pendingSectionsRef.current
        .size === 0
    ) {
      return;
    }

    /*
     * ==================================================
     * Alcohol validation
     * ==================================================
     *
     * Backend requires alcoholFrequency
     * when alcohol is CURRENT or FORMER.
     *
     * Do not send an invalid request.
     */
    const alcohol =
      payload.alcohol;

    const alcoholFrequency =
      payload.alcoholFrequency;

    const alcoholRequiresFrequency =
      alcohol === "CURRENT" ||
      alcohol === "FORMER";

    if (
      alcoholRequiresFrequency &&
      !alcoholFrequency
    ) {
      if (timerRef.current) {
        clearTimeout(
          timerRef.current,
        );
        timerRef.current =
          null;
      }

      return;
    }

    if (timerRef.current) {
      clearTimeout(
        timerRef.current,
      );
    }

    timerRef.current =
      setTimeout(
        async () => {
          const sectionsToSave =
            Array.from(
              pendingSectionsRef.current,
            );

          if (
            sectionsToSave.length === 0
          ) {
            return;
          }

          /*
           * Move current pending sections
           * into saving state.
           */
          pendingSectionsRef.current.clear();

          setSavingSections(
            (current) =>
              Array.from(
                new Set([
                  ...current,
                  ...sectionsToSave,
                ]),
              ),
          );

          try {
            await saveSocialHistory(
              patientId,
              payload,
            );

            lastSavedPayloadRef.current =
              payloadKey;
          } catch (error: any) {
            /*
             * Put the failed sections back
             * so they can be saved again
             * after the next valid change.
             */
            sectionsToSave.forEach(
              (section) => {
                pendingSectionsRef.current.add(
                  section,
                );
              },
            );

            console.error(
              "FAILED SOCIAL HISTORY AUTO-SAVE",
              {
                status:
                  error?.response
                    ?.status,
                data:
                  error?.response
                    ?.data,
                message:
                  error?.message,
                payload,
              },
            );
          } finally {
            setSavingSections(
              (current) =>
                current.filter(
                  (section) =>
                    !sectionsToSave.includes(
                      section,
                    ),
                ),
            );
          }
        },
        500,
      );

    return () => {
      if (timerRef.current) {
        clearTimeout(
          timerRef.current,
        );
      }
    };
  }, [
    patientId,
    fields,
    isHydrating,
  ]);

  // ======================================================
  // Section Saving Status
  // ======================================================

  const isSectionAutoSaving = (
    section: SocialHistorySection,
  ) =>
    savingSections.includes(
      section,
    );

  return {
    isSectionAutoSaving,
  };
}