import { useEffect, useRef } from "react";
import {
  saveRegionalExamination,
  type RegionalExaminationArea,
  type RegionalExaminationItem,
  type SaveRegionalExaminationInput,
} from "@/services/visitApi";
import type {
  RegionalExamination,
} from "@/models/VisitForm/examination";

interface Props {
  visitId?: string;
  regionalExamination: RegionalExamination;
  isHydrating?: boolean;
}

const areaToApi: Record<
  keyof RegionalExamination,
  RegionalExaminationArea
> = {
  head: "HEAD",
  neck: "NECK",
  upperLimb: "UPPER_LIMB",
  lowerLimb: "LOWER_LIMB",
};

const areaFromApi: Record<
  RegionalExaminationArea,
  keyof RegionalExamination
> = {
  HEAD: "head",
  NECK: "neck",
  UPPER_LIMB: "upperLimb",
  LOWER_LIMB: "lowerLimb",
};

export function mapRegionalExaminationToApi(
  regionalExamination: RegionalExamination,
): SaveRegionalExaminationInput {
  const areas: (
    keyof RegionalExamination
  )[] = [
    "head",
    "neck",
    "upperLimb",
    "lowerLimb",
  ];

  const regionalExaminations: RegionalExaminationItem[] =
    areas.map((area) => ({
      area: areaToApi[area],
      findings:
        regionalExamination[area].findings ?? [],
      notes:
        regionalExamination[area].notes || null,
    }));

  return {
    regionalExaminations,
  };
}

export function mapRegionalExaminationFromBackend(
  data: unknown,
): Partial<RegionalExamination> {
  const result: Partial<RegionalExamination> = {};

  if (!Array.isArray(data)) {
    return result;
  }

  data.forEach((item) => {
    if (
      !item ||
      typeof item !== "object"
    ) {
      return;
    }

    const backendItem =
      item as Record<string, unknown>;

    const area =
      backendItem.area;

    if (
      typeof area !== "string" ||
      !(
        area === "HEAD" ||
        area === "NECK" ||
        area === "UPPER_LIMB" ||
        area === "LOWER_LIMB"
      )
    ) {
      return;
    }

    const localArea =
      areaFromApi[area];

    const findings =
      Array.isArray(
        backendItem.findings,
      )
        ? backendItem.findings.filter(
            (finding): finding is string =>
              typeof finding === "string",
          )
        : [];

    const notes =
      typeof backendItem.notes ===
      "string"
        ? backendItem.notes
        : "";

    result[localArea] = {
      findings,
      notes,
    };
  });

  return result;
}

export default function useRegionalExaminationAutoSave({
  visitId,
  regionalExamination,
  isHydrating = false,
}: Props) {
  const isFirstRender = useRef(true);

  const hydratedSignature = useRef<
    string | null
  >(null);

  useEffect(() => {
    if (!visitId) {
      return;
    }

    const signature =
      JSON.stringify(
        regionalExamination,
      );

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHydrating) {
      hydratedSignature.current =
        signature;
      return;
    }

    if (
      hydratedSignature.current ===
      signature
    ) {
      hydratedSignature.current = null;
      return;
    }

    const timer = setTimeout(() => {
      saveRegionalExamination(
        visitId,
        mapRegionalExaminationToApi(
          regionalExamination,
        ),
      ).catch((error: any) => {
        console.error(
          "REGIONAL EXAMINATION AUTOSAVE FAILED:",
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
    JSON.stringify(
      regionalExamination,
    ),
  ]);
}