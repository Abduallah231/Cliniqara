export type VisitStatus =
  | "Waiting"
  | "In Progress"
  | "Completed";

export type VisitSummary = {
  id: string;

  patientId: string;

  date: string;

  status: VisitStatus;

  chiefComplaint: string;
};