import { useEffect, useRef } from "react";
import {
  saveMenstrualHistory,
} from "@/services/visitApi";
import type {
  BleedingDuration,
  CycleRegularity,
  DysmenorrheaSeverity,
  MenstrualFlow,
  PainStart,
  SaveMenstrualHistoryInput,
} from "@/services/visitApi";
import type { DynamicFieldValue } from "@/models/VisitForm/history";

const fieldLabels: Record<string, string> = {
  ageAtMenarche: "Age At Menarche",
  cycleRegularity: "Cycle Regularity",
  cycleLength: "Cycle Length",
  bleedingDuration: "Bleeding Duration",
  menstrualFlow: "Menstrual Flow",
  dysmenorrhea: "Dysmenorrhea",
  painStarts: "Pain Starts",
  painRelievedBy: "Pain Relieved By",
  associatedSymptoms: "Associated Symptoms",
  intermenstrualBleeding:
    "Intermenstrual Bleeding",
  postcoitalBleeding: "Postcoital Bleeding",
  pmsSymptoms: "Premenstrual Symptoms",
  lmp: "Last Menstrual Period",
};

const cycleRegularityToApi: Record<
  string,
  CycleRegularity
> = {
  Regular: "REGULAR",
  Irregular: "IRREGULAR",
  Unknown: "UNKNOWN",
};

const cycleRegularityFromApi = {
  REGULAR: "Regular",
  IRREGULAR: "Irregular",
  UNKNOWN: "Unknown",
} as const;

const bleedingDurationToApi: Record<
  string,
  BleedingDuration
> = {
  "<3 Days": "LESS_THAN_3_DAYS",
  "3-7 Days": "DAYS_3_TO_7",
  ">7 Days": "MORE_THAN_7_DAYS",
};

const bleedingDurationFromApi = {
  LESS_THAN_3_DAYS: "<3 Days",
  DAYS_3_TO_7: "3-7 Days",
  MORE_THAN_7_DAYS: ">7 Days",
} as const;

const menstrualFlowToApi: Record<
  string,
  MenstrualFlow
> = {
  Scanty: "SCANTY",
  Normal: "NORMAL",
  Heavy: "HEAVY",
  Flooding: "FLOODING",
};

const menstrualFlowFromApi = {
  SCANTY: "Scanty",
  NORMAL: "Normal",
  HEAVY: "Heavy",
  FLOODING: "Flooding",
} as const;

const dysmenorrheaToApi: Record<
  string,
  DysmenorrheaSeverity
> = {
  No: "NONE",
  Mild: "MILD",
  Moderate: "MODERATE",
  Severe: "SEVERE",
};

const dysmenorrheaFromApi = {
  NONE: "No",
  MILD: "Mild",
  MODERATE: "Moderate",
  SEVERE: "Severe",
} as const;

const painStartToApi: Record<string, PainStart> = {
  "Before Menses": "BEFORE_MENSES",
  "First Day": "FIRST_DAY",
  "Throughout Menses": "THROUGHOUT_MENSES",
};

const painStartFromApi = {
  BEFORE_MENSES: "Before Menses",
  FIRST_DAY: "First Day",
  THROUGHOUT_MENSES: "Throughout Menses",
} as const;

interface Props {
  visitId?: string;
  fields: DynamicFieldValue[];
  isHydrating?: boolean;
}

function getFieldValue(
  fields: DynamicFieldValue[],
  fieldId: string,
) {
  return fields.find(
    (field) => field.fieldId === fieldId,
  )?.value;
}

function parseOptionalInt(value: unknown) {
  const text = String(value ?? "").trim();

  if (!text) {
    return null;
  }

  const parsed = Number.parseInt(text, 10);

  return Number.isNaN(parsed) ? null : parsed;
}

function mapString<T extends string>(
  map: Record<string, T>,
  value: unknown,
) {
  if (typeof value !== "string" || !value) {
    return null;
  }

  return map[value] ?? null;
}

function mapBoolean(value: unknown) {
  if (value === "Yes") {
    return true;
  }

  if (value === "No") {
    return false;
  }

  return null;
}

function mapStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string",
      )
    : [];
}

function createField(
  fieldId: string,
  value: DynamicFieldValue["value"],
): DynamicFieldValue {
  return {
    fieldId,
    fieldLabel: fieldLabels[fieldId] ?? fieldId,
    value,
  };
}

export function mapMenstrualFieldsToApi(
  fields: DynamicFieldValue[],
): SaveMenstrualHistoryInput {
  return {
    ageAtMenarche: parseOptionalInt(
      getFieldValue(fields, "ageAtMenarche"),
    ),
    cycleRegularity: mapString(
      cycleRegularityToApi,
      getFieldValue(fields, "cycleRegularity"),
    ),
    cycleLength: parseOptionalInt(
      getFieldValue(fields, "cycleLength"),
    ),
    bleedingDuration: mapString(
      bleedingDurationToApi,
      getFieldValue(fields, "bleedingDuration"),
    ),
    menstrualFlow: mapString(
      menstrualFlowToApi,
      getFieldValue(fields, "menstrualFlow"),
    ),
    dysmenorrhea: mapString(
      dysmenorrheaToApi,
      getFieldValue(fields, "dysmenorrhea"),
    ),
    painStarts: mapString(
      painStartToApi,
      getFieldValue(fields, "painStarts"),
    ),
    painRelievedBy: mapStringArray(
      getFieldValue(fields, "painRelievedBy"),
    ),
    associatedSymptoms: mapStringArray(
      getFieldValue(fields, "associatedSymptoms"),
    ),
    intermenstrualBleeding: mapBoolean(
      getFieldValue(
        fields,
        "intermenstrualBleeding",
      ),
    ),
    postcoitalBleeding: mapBoolean(
      getFieldValue(fields, "postcoitalBleeding"),
    ),
    pmsSymptoms: mapStringArray(
      getFieldValue(fields, "pmsSymptoms"),
    ),
    lmp:
      String(getFieldValue(fields, "lmp") ?? "")
        .trim() || null,
  };
}

export function mapMenstrualHistoryFromBackend(
  data: Record<string, any>,
): DynamicFieldValue[] {
  return [
    createField(
      "ageAtMenarche",
      data.ageAtMenarche?.toString() ?? "",
    ),
    createField(
      "cycleRegularity",
      cycleRegularityFromApi[
        data.cycleRegularity as keyof typeof cycleRegularityFromApi
      ] ?? "",
    ),
    createField(
      "cycleLength",
      data.cycleLength?.toString() ?? "",
    ),
    createField(
      "bleedingDuration",
      bleedingDurationFromApi[
        data.bleedingDuration as keyof typeof bleedingDurationFromApi
      ] ?? "",
    ),
    createField(
      "menstrualFlow",
      menstrualFlowFromApi[
        data.menstrualFlow as keyof typeof menstrualFlowFromApi
      ] ?? "",
    ),
    createField(
      "dysmenorrhea",
      dysmenorrheaFromApi[
        data.dysmenorrhea as keyof typeof dysmenorrheaFromApi
      ] ?? "",
    ),
    createField(
      "painStarts",
      painStartFromApi[
        data.painStarts as keyof typeof painStartFromApi
      ] ?? "",
    ),
    createField(
      "painRelievedBy",
      data.painRelievedBy ?? [],
    ),
    createField(
      "associatedSymptoms",
      data.associatedSymptoms ?? [],
    ),
    createField(
      "intermenstrualBleeding",
      data.intermenstrualBleeding === null ||
        data.intermenstrualBleeding === undefined
        ? ""
        : data.intermenstrualBleeding
        ? "Yes"
        : "No",
    ),
    createField(
      "postcoitalBleeding",
      data.postcoitalBleeding === null ||
        data.postcoitalBleeding === undefined
        ? ""
        : data.postcoitalBleeding
        ? "Yes"
        : "No",
    ),
    createField("pmsSymptoms", data.pmsSymptoms ?? []),
    createField("lmp", data.lmp ?? ""),
  ];
}

export default function useMenstrualHistoryAutoSave({
  visitId,
  fields,
  isHydrating = false,
}: Props) {
  const isFirstRender = useRef(true);
  const hydratedSignature = useRef<string | null>(
    null,
  );

  useEffect(() => {
    if (!visitId) {
      return;
    }

    const signature = JSON.stringify(fields);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHydrating) {
      hydratedSignature.current = signature;
      return;
    }

    if (hydratedSignature.current === signature) {
      hydratedSignature.current = null;
      return;
    }

    const timer = setTimeout(() => {
      saveMenstrualHistory(
        visitId,
        mapMenstrualFieldsToApi(fields),
      ).catch((error: any) => {
        console.error(
          "MENSTRUAL HISTORY AUTOSAVE FAILED:",
          error?.response?.data ?? error,
        );
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    isHydrating,
    JSON.stringify(fields),
  ]);
}
