import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MyClinic } from "@/types/clinic";

const CLINIC_ORDER_STORAGE_KEY =
  "@cliniqara/clinic-order";

interface ClinicStore {
  clinics: MyClinic[];
  currentClinic: MyClinic | null;
  currentClinicId: string | null;

  setClinics: (clinics: MyClinic[]) => void;
  setCurrentClinic: (clinic: MyClinic) => void;
  setCurrentClinicById: (clinicId: string) => void;

  reorderClinics: (
    fromIndex: number,
    toIndex: number,
  ) => void;

  moveClinicUp: (index: number) => void;
  moveClinicDown: (index: number) => void;

  clearClinics: () => void;
}

const applySavedOrder = (
  clinics: MyClinic[],
  savedOrder: string[],
) => {
  if (!savedOrder.length) {
    return clinics;
  }

  const orderMap = new Map(
    savedOrder.map((id, index) => [id, index]),
  );

  return [...clinics].sort((a, b) => {
    const aIndex = orderMap.get(a.clinic.id);
    const bIndex = orderMap.get(b.clinic.id);

    // Existing saved clinics come first.
    if (
      aIndex !== undefined &&
      bIndex !== undefined
    ) {
      return aIndex - bIndex;
    }

    // Saved clinics before new clinics.
    if (aIndex !== undefined) {
      return -1;
    }

    if (bIndex !== undefined) {
      return 1;
    }

    // Keep backend order for completely new clinics.
    return 0;
  });
};

const saveClinicOrder = async (
  clinics: MyClinic[],
) => {
  try {
    const order = clinics.map(
      (item) => item.clinic.id,
    );

    await AsyncStorage.setItem(
      CLINIC_ORDER_STORAGE_KEY,
      JSON.stringify(order),
    );
  } catch (error) {
    console.warn(
      "Failed to save clinic order:",
      error,
    );
  }
};

export const useClinicStore =
  create<ClinicStore>((set, get) => ({
    clinics: [],
    currentClinic: null,
    currentClinicId: null,

    setClinics: (incomingClinics) => {
      const currentClinicId =
        get().currentClinicId;

      AsyncStorage.getItem(
        CLINIC_ORDER_STORAGE_KEY,
      )
        .then((storedOrder) => {
          let orderedClinics =
            incomingClinics;

          if (storedOrder) {
            try {
              const savedOrder =
                JSON.parse(storedOrder);

              if (Array.isArray(savedOrder)) {
                orderedClinics =
                  applySavedOrder(
                    incomingClinics,
                    savedOrder,
                  );
              }
            } catch {
              // Ignore invalid saved order.
            }
          }

          const selectedClinic =
            currentClinicId
              ? orderedClinics.find(
                  (item) =>
                    item.clinic.id === currentClinicId,
                ) ?? null
              : null;

          set({
            clinics: orderedClinics,
            currentClinic: selectedClinic,
            currentClinicId:
              selectedClinic?.clinic.id ?? null,
          });
        })
        .catch(() => {
          const selectedClinic =
            currentClinicId
              ? incomingClinics.find(
                  (item) =>
                    item.clinic.id === currentClinicId,
                ) ?? null
              : null;

          set({
            clinics: incomingClinics,
            currentClinic: selectedClinic,
            currentClinicId:
              selectedClinic?.clinic.id ?? null,
          });
        });
    },

    setCurrentClinic: (clinic) =>
      set((state) => ({
        currentClinic: clinic,
        currentClinicId: clinic.clinic.id,
        clinics: state.clinics.map((item) =>
          item.clinic.id === clinic.clinic.id
            ? clinic
            : item,
        ),
      })),

    setCurrentClinicById: (clinicId) =>
      set((state) => {
        const clinic =
          state.clinics.find(
            (item) =>
              item.clinic.id === clinicId,
          ) ?? null;

        return {
          currentClinic: clinic,
          currentClinicId:
            clinic?.clinic.id ?? null,
        };
      }),

    reorderClinics: (
      fromIndex,
      toIndex,
    ) => {
      const currentClinics =
        get().clinics;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= currentClinics.length ||
        toIndex >= currentClinics.length ||
        fromIndex === toIndex
      ) {
        return;
      }

      const reordered = [
        ...currentClinics,
      ];

      const [movedClinic] =
        reordered.splice(fromIndex, 1);

      reordered.splice(
        toIndex,
        0,
        movedClinic,
      );

      set({
        clinics: reordered,
      });

      void saveClinicOrder(reordered);
    },

    moveClinicUp: (index) => {
      if (index <= 0) {
        return;
      }

      get().reorderClinics(
        index,
        index - 1,
      );
    },

    moveClinicDown: (index) => {
      const clinics =
        get().clinics;

      if (
        index < 0 ||
        index >= clinics.length - 1
      ) {
        return;
      }

      get().reorderClinics(
        index,
        index + 1,
      );
    },

    clearClinics: () => {
      set({
        clinics: [],
        currentClinic: null,
        currentClinicId: null,
      });
    },
  }));