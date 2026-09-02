import { useEffect, useRef } from "react";
import {
  getDiagnosis,
  saveDiagnosis,
} from "@/services/visitApi";
import type { DiagnosisInput } from "@/services/visitApi";
import type { Diagnosis } from "@/models/VisitForm/assessment";

interface Props {
  visitId?: string;
  diagnosis: {
    primaryDiagnosis?: Diagnosis;
    differentialDiagnoses: Diagnosis[];
  };
  isHydrating?: boolean;
}

function mapDiagnosisToApi(
  diagnosis: Diagnosis,
): DiagnosisInput {
  return {
    code: diagnosis.code,
    diagnosis: diagnosis.diagnosis,
  };
}

export function mapDiagnosisToBackend(
  diagnosis: Props["diagnosis"],
) {
  return {
    primaryDiagnosisCode:
      diagnosis.primaryDiagnosis?.code ?? null,

    primaryDiagnosisName:
      diagnosis.primaryDiagnosis?.diagnosis ?? null,

    differentialDiagnoses:
      diagnosis.differentialDiagnoses.map(
        mapDiagnosisToApi,
      ),
  };
}

export function mapDiagnosisFromBackend(
  data: Awaited<ReturnType<typeof getDiagnosis>>,
): Props["diagnosis"] {
  return {
    primaryDiagnosis:
      data?.primaryDiagnosisCode &&
      data?.primaryDiagnosisName
        ? {
            code: data.primaryDiagnosisCode,
            diagnosis: data.primaryDiagnosisName,
          }
        : undefined,

    differentialDiagnoses:
      Array.isArray(data?.differentialDiagnoses)
        ? data.differentialDiagnoses
            .filter(
              (
                item,
              ): item is DiagnosisInput =>
                !!item &&
                typeof item.code === "string" &&
                typeof item.diagnosis === "string",
            )
            .map((item) => ({
              code: item.code,
              diagnosis: item.diagnosis,
            }))
        : [],
  };
}

export default function useDiagnosisAutoSave({
  visitId,
  diagnosis,
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

    const signature = JSON.stringify(diagnosis);

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
      saveDiagnosis(
        visitId,
        mapDiagnosisToBackend(diagnosis),
      ).catch((error: any) => {
        console.error(
          "DIAGNOSIS AUTOSAVE FAILED:",
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
    JSON.stringify(diagnosis),
  ]);
}