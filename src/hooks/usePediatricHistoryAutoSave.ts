import { useEffect, useRef } from "react";
import {
  getPediatricHistory,
  savePediatricHistory,
} from "@/services/visitApi";

interface Props {
  visitId?: string;
  pediatricHistory: Record<string, any>;
}

/**
 * Normalize pediatric history coming from the backend
 * before it reaches Zustand.
 *
 * The backend may return:
 * - null for optional fields
 * - arrays
 * - booleans
 * - numbers
 * - strings
 *
 * We keep the same UI-oriented shape used by
 * PediatricHistory.
 */
export function mapPediatricHistoryFromBackend(
  data: Record<string, any> | null | undefined,
): Record<string, any> {
  if (!data) {
    return {};
  }

  return {
    antenatalCare:
      data.antenatalCare ?? undefined,

    antenatalCareNotes:
      data.antenatalCareNotes ?? "",

    maternalIllnesses:
      Array.isArray(data.maternalIllnesses)
        ? data.maternalIllnesses
        : [],

    maternalIllnessOther:
      data.maternalIllnessOther ?? "",

    pregnancyComplications:
      Array.isArray(
        data.pregnancyComplications,
      )
        ? data.pregnancyComplications
        : [],

    pregnancyComplicationsOther:
      data.pregnancyComplicationsOther ?? "",

    drugIntake:
      data.drugIntake ?? undefined,

    drugIntakeDetails:
      data.drugIntakeDetails ?? "",

    smokingExposure:
      data.smokingExposure ?? undefined,

    alcoholExposure:
      data.alcoholExposure ?? undefined,

    alcoholExposureDetails:
      data.alcoholExposureDetails ?? "",

    gestationalAge:
      data.gestationalAge ?? undefined,

    gestationalWeeks:
      data.gestationalWeeks ?? undefined,

    deliveryMode:
      data.deliveryMode ?? undefined,

    birthWeight:
      data.birthWeight ?? undefined,

    nicuAdmission:
      data.nicuAdmission ?? undefined,

    nicuReason:
      data.nicuReason ?? "",

    nicuDuration:
      data.nicuDuration ?? undefined,

    birthComplications:
      Array.isArray(
        data.birthComplications,
      )
        ? data.birthComplications
        : [],

    birthComplicationDetails:
      data.birthComplicationDetails ?? "",

    neonatalJaundice:
      data.neonatalJaundice ?? undefined,

    phototherapy:
      data.phototherapy ?? undefined,

    exchangeTransfusion:
      data.exchangeTransfusion ?? undefined,

    neonatalSeizures:
      data.neonatalSeizures ?? undefined,

    feedingTypes:
      Array.isArray(data.feedingTypes)
        ? data.feedingTypes
        : [],

    development:
      data.development ?? undefined,

    delayType:
      data.delayType ?? undefined,

    delayDetails:
      data.delayDetails ?? "",

    attendsSchool:
      data.attendsSchool ?? undefined,

    grade:
      data.grade ?? "",

    schoolPerformance:
      data.schoolPerformance ?? undefined,

    schoolPerformanceDetails:
      data.schoolPerformanceDetails ?? "",

    schoolAttendance:
      data.schoolAttendance ?? undefined,

    schoolAttendanceReason:
      data.schoolAttendanceReason ?? "",
  };
}

export default function usePediatricHistoryAutoSave({
  visitId,
  pediatricHistory,
}: Props) {
  const isFirstRender =
    useRef(true);

  const hydratedSignature =
    useRef<string | null>(null);

  useEffect(() => {
    if (!visitId) {
      return;
    }

    const signature =
      JSON.stringify(
        pediatricHistory,
      );

    /*
     * Do not save the initial state.
     *
     * The first render represents the local
     * state before backend hydration.
     */
    if (isFirstRender.current) {
      isFirstRender.current =
        false;

      return;
    }

    /*
     * If this state is the exact state that was
     * loaded from the backend, do not send it back.
     */
    if (
      hydratedSignature.current ===
      signature
    ) {
      hydratedSignature.current =
        null;

      return;
    }

    const timer =
      setTimeout(() => {
        savePediatricHistory(
          visitId,
          pediatricHistory,
        ).catch((error: any) => {
          console.error(
            "PEDIATRIC HISTORY AUTOSAVE FAILED:",
            error?.response?.data ??
              error,
          );
        });
      }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    JSON.stringify(pediatricHistory),
  ]);

  /*
   * Expose a small helper to the component so it
   * can mark backend-loaded data as hydrated.
   *
   * This does not trigger a render.
   */
  const markHydrated = (
    pediatricHistory: Record<string, any>,
  ) => {
    hydratedSignature.current =
      JSON.stringify(
        pediatricHistory,
      );
  };

  return {
    markHydrated,
  };
}