import { api } from "./api";

export async function getChiefComplaints(search?: string) {
  const { data } = await api.get("/chief-complaints", {
    params: { search },
  });

  return data;
}

export async function getChiefComplaintTemplate(id: string) {
  const { data } = await api.get(
    `/chief-complaints/${id}/template`
  );

  return data;
}