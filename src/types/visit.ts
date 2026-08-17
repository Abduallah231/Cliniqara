export type VisitStatus =
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Visit {
  id: string;
  visitCode: string;
  secureCode: string;

  patientId: string;
  clinicId: string;

  createdById: string;
  doctorId: string;

  visitStatus: VisitStatus;

  visitDate: string;

  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;

  cancellationReason?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateWaitingVisitInput {
  patientId: string;
  clinicId: string;
  doctorId?: string;
}

export interface StartVisitInput {
  visitId: string;
}

export interface CompleteVisitInput {
  visitId: string;
}

export interface CancelVisitInput {
  visitId: string;
  reason: string;
}

export interface ChangeDoctorInput {
  visitId: string;
  doctorId: string;
}

export interface GetVisitInput {
  visitId: string;
}