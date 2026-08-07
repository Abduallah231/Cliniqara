import { api } from "./api";
import { useDoctorStore } from "@/store/doctorStore";

export async function getDoctorProfile() {
  const { data } = await api.get("/doctor/profile");
  return data;
}

export async function updateDoctorProfile(
  body: {
    fullName: string;
    phone: string;
    specialty?: string;
    professionalTitle?: string;
  }
) {
  const { data } = await api.put(
    "/doctor/profile",
    body,
  );

  useDoctorStore
    .getState()
    .updateDoctor(data);

  return data;
}

export async function upgradeDoctor(body: {
  medicalLicenseNumber: string;
  medicalLicenseImage: string;
}) {
  const { data } = await api.post(
    "/doctor/upgrade",
    body,
  );

  useDoctorStore
    .getState()
    .updateDoctor({
        doctorLevel: data.doctorLevel,
        verificationStatus:
        data.verificationStatus,
        medicalLicenseNumber:
        data.medicalLicenseNumber,
        medicalLicenseImage:
        data.medicalLicenseImage,
    });

  return data;
}

export async function loadDoctorProfile() {
  const doctor = await getDoctorProfile();

  useDoctorStore
    .getState()
    .setDoctor(doctor);

  return doctor;
}