import { create } from "zustand";
import type { MyClinic } from "@/types/clinic";

interface ClinicStore {
  clinics: MyClinic[];
  currentClinic: MyClinic | null;

  setClinics: (clinics: MyClinic[]) => void;
  setCurrentClinic: (clinic: MyClinic) => void;
  setCurrentClinicById: (clinicId: string) => void;
  clearClinics: () => void;
}

export const useClinicStore = create<ClinicStore>(
  (set) => ({
    clinics: [],
    currentClinic: null,

    setClinics: (clinics) =>
      set((state) => ({
        clinics,
        currentClinic:
          clinics.find(
            (item) =>
              item.clinic.id ===
              state.currentClinic?.clinic.id,
          ) ??
          clinics[0] ??
          null,
      })),

    setCurrentClinic: (clinic) =>
      set((state) => ({
        currentClinic: clinic,
        clinics: state.clinics.map((item) =>
          item.clinic.id === clinic.clinic.id
            ? clinic
            : item,
        ),
      })),

    setCurrentClinicById: (clinicId) =>
      set((state) => ({
        currentClinic:
          state.clinics.find(
            (item) =>
              item.clinic.id === clinicId,
          ) ?? null,
      })),

    clearClinics: () =>
      set({
        clinics: [],
        currentClinic: null,
      }),
  }),
);