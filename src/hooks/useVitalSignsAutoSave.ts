import { useEffect, useRef } from "react";
import {
  getVitalSigns,
  saveVitalSigns,
  type SaveVitalSignsInput,
} from "@/services/visitApi";
import type { VitalSigns } from "@/models/VisitForm/examination";

interface Props {
  visitId?: string;
  vitalSigns: VitalSigns;
  isHydrating?: boolean;
}

export function mapVitalSignsToApi(
  vitalSigns: VitalSigns,
): SaveVitalSignsInput {
  const payload: SaveVitalSignsInput = {};

  const parseInteger = (value: string) => {
    const text = value.trim();

    if (!text) {
      return undefined;
    }

    const parsed = Number.parseInt(text, 10);

    return Number.isNaN(parsed)
      ? undefined
      : parsed;
  };

  const parseNumber = (value: string) => {
    const text = value.trim();

    if (!text) {
      return undefined;
    }

    const parsed = Number(text);

    return Number.isNaN(parsed)
      ? undefined
      : parsed;
  };

  const systolicBP = parseInteger(
    vitalSigns.systolicBP,
  );

  if (systolicBP !== undefined) {
    payload.systolicBP = systolicBP;
  }

  const diastolicBP = parseInteger(
    vitalSigns.diastolicBP,
  );

  if (diastolicBP !== undefined) {
    payload.diastolicBP = diastolicBP;
  }

  const heartRate = parseInteger(
    vitalSigns.heartRate,
  );

  if (heartRate !== undefined) {
    payload.heartRate = heartRate;
  }

  if (vitalSigns.pulseRhythm.trim()) {
    payload.pulseRhythm =
      vitalSigns.pulseRhythm;
  }

  const respiratoryRate = parseInteger(
    vitalSigns.respiratoryRate,
  );

  if (respiratoryRate !== undefined) {
    payload.respiratoryRate =
      respiratoryRate;
  }

  const spo2 = parseInteger(
    vitalSigns.spo2,
  );

  if (spo2 !== undefined) {
    payload.spo2 = spo2;
  }

  if (vitalSigns.oxygenSource.trim()) {
    payload.oxygenSource =
      vitalSigns.oxygenSource;
  }

  const temperature = parseNumber(
    vitalSigns.temperature,
  );

  if (temperature !== undefined) {
    payload.temperature = temperature;
  }

  if (vitalSigns.temperatureRoute.trim()) {
    payload.temperatureRoute =
      vitalSigns.temperatureRoute;
  }

  const bloodGlucose = parseInteger(
    vitalSigns.bloodGlucose,
  );

  if (bloodGlucose !== undefined) {
    payload.bloodGlucose = bloodGlucose;
  }

  const weight = parseNumber(
    vitalSigns.weight,
  );

  if (weight !== undefined) {
    payload.weight = weight;
  }

  const height = parseNumber(
    vitalSigns.height,
  );

  if (height !== undefined) {
    payload.height = height;
  }

  const bmi = parseNumber(
    vitalSigns.bmi,
  );

  if (bmi !== undefined) {
    payload.bmi = bmi;
  }

  return payload;
}

export function mapVitalSignsFromBackend(
  data: Record<string, unknown>,
): Partial<VitalSigns> {
  return {
    systolicBP:
      String(data.systolicBP ?? ""),
    diastolicBP:
      String(data.diastolicBP ?? ""),
    heartRate:
      String(data.heartRate ?? ""),
    pulseRhythm:
      String(data.pulseRhythm ?? ""),
    respiratoryRate:
      String(data.respiratoryRate ?? ""),
    spo2:
      String(data.spo2 ?? ""),
    oxygenSource:
      String(data.oxygenSource ?? ""),
    temperature:
      String(data.temperature ?? ""),
    temperatureRoute:
      String(data.temperatureRoute ?? ""),
    bloodGlucose:
      String(data.bloodGlucose ?? ""),
    weight:
      String(data.weight ?? ""),
    height:
      String(data.height ?? ""),
    bmi:
      String(data.bmi ?? ""),
  };
}

export async function loadVitalSigns(
  visitId: string,
  onLoaded: (values: Partial<VitalSigns>) => void,
) {
  const data = await getVitalSigns(visitId);

  if (!data) {
    return;
  }

  onLoaded(
    mapVitalSignsFromBackend(
      data as Record<string, unknown>,
    ),
  );
}

export default function useVitalSignsAutoSave({
  visitId,
  vitalSigns,
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

    const signature = JSON.stringify(vitalSigns);

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
      saveVitalSigns(
        visitId,
        mapVitalSignsToApi(vitalSigns),
      ).catch((error: any) => {
        console.error(
          "VITAL SIGNS AUTOSAVE FAILED:",
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
    JSON.stringify(vitalSigns),
  ]);
}