import { api } from "./api";

export async function saveChiefComplaint(
  visitId: string,
  chiefComplaintId: string,
  answers: Record<string, any>,
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

export async function createWaitingVisit(
  patientId: string,
  clinicId: string,
) {
  const { data } = await api.post(
    "/visits/waiting",
    {
      patientId,
      clinicId,
    },
  );

  return data;
}

export async function getWaitingVisits(
  clinicId: string,
) {
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

export async function startVisit(
  visitId: string,
) {
  const { data } = await api.post(
    "/visits/start",
    {
      visitId,
    },
  );

  return data;
}

export async function getVisit(
  visitId: string,
) {
  const { data } = await api.get(
    `/visits/${visitId}`,
  );

  return data;
}