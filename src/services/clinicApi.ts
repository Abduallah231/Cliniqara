import { api } from "./api";
import { useClinicStore } from "@/store/clinicStore";

export async function getMyClinic() {
  const { data } = await api.get("/clinic/my");
  return data;
}

export async function loadClinic() {
  try {
    const clinic = await getMyClinic();

    useClinicStore
      .getState()
      .setClinic(clinic);

    return clinic;
  } catch {
    return null;
  }
}