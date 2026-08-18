import type {
  CancelVisitInput,
  ChangeDoctorInput,
  CompleteVisitInput,
  Visit
} from "@/types/visit";
import { api } from "./api";

export async function createWaitingVisit(
  patientId: string,
  doctorId?: string,
) {
  const { data } = await api.post(
    "/visits/waiting",
    {
      patientId,
      ...(doctorId
        ? { doctorId }
        : {}),
    },
  );

  return data;
}

export async function getWaitingVisits(
  clinicId: string,
): Promise<Visit[]> {
  const { data } = await api.get(
    "/visits/waiting",
    {
      params: {
        clinicId,
      },
    },
  );

  return data;
}

export async function getTodayVisitCount(): Promise<number> {
  const { data } = await api.get(
    "/visits/today/count",
  );

  return data.count;
}

export async function startVisit(
  visitId: string,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/start",
    {
      visitId,
    },
  );

  return data;
}

export async function completeVisit(
  dto: CompleteVisitInput,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/complete",
    dto,
  );

  return data;
}

export async function cancelVisit(
  dto: CancelVisitInput,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/cancel",
    dto,
  );

  return data;
}

export async function changeDoctor(
  dto: ChangeDoctorInput,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/change-doctor",
    dto,
  );

  return data;
}

export async function getVisit(
  visitId: string,
): Promise<Visit> {
  const { data } = await api.post(
    "/visits/details",
    {
      visitId,
    },
  );

  return data;
}

export async function saveChiefComplaint(
  visitId: string,
  chiefComplaintId: string,
  answers: Record<string, unknown>,
) {
  const { data } = await api.post(
    `/visits/${visitId}/chief-complaint`,
    {
      chiefComplaintId,
      answers,
    },
  );

  return data;
}