import { VisitForm, createEmptyVisitForm } from "@/models/VisitForm";

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
  const emptyVisit = createEmptyVisitForm();

  return {
    ...emptyVisit,

    metadata: {
      id: backendVisit.id ?? "",
      patientId: backendVisit.patientId ?? "",
      clinicId: backendVisit.clinicId ?? "",
      doctorId: backendVisit.doctorId ?? "",
      visitNumber: backendVisit.visitCode ?? "",
      status: backendVisit.visitStatus ?? "",
    },

    patient: {
      ...emptyVisit.patient,
      ...(backendVisit.patient ?? {}),
    },

    history: {
        ...emptyVisit.history,
        ...(backendVisit.history ?? {}),

        chiefComplaint: {
            ...emptyVisit.history.chiefComplaint,
            ...(backendVisit.history?.chiefComplaint ?? {}),

            complaintId:
            backendVisit.history?.chiefComplaint?.chiefComplaintId ??
            backendVisit.history?.chiefComplaint?.complaintId ??
            "",

            complaintName:
            backendVisit.history?.chiefComplaint?.chiefComplaintName ??
            backendVisit.history?.chiefComplaint?.complaintName ??
            "",

            durationValue:
            backendVisit.history?.chiefComplaint?.durationValue ??
            "",

            durationUnit:
            backendVisit.history?.chiefComplaint?.durationUnit ??
            "",
        },
    },

    examination: {
      ...emptyVisit.examination,
      ...(backendVisit.examination ?? {}),
    },

    assessment: {
      ...emptyVisit.assessment,
      ...(backendVisit.assessment ?? {}),
    },

    clinic: {
      ...emptyVisit.clinic,
      ...(backendVisit.clinic ?? {}),
    },
  };
}