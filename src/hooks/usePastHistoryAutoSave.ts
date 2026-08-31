import { useEffect, useRef, useState } from "react";
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

/* ======================================================
   Types
====================================================== */

export type PastHistoryAutoSaveSection =
  | "chronicDiseases"
  | "hospitalizations"
  | "operations"
  | "bloodTransfusions"
  | "majorTraumas"
  | "icuAdmissions";

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

/* ======================================================
   Helpers
====================================================== */

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

/* ======================================================
   Mapping
====================================================== */

function mapChronicDiseases(
  diseases: SavePastHistoryInput["chronicDiseases"],
) {
  return diseases
    .map((disease) => ({
      diseaseCode: normalizeText(
        disease.diseaseCode,
      ),
      diseaseName: normalizeText(
        disease.diseaseName,
      ),
      notes: normalizeNullableText(
        disease.notes,
      ),
    }))
    .filter(
      (disease) =>
        disease.diseaseCode ||
        disease.diseaseName,
    );
}

function mapHospitalizations(
  items: Hospitalization[],
): SavePastHistoryInput["hospitalizations"] {
  return items
    .map((item) => ({
      reason: normalizeText(item.reason),
      date: normalizeDate(item.date),
      duration: normalizeNullableText(
        item.duration,
      ),
    }))
    .filter((item) => item.reason);
}

function mapOperations(
  items: Operation[],
): SavePastHistoryInput["operations"] {
  return items
    .map((item) => ({
      operationName: normalizeText(
        item.name,
      ),
      date: normalizeDate(item.date),
      indication: normalizeNullableText(
        item.indication,
      ),
    }))
    .filter(
      (item) => item.operationName,
    );
}

function mapBloodTransfusions(
  items: BloodTransfusion[],
): SavePastHistoryInput["bloodTransfusions"] {
  return items.map((item) => ({
    reason: normalizeNullableText(
      item.reason,
    ),
    date: normalizeDate(item.date),
    reaction: normalizeNullableText(
      item.reaction,
    ),
  }));
}

function mapMajorTraumas(
  items: MajorTrauma[],
): SavePastHistoryInput["majorTraumas"] {
  return items
    .map((item) => ({
      traumaType: normalizeText(item.type),
      date: normalizeDate(item.date),
      complications:
        normalizeNullableText(
          item.complications,
        ),
    }))
    .filter(
      (item) => item.traumaType,
    );
}

function mapICUAdmissions(
  items: ICUAdmission[],
): SavePastHistoryInput["icuAdmissions"] {
  return items
    .map((item) => ({
      reason: normalizeText(item.reason),
      date: normalizeDate(item.date),
      duration: normalizeNullableText(
        item.duration,
      ),
      ventilatorSupport:
        item.ventilatorSupport ?? false,
    }))
    .filter((item) => item.reason);
}

/* ======================================================
   API Mapper
====================================================== */

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
      mapChronicDiseases(
        chronicDiseases,
      ),

    hospitalizations:
      mapHospitalizations(
        hospitalizations,
      ),

    operations:
      mapOperations(operations),

    bloodTransfusions:
      mapBloodTransfusions(
        bloodTransfusions,
      ),

    majorTraumas:
      mapMajorTraumas(majorTraumas),

    icuAdmissions:
      mapICUAdmissions(
        icuAdmissions,
      ),
  };
}

/* ======================================================
   Backend Mapper
====================================================== */

export function mapPastHistoryFromBackend(
  data: Record<string, any>,
) {
  return {
    chronicDiseases:
      Array.isArray(
        data.chronicDiseases,
      )
        ? data.chronicDiseases
        : [],

    hospitalizations:
      Array.isArray(
        data.hospitalizations,
      )
        ? data.hospitalizations.map(
            (item: any) => ({
              id: item.id,
              reason:
                item.reason ?? "",
              date:
                item.date ?? "",
              duration:
                item.duration ?? "",
            }),
          )
        : [],

    operations:
      Array.isArray(
        data.operations,
      )
        ? data.operations.map(
            (item: any) => ({
              id: item.id,
              name:
                item.operationName ??
                "",
              date:
                item.date ?? "",
              indication:
                item.indication ??
                "",
            }),
          )
        : [],

    bloodTransfusions:
      Array.isArray(
        data.bloodTransfusions,
      )
        ? data.bloodTransfusions.map(
            (item: any) => ({
              id: item.id,
              reason:
                item.reason ?? "",
              date:
                item.date ?? "",
              reaction:
                item.reaction ?? "",
            }),
          )
        : [],

    majorTraumas:
      Array.isArray(
        data.majorTraumas,
      )
        ? data.majorTraumas.map(
            (item: any) => ({
              id: item.id,
              type:
                item.traumaType ??
                "",
              date:
                item.date ?? "",
              complications:
                item.complications ??
                "",
            }),
          )
        : [],

    icuAdmissions:
      Array.isArray(
        data.icuAdmissions,
      )
        ? data.icuAdmissions.map(
            (item: any) => ({
              id: item.id,
              reason:
                item.reason ?? "",
              date:
                item.date ?? "",
              duration:
                item.duration ?? "",
              ventilatorSupport:
                item.ventilatorSupport ??
                false,
            }),
          )
        : [],
  };
}

/* ======================================================
   Hook
====================================================== */

export default function usePastHistoryAutoSave({
  patientId,
  fields,
  chronicDiseases,
  hospitalizations,
  operations,
  bloodTransfusions,
  majorTraumas,
  icuAdmissions,
  isHydrating = false,
}: Props) {
  /* ====================================================
     Saving State
  ==================================================== */

  const [
    autoSavingSection,
    setAutoSavingSection,
  ] =
    useState<PastHistoryAutoSaveSection | null>(
      null,
    );

  /* ====================================================
     Hydration / First Render
  ==================================================== */

  const isFirstRender =
    useRef(true);

  const hydratedSignatures =
    useRef<
      Record<
        PastHistoryAutoSaveSection,
        string | null
      >
    >({
      chronicDiseases: null,
      hospitalizations: null,
      operations: null,
      bloodTransfusions: null,
      majorTraumas: null,
      icuAdmissions: null,
    });

  /* ====================================================
     Last Manually Saved Signatures

     Manual Add / Update / Delete already calls
     savePastHistory().

     We mark that exact snapshot as saved so the
     autosave effect does NOT send a duplicate request.
  ==================================================== */

  const lastSavedSignatures =
    useRef<
      Record<
        PastHistoryAutoSaveSection,
        string | null
      >
    >({
      chronicDiseases: null,
      hospitalizations: null,
      operations: null,
      bloodTransfusions: null,
      majorTraumas: null,
      icuAdmissions: null,
    });

  /* ====================================================
     Snapshots

     Each section has its own signature.

     This is the important part:
     changing Hospitalizations changes only the
     Hospitalizations signature.

     It does NOT trigger the other section effects.
  ==================================================== */

  const chronicSignature =
    JSON.stringify(
      chronicDiseases,
    );

  const hospitalizationsSignature =
    JSON.stringify(
      hospitalizations,
    );

  const operationsSignature =
    JSON.stringify(operations);

  const bloodTransfusionsSignature =
    JSON.stringify(
      bloodTransfusions,
    );

  const majorTraumasSignature =
    JSON.stringify(majorTraumas);

  const icuAdmissionsSignature =
    JSON.stringify(icuAdmissions);

  /* ====================================================
     Complete Current Snapshot

     savePastHistory requires the complete payload.
  ==================================================== */

  const buildPayload =
    (): SavePastHistoryInput => {
      return mapPastHistoryFieldsToApi({
        chronicDiseases,
        hospitalizations,
        operations,
        bloodTransfusions,
        majorTraumas,
        icuAdmissions,
      });
    };

  /* ====================================================
     Mark Section as Already Saved

     Component calls this after its existing manual
     Add / Update / Delete request succeeds.
  ==================================================== */

  const markSectionSaved = (
    section: PastHistoryAutoSaveSection,
  ) => {
    const signatures: Record<
      PastHistoryAutoSaveSection,
      string
    > = {
      chronicDiseases:
        chronicSignature,

      hospitalizations:
        hospitalizationsSignature,

      operations:
        operationsSignature,

      bloodTransfusions:
        bloodTransfusionsSignature,

      majorTraumas:
        majorTraumasSignature,

      icuAdmissions:
        icuAdmissionsSignature,
    };

    lastSavedSignatures.current[
      section
    ] = signatures[section];
  };

  /* ====================================================
     FIRST RENDER

     Prevent initial Store values from being treated
     as user changes.
  ==================================================== */

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current =
        false;
    }
  }, []);

  /* ====================================================
     Chronic Diseases Auto Save
  ==================================================== */

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (isHydrating) {
      hydratedSignatures.current.chronicDiseases =
        chronicSignature;
      return;
    }

    if (
      hydratedSignatures.current
        .chronicDiseases ===
      chronicSignature
    ) {
      hydratedSignatures.current.chronicDiseases =
        null;
      return;
    }

    if (
      lastSavedSignatures.current
        .chronicDiseases ===
      chronicSignature
    ) {
      return;
    }

    const timer = setTimeout(
      async () => {
        setAutoSavingSection(
          "chronicDiseases",
        );

        try {
          await savePastHistory(
            patientId,
            buildPayload(),
          );

          lastSavedSignatures.current.chronicDiseases =
            chronicSignature;
        } catch (error: any) {
          console.error(
            "PAST HISTORY CHRONIC DISEASES AUTOSAVE FAILED:",
            error?.response
              ?.data ?? error,
          );
        } finally {
          setAutoSavingSection(
            (current) =>
              current ===
              "chronicDiseases"
                ? null
                : current,
          );
        }
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    chronicSignature,
  ]);

  /* ====================================================
     Hospitalizations Auto Save
  ==================================================== */

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (isHydrating) {
      hydratedSignatures.current.hospitalizations =
        hospitalizationsSignature;
      return;
    }

    if (
      hydratedSignatures.current
        .hospitalizations ===
      hospitalizationsSignature
    ) {
      hydratedSignatures.current.hospitalizations =
        null;
      return;
    }

    if (
      lastSavedSignatures.current
        .hospitalizations ===
      hospitalizationsSignature
    ) {
      return;
    }

    const timer = setTimeout(
      async () => {
        setAutoSavingSection(
          "hospitalizations",
        );

        try {
          await savePastHistory(
            patientId,
            buildPayload(),
          );

          lastSavedSignatures.current.hospitalizations =
            hospitalizationsSignature;
        } catch (error: any) {
          console.error(
            "PAST HISTORY HOSPITALIZATIONS AUTOSAVE FAILED:",
            error?.response
              ?.data ?? error,
          );
        } finally {
          setAutoSavingSection(
            (current) =>
              current ===
              "hospitalizations"
                ? null
                : current,
          );
        }
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    hospitalizationsSignature,
  ]);

  /* ====================================================
     Operations Auto Save
  ==================================================== */

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (isHydrating) {
      hydratedSignatures.current.operations =
        operationsSignature;
      return;
    }

    if (
      hydratedSignatures.current
        .operations ===
      operationsSignature
    ) {
      hydratedSignatures.current.operations =
        null;
      return;
    }

    if (
      lastSavedSignatures.current
        .operations ===
      operationsSignature
    ) {
      return;
    }

    const timer = setTimeout(
      async () => {
        setAutoSavingSection(
          "operations",
        );

        try {
          await savePastHistory(
            patientId,
            buildPayload(),
          );

          lastSavedSignatures.current.operations =
            operationsSignature;
        } catch (error: any) {
          console.error(
            "PAST HISTORY OPERATIONS AUTOSAVE FAILED:",
            error?.response
              ?.data ?? error,
          );
        } finally {
          setAutoSavingSection(
            (current) =>
              current ===
              "operations"
                ? null
                : current,
          );
        }
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    operationsSignature,
  ]);

  /* ====================================================
     Blood Transfusions Auto Save
  ==================================================== */

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (isHydrating) {
      hydratedSignatures.current.bloodTransfusions =
        bloodTransfusionsSignature;
      return;
    }

    if (
      hydratedSignatures.current
        .bloodTransfusions ===
      bloodTransfusionsSignature
    ) {
      hydratedSignatures.current.bloodTransfusions =
        null;
      return;
    }

    if (
      lastSavedSignatures.current
        .bloodTransfusions ===
      bloodTransfusionsSignature
    ) {
      return;
    }

    const timer = setTimeout(
      async () => {
        setAutoSavingSection(
          "bloodTransfusions",
        );

        try {
          await savePastHistory(
            patientId,
            buildPayload(),
          );

          lastSavedSignatures.current.bloodTransfusions =
            bloodTransfusionsSignature;
        } catch (error: any) {
          console.error(
            "PAST HISTORY BLOOD TRANSFUSIONS AUTOSAVE FAILED:",
            error?.response
              ?.data ?? error,
          );
        } finally {
          setAutoSavingSection(
            (current) =>
              current ===
              "bloodTransfusions"
                ? null
                : current,
          );
        }
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    bloodTransfusionsSignature,
  ]);

  /* ====================================================
     Major Trauma Auto Save
  ==================================================== */

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (isHydrating) {
      hydratedSignatures.current.majorTraumas =
        majorTraumasSignature;
      return;
    }

    if (
      hydratedSignatures.current
        .majorTraumas ===
      majorTraumasSignature
    ) {
      hydratedSignatures.current.majorTraumas =
        null;
      return;
    }

    if (
      lastSavedSignatures.current
        .majorTraumas ===
      majorTraumasSignature
    ) {
      return;
    }

    const timer = setTimeout(
      async () => {
        setAutoSavingSection(
          "majorTraumas",
        );

        try {
          await savePastHistory(
            patientId,
            buildPayload(),
          );

          lastSavedSignatures.current.majorTraumas =
            majorTraumasSignature;
        } catch (error: any) {
          console.error(
            "PAST HISTORY MAJOR TRAUMA AUTOSAVE FAILED:",
            error?.response
              ?.data ?? error,
          );
        } finally {
          setAutoSavingSection(
            (current) =>
              current ===
              "majorTraumas"
                ? null
                : current,
          );
        }
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    majorTraumasSignature,
  ]);

  /* ====================================================
     ICU Admissions Auto Save
  ==================================================== */

  useEffect(() => {
    if (!patientId) {
      return;
    }

    if (isHydrating) {
      hydratedSignatures.current.icuAdmissions =
        icuAdmissionsSignature;
      return;
    }

    if (
      hydratedSignatures.current
        .icuAdmissions ===
      icuAdmissionsSignature
    ) {
      hydratedSignatures.current.icuAdmissions =
        null;
      return;
    }

    if (
      lastSavedSignatures.current
        .icuAdmissions ===
      icuAdmissionsSignature
    ) {
      return;
    }

    const timer = setTimeout(
      async () => {
        setAutoSavingSection(
          "icuAdmissions",
        );

        try {
          await savePastHistory(
            patientId,
            buildPayload(),
          );

          lastSavedSignatures.current.icuAdmissions =
            icuAdmissionsSignature;
        } catch (error: any) {
          console.error(
            "PAST HISTORY ICU ADMISSIONS AUTOSAVE FAILED:",
            error?.response
              ?.data ?? error,
          );
        } finally {
          setAutoSavingSection(
            (current) =>
              current ===
              "icuAdmissions"
                ? null
                : current,
          );
        }
      },
      500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    isHydrating,
    icuAdmissionsSignature,
  ]);

  return {
    isAutoSaving:
      autoSavingSection !== null,

    autoSavingSection,

    markSectionSaved,
  };
}