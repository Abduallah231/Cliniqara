import { useEffect, useRef } from "react";
import {
  savePastHistory,
  type SavePastHistoryInput,
} from "@/services/visitApi";
import type {
  DynamicFieldValue,
  Hospitalization,
  Operation,
  BloodTransfusion,
  MajorTrauma,
  ICUAdmission,
} from "@/models/VisitForm/history";

interface Props {
  patientId?: string;
  fields: DynamicFieldValue[];

  chronicDiseases: SavePastHistoryInput["chronicDiseases"];
  hospitalizations: Hospitalization[];
  operations: Operation[];
  bloodTransfusions: BloodTransfusion[];
  majorTraumas: MajorTrauma[];
  icuAdmissions: ICUAdmission[];

  isHydrating?: boolean;
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeNullableText(value: unknown) {
  const text = normalizeText(value);
  return text || null;
}

function normalizeDate(value: unknown) {
  const text = normalizeText(value);
  return text || null;
}

function mapChronicDiseases(
  diseases: SavePastHistoryInput["chronicDiseases"],
) {
  return diseases
    .map((disease) => ({
      diseaseCode: normalizeText(disease.diseaseCode),
      diseaseName: normalizeText(disease.diseaseName),
      notes: normalizeNullableText(disease.notes),
    }))
    .filter(
      (disease) =>
        disease.diseaseCode || disease.diseaseName,
    );
}

function mapHospitalizations(
  items: Hospitalization[],
): SavePastHistoryInput["hospitalizations"] {
  return items
    .map((item) => ({
      reason: normalizeText(item.reason),
      date: normalizeDate(item.date),
      duration: normalizeNullableText(item.duration),
    }))
    .filter((item) => item.reason);
}

function mapOperations(
  items: Operation[],
): SavePastHistoryInput["operations"] {
  return items
    .map((item) => ({
      operationName: normalizeText(item.name),
      date: normalizeDate(item.date),
      indication: normalizeNullableText(item.indication),
    }))
    .filter((item) => item.operationName);
}

function mapBloodTransfusions(
  items: BloodTransfusion[],
): SavePastHistoryInput["bloodTransfusions"] {
  return items.map((item) => ({
    reason: normalizeNullableText(item.reason),
    date: normalizeDate(item.date),
    reaction: normalizeNullableText(item.reaction),
  }));
}

function mapMajorTraumas(
  items: MajorTrauma[],
): SavePastHistoryInput["majorTraumas"] {
  return items
    .map((item) => ({
      traumaType: normalizeText(item.type),
      date: normalizeDate(item.date),
      complications: normalizeNullableText(
        item.complications,
      ),
    }))
    .filter((item) => item.traumaType);
}

function mapICUAdmissions(
  items: ICUAdmission[],
): SavePastHistoryInput["icuAdmissions"] {
  return items
    .map((item) => ({
      reason: normalizeText(item.reason),
      date: normalizeDate(item.date),
      duration: normalizeNullableText(item.duration),
      ventilatorSupport:
        item.ventilatorSupport ?? false,
    }))
    .filter((item) => item.reason);
}

export function mapPastHistoryFieldsToApi({
  chronicDiseases,
  hospitalizations,
  operations,
  bloodTransfusions,
  majorTraumas,
  icuAdmissions,
}: {
  chronicDiseases: SavePastHistoryInput["chronicDiseases"];
  hospitalizations: Hospitalization[];
  operations: Operation[];
  bloodTransfusions: BloodTransfusion[];
  majorTraumas: MajorTrauma[];
  icuAdmissions: ICUAdmission[];
}): SavePastHistoryInput {
  return {
    chronicDiseases:
      mapChronicDiseases(chronicDiseases),

    hospitalizations:
      mapHospitalizations(hospitalizations),

    operations:
      mapOperations(operations),

    bloodTransfusions:
      mapBloodTransfusions(bloodTransfusions),

    majorTraumas:
      mapMajorTraumas(majorTraumas),

    icuAdmissions:
      mapICUAdmissions(icuAdmissions),
  };
}

export function mapPastHistoryFromBackend(
  data: Record<string, any>,
) {
  return {
    chronicDiseases:
      Array.isArray(data.chronicDiseases)
        ? data.chronicDiseases
        : [],

    hospitalizations:
      Array.isArray(data.hospitalizations)
        ? data.hospitalizations.map(
            (item: any) => ({
              id: item.id,
              reason: item.reason ?? "",
              date: item.date ?? "",
              duration:
                item.duration ?? "",
            }),
          )
        : [],

    operations:
      Array.isArray(data.operations)
        ? data.operations.map(
            (item: any) => ({
              id: item.id,
              name:
                item.operationName ?? "",
              date: item.date ?? "",
              indication:
                item.indication ?? "",
            }),
          )
        : [],

    bloodTransfusions:
      Array.isArray(data.bloodTransfusions)
        ? data.bloodTransfusions.map(
            (item: any) => ({
              id: item.id,
              reason:
                item.reason ?? "",
              date: item.date ?? "",
              reaction:
                item.reaction ?? "",
            }),
          )
        : [],

    majorTraumas:
      Array.isArray(data.majorTraumas)
        ? data.majorTraumas.map(
            (item: any) => ({
              id: item.id,
              type:
                item.traumaType ?? "",
              date: item.date ?? "",
              complications:
                item.complications ?? "",
            }),
          )
        : [],

    icuAdmissions:
      Array.isArray(data.icuAdmissions)
        ? data.icuAdmissions.map(
            (item: any) => ({
              id: item.id,
              reason:
                item.reason ?? "",
              date: item.date ?? "",
              duration:
                item.duration ?? "",
              ventilatorSupport:
                item.ventilatorSupport ?? false,
            }),
          )
        : [],
  };
}

export default function usePastHistoryAutoSave({
  patientId,
  fields,
  chronicDiseases,
  isHydrating = false,
}: {
  patientId?: string;
  fields: DynamicFieldValue[];
  chronicDiseases: SavePastHistoryInput["chronicDiseases"];
  isHydrating?: boolean;
}) {
  const isFirstRender = useRef(true);
  const hydratedSignature = useRef<string | null>(null);

  const stateSignature = JSON.stringify({
    fields,
    chronicDiseases,
  });

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHydrating) {
      hydratedSignature.current = stateSignature;
      return;
    }

    if (
      hydratedSignature.current ===
      stateSignature
    ) {
      hydratedSignature.current = null;
      return;
    }

    const timer = setTimeout(() => {
      const payload: SavePastHistoryInput = {
        chronicDiseases:
          mapChronicDiseases(chronicDiseases),

        hospitalizations: [],
        operations: [],
        bloodTransfusions: [],
        majorTraumas: [],
        icuAdmissions: [],
      };

      savePastHistory(
        patientId,
        payload,
      ).catch((error: any) => {
        console.error(
          "PAST HISTORY AUTOSAVE FAILED:",
          error?.response?.data ?? error,
        );
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    stateSignature,
  ]);
}