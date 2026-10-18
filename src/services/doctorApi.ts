import { useDoctorStore } from "@/store/doctorStore";
import { getLocalRecord, putLocalRecord } from "./localDatabase";

export async function getDoctorProfile() {
  const cached = await getLocalRecord<Record<string, unknown>>("auth_user", "current");
  if (!cached) throw new Error("Local account profile is unavailable");
  return cached.value;
}

export async function updateDoctorProfile(
  body: {
    fullName: string;
    phone: string;
    specialty?: string;
    professionalTitle?: string;
  }
) {
  const current = useDoctorStore.getState().doctor;
  if (!current) throw new Error("Local account profile is unavailable");
  const data = { ...current, ...body };
  await putLocalRecord({ collection: "offline_profile", id: "current", value: data });
  await putLocalRecord({ collection: "auth_user", id: "current", value: data });
  useDoctorStore
    .getState()
    .updateDoctor(data);

  return data;
}

export async function loadDoctorProfile() {
  const doctor = await getDoctorProfile();

  useDoctorStore
    .getState()
    .setDoctor(doctor);

  return doctor;
}
