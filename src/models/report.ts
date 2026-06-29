export type ReportType =
  | "Summary"
  | "Full";

export type Report = {
  id: string;

  patientId: string;

  createdAt: string;

  type: ReportType;
};