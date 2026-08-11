import { useClinicStore } from "@/store/clinicStore";
import type {
  CreatePatientInput,
  Patient,
  UpdatePatientInput,
} from "@/types/patient";
import { api } from "./api";

function getClinicId(): string {
  const clinicId =
    useClinicStore.getState().currentClinic?.clinic.id;

  if (!clinicId) {
    throw new Error("No active clinic selected");
  }

  return clinicId;
}

function clinicHeaders() {
  return {
    "X-Clinic-Id": getClinicId(),
  };
}

export async function getPatients(): Promise<Patient[]> {
  const { data } = await api.get("/patients", {
    headers: clinicHeaders(),
  });

  return data;
}

export async function getPatient(
  patientId: string,
): Promise<Patient> {
  const { data } = await api.get(
    `/patients/${patientId}`,
    {
      headers: clinicHeaders(),
    },
  );

  return data;
}

export async function searchPatients(
  query: string,
): Promise<Patient[]> {
  const { data } = await api.get(
    "/patients/search",
    {
      params: {
        q: query.trim(),
      },
      headers: clinicHeaders(),
    },
  );

  return data;
}

export async function createPatient(
  dto: CreatePatientInput,
): Promise<Patient> {
  const { data } = await api.post(
    "/patients",
    dto,
    {
      headers: clinicHeaders(),
    },
  );

  return data;
}

export async function updatePatient(
  patientId: string,
  dto: UpdatePatientInput,
): Promise<Patient> {
  const { data } = await api.patch(
    `/patients/${patientId}`,
    dto,
    {
      headers: clinicHeaders(),
    },
  );

  return data;
}