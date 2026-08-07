import { create } from "zustand";

export interface DoctorProfile {
  id: string;

  userCode: string;

  fullName: string;

  email: string;

  phone: string;

  nationalId: string | null;

  medicalLicenseNumber: string | null;

  nationalIdImage: string | null;

  medicalLicenseImage: string | null;

  specialty: string | null;

  professionalTitle: string | null;

  accountType: "DOCTOR" | "RECEPTION";

  doctorLevel: "INTERN" | "DOCTOR";

  verificationStatus:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
}

interface DoctorStore {
  doctor: DoctorProfile | null;

  loading: boolean;

  setDoctor: (
    doctor: DoctorProfile
  ) => void;

  updateDoctor: (
    doctor: Partial<DoctorProfile>
    ) => void;

  clearDoctor: () => void;

  setLoading: (
    loading: boolean
  ) => void;
}

export const useDoctorStore =
  create<DoctorStore>((set) => ({
    doctor: null,

    loading: false,

    setDoctor: (doctor) =>
      set({ doctor }),

    updateDoctor: (doctor) =>
        set((state) => ({
            doctor: state.doctor
            ? {
                ...state.doctor,
                ...doctor,
                }
            : null,
        })),

    clearDoctor: () =>
        set({
            doctor: null,
            loading: false,
        }),

    setLoading: (loading) =>
      set({ loading }),
  }));