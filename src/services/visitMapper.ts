import {
  VisitForm,
  createEmptyVisitForm,
} from "@/models/VisitForm";

type BackendVisit = any;

/**
 * Converts the visit returned by the backend
 * into the frontend VisitForm structure.
 *
 * Important:
 * - Does not change the store structure.
 * - Does not affect autosave.
 * - Keeps missing backend sections as empty frontend sections.
 */
export function mapBackendVisitToVisitForm(
  backendVisit: BackendVisit,
): VisitForm {
  const emptyVisit =
    createEmptyVisitForm();

  /*
   * Backend returns the saved chief complaint
   * directly as:
   *
   * backendVisit.chiefComplaint
   *
   * It is NOT inside:
   *
   * backendVisit.history.chiefComplaint
   */
  const backendChiefComplaint =
    backendVisit.chiefComplaint;

  const backendComplaintMaster =
    backendChiefComplaint?.chiefComplaint;

  return {
    ...emptyVisit,

    metadata: {
      id:
        backendVisit.id ??
        "",
      patientId:
        backendVisit.patientId ??
        "",
      clinicId:
        backendVisit.clinicId ??
        "",
      doctorId:
        backendVisit.doctorId ??
        "",
      visitNumber:
        backendVisit.visitCode ??
        "",
      status:
        backendVisit.visitStatus ??
        "",
    },

    patient: {
      ...emptyVisit.patient,
      ...(backendVisit.patient ??
        {}),
    },

    history: {
      ...emptyVisit.history,
      ...(backendVisit.history ??
        {}),

      /*
       * Hydrate the saved Chief Complaint
       * directly from the Visit response.
       *
       * This allows ChiefComplaint.tsx to know
       * the selected complaint immediately after
       * opening the visit.
       */
      chiefComplaint: {
        ...emptyVisit.history
          .chiefComplaint,

        /*
         * Support both the actual backend
         * relation structure and the previous
         * frontend-compatible structure.
         */
        ...(backendChiefComplaint
          ? {
              complaintId:
                backendChiefComplaint.chiefComplaintId ??
                backendComplaintMaster?.id ??
                "",

              complaintName:
                backendComplaintMaster?.name ??
                backendChiefComplaint.chiefComplaintName ??
                "",

              durationValue:
                backendChiefComplaint.durationValue ??
                undefined,

              durationUnit:
                backendChiefComplaint.durationUnit ??
                undefined,
            }
          : {}),

        /*
         * Keep compatibility in case another
         * backend mapper/response already provides
         * history.chiefComplaint.
         */
        ...(backendVisit.history
          ?.chiefComplaint ?? {}),
      },
    },

    examination: {
      ...emptyVisit.examination,
      ...(backendVisit.examination ??
        {}),
    },

    assessment: {
      ...emptyVisit.assessment,
      ...(backendVisit.assessment ??
        {}),
    },

    clinic: {
      ...emptyVisit.clinic,
      ...(backendVisit.clinic ??
        {}),
    },
  };
}