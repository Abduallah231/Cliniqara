import { create } from "zustand";
import type { Patient } from "@/types/patient";

interface PatientStore {
  patients: Patient[];
  currentPatient: Patient | null;

  loading: boolean;
  error: string | null;

  setPatients: (patients: Patient[]) => void;
  setCurrentPatient: (patient: Patient | null) => void;
  setCurrentPatientById: (patientId: string) => void;

  addPatient: (patient: Patient) => void;
  updatePatient: (
    patientId: string,
    updates: Partial<Patient>,
  ) => void;
  removePatient: (patientId: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  clearPatients: () => void;
}

export const usePatientStore =
  create<PatientStore>((set) => ({
    patients: [],
    currentPatient: null,

    loading: false,
    error: null,

    setPatients: (patients) =>
      set({
        patients,
        currentPatient: null,
        error: null,
      }),

    setCurrentPatient: (patient) =>
      set({
        currentPatient: patient,
      }),

    setCurrentPatientById: (patientId) =>
      set((state) => ({
        currentPatient:
          state.patients.find(
            (patient) => patient.id === patientId,
          ) ?? null,
      })),

    addPatient: (patient) =>
      set((state) => ({
        patients: [
          patient,
          ...state.patients,
        ],
      })),

    updatePatient: (
      patientId,
      updates,
    ) =>
      set((state) => ({
        patients: state.patients.map(
          (patient) =>
            patient.id === patientId
              ? {
                  ...patient,
                  ...updates,
                }
              : patient,
        ),

        currentPatient:
          state.currentPatient?.id === patientId
            ? {
                ...state.currentPatient,
                ...updates,
              }
            : state.currentPatient,
      })),

    removePatient: (patientId) =>
      set((state) => ({
        patients: state.patients.filter(
          (patient) =>
            patient.id !== patientId,
        ),

        currentPatient:
          state.currentPatient?.id === patientId
            ? null
            : state.currentPatient,
      })),

    setLoading: (loading) =>
      set({
        loading,
      }),

    setError: (error) =>
      set({
        error,
      }),

    clearPatients: () =>
      set({
        patients: [],
        currentPatient: null,
        loading: false,
        error: null,
      }),
  }));