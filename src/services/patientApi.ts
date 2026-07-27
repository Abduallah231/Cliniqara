import { api } from "./api";

export async function createPatient(body: any) {
  const { data } = await api.post("/patients", body);
  return data;
}

export async function searchPatients(search: string) {
  const { data } = await api.get("/patients", {
    params: { search },
  });

  return data;
}

export async function getPatient(id: string) {
  const { data } = await api.get(`/patients/${id}`);
  return data;
}