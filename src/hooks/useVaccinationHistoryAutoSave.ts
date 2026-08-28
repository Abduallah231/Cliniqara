import { useEffect, useRef } from "react";
import { saveVaccinationHistory } from "@/services/visitApi";

interface Props {
  patientId?: string;
  vaccinationHistory: Record<string, any>;
  isHydrating?: boolean;
}

export default function useVaccinationHistoryAutoSave({
  patientId,
  vaccinationHistory,
  isHydrating = false,
}: Props) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!patientId) {
      return;
    }

    /*
     * Do not save the initial state.
     */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    /*
     * Do not autosave while loading
     * vaccination history from backend.
     */
    if (isHydrating) {
      return;
    }

    const status =
      vaccinationHistory.vaccinationStatus;

    /*
    * Do not save until vaccination status exists.
    * This prevents autosave from sending an incomplete
    * initial/intermediate vaccination history state.
    */
    if (!status) {
      return;
    }

    /*
     * Do not save an incomplete
     * UNVACCINATED state.
     *
     * Backend requires unvaccinatedReason
     * when vaccinationStatus = UNVACCINATED.
     */
    if (
      status === "UNVACCINATED" &&
      !vaccinationHistory.unvaccinatedReason
    ) {
      return;
    }

    /*
    * Do not save OTHER unvaccinated reason
    * until the user provides the required details.
    */
    if (
      status === "UNVACCINATED" &&
      vaccinationHistory.unvaccinatedReason === "OTHER" &&
      !vaccinationHistory.unvaccinatedOtherDetails?.trim()
    ) {
      return;
    }

    /*
     * Do not save an incomplete
     * PARTIALLY_VACCINATED state.
     *
     * Backend requires partialReason.
     */
    if (
      status === "PARTIALLY_VACCINATED" &&
      !vaccinationHistory.partialReason
    ) {
      return;
    }

    /*
    * Do not save OTHER partial vaccination reason
    * until the user provides the required details.
    */
    if (
      status === "PARTIALLY_VACCINATED" &&
      vaccinationHistory.partialReason === "OTHER" &&
      !vaccinationHistory.partialOtherDetails?.trim()
    ) {
      return;
    }

    if (
      vaccinationHistory.previousReaction === true &&
      !vaccinationHistory.reactionDetails?.trim()
    ) {
      return;
    }

    const timer = setTimeout(() => {
      saveVaccinationHistory(patientId, {
        vaccinationStatus:
          vaccinationHistory.vaccinationStatus ??
          undefined,

        missedVaccines:
          vaccinationHistory.missedVaccines ?? [],

        partialReason:
          vaccinationHistory.partialReason ??
          undefined,

        partialOtherDetails:
          vaccinationHistory.partialOtherDetails ??
          undefined,

        unvaccinatedReason:
          vaccinationHistory.unvaccinatedReason ??
          undefined,

        unvaccinatedOtherDetails:
          vaccinationHistory.unvaccinatedOtherDetails ??
          undefined,

        previousReaction:
          vaccinationHistory.previousReaction ??
          undefined,

        reactionSeverity:
          vaccinationHistory.reactionSeverity ??
          undefined,

        reactionDetails:
          vaccinationHistory.reactionDetails ??
          undefined,
      }).catch((error: any) => {
        const message =
            error?.response?.data?.message;

        /*
        * This is an expected intermediate state.
        * A partially vaccinated patient may not have
        * missedVaccines selected yet.
        *
        * Do not treat this as a user error.
        * The next vaccinationHistory change will trigger
        * autosave again.
        */
        if (
            message ===
            "At least one missed vaccine is required for a partially vaccinated patient."
        ) {
            return;
        }

        /*
        * Keep all other autosave errors visible in console.
        */
        console.error(
            "VACCINATION HISTORY AUTOSAVE FAILED:",
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
    JSON.stringify(vaccinationHistory),
  ]);
}