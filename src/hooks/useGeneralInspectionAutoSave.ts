import { useEffect, useRef } from "react";
import {
  saveGeneralInspection,
  type SaveGeneralInspectionInput,
} from "@/services/visitApi";
import type { GeneralInspection } from "@/models/VisitForm/examination";

interface Props {
  visitId?: string;
  generalInspection: GeneralInspection;
  isHydrating?: boolean;
}

export function mapGeneralInspectionToApi(
  generalInspection: GeneralInspection,
): SaveGeneralInspectionInput {
  return {
    consciousness:
      generalInspection.consciousness || null,

    appearance:
      generalInspection.appearance || null,

    hydration:
      generalInspection.hydration || null,

    bodyBuild:
      generalInspection.bodyBuild || null,

    nourishment:
      generalInspection.nourishment || null,

    findings:
      generalInspection.findings ?? [],

    edemaLocations:
      generalInspection.edemaLocations ?? [],
  };
}

export function mapGeneralInspectionFromBackend(
  data: Record<string, unknown>,
): Partial<GeneralInspection> {
  return {
    consciousness:
      typeof data.consciousness === "string"
        ? data.consciousness
        : "",

    appearance:
      typeof data.appearance === "string"
        ? data.appearance
        : "",

    hydration:
      typeof data.hydration === "string"
        ? data.hydration
        : "",

    bodyBuild:
      typeof data.bodyBuild === "string"
        ? data.bodyBuild
        : "",

    nourishment:
      typeof data.nourishment === "string"
        ? data.nourishment
        : "",

    findings:
      Array.isArray(data.findings)
        ? data.findings.filter(
            (item): item is string =>
              typeof item === "string",
          )
        : [],

    edemaLocations:
      Array.isArray(data.edemaLocations)
        ? data.edemaLocations.filter(
            (item): item is string =>
              typeof item === "string",
          )
        : [],
  };
}

export default function useGeneralInspectionAutoSave({
  visitId,
  generalInspection,
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
      JSON.stringify(generalInspection);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHydrating) {
      hydratedSignature.current = signature;
      return;
    }

    if (
      hydratedSignature.current === signature
    ) {
      hydratedSignature.current = null;
      return;
    }

    const timer = setTimeout(() => {
      saveGeneralInspection(
        visitId,
        mapGeneralInspectionToApi(
          generalInspection,
        ),
      ).catch((error: any) => {
        console.error(
          "GENERAL INSPECTION AUTOSAVE FAILED:",
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
    JSON.stringify(generalInspection),
  ]);
}