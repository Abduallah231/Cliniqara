import { api } from "./api";

export type ChiefComplaintOption = {
  id: string;
  code?: string | null;
  name: string;
  usageCount?: number;
};

export async function getChiefComplaints(
  search?: string,
) {
  const { data } = await api.get(
    "/chief-complaints",
    {
      params: { search },
    },
  );

  return data;
}

export async function getClinicChiefComplaints(
  clinicId: string,
): Promise<ChiefComplaintOption[]> {
  const { data } = await api.get<
    ChiefComplaintOption[]
  >(
    `/chief-complaints/clinic/${clinicId}`,
  );

  return Array.isArray(data)
    ? data
    : [];
}

export async function getChiefComplaintTemplate(
  id: string,
) {
  const { data } = await api.get(
    `/chief-complaints/${id}/template`,
  );

  return data;
}