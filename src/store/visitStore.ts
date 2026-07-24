import { create } from "zustand";
import {
  VisitForm,
  createEmptyVisitForm,
} from "@/models/VisitForm";
import { DynamicValue } from "@/models/VisitForm/assessment";
import {
  PediatricHistory,
  Medication,
  Allergy,
  Hospitalization,
  Operation,
  BloodTransfusion,
  MajorTrauma,
  ICUAdmission,
  FamilyDisease,
} from "@/models/VisitForm/history";
import {
  VitalSigns,
  GeneralInspection,
  RegionalExamination,
} from "@/models/VisitForm/examination";
import {
  Diagnosis,
  Investigation,
  Procedure,
  Referral,
  PrescriptionMedication,
} from "@/models/VisitForm/assessment";
interface VisitStore {
  visit: VisitForm;

  setVisit: (visit: VisitForm) => void;

  updateVisit: (
    updates: Partial<VisitForm>
  ) => void;

  updateAnalysisField: (
    fieldId: string,
    fieldLabel: string,
    value: DynamicValue,
    unit?: string
  ) => void;

  updateRelatedSystemField: (
    fieldId: string,
    fieldLabel: string,
    value: DynamicValue,
    unit?: string
  ) => void;

  updateSystematicReviewField: (
    fieldId: string,
    fieldLabel: string,
    value: DynamicValue,
    unit?: string
  ) => void;

  updatePediatricField: (
  section: keyof PediatricHistory,
  fieldId: string,
  fieldLabel: string,
  value: DynamicValue,
  unit?: string
) => void;

updateVaccinationField(
  fieldId: string,
  fieldLabel: string,
  value: DynamicValue,
  unit?: string
): void;

updateMenstrualField(
  fieldId: string,
  fieldLabel: string,
  value: DynamicValue,
  unit?: string
): void;

updateSocialField(
  fieldId: string,
  fieldLabel: string,
  value: DynamicValue,
  unit?: string
): void;

updatePastHistoryField(
  fieldId: string,
  fieldLabel: string,
  value: DynamicValue,
  unit?: string
): void;

// ======================================================
// Past History Events
// ======================================================

addHospitalization: (
  hospitalization: Hospitalization
) => void;

updateHospitalization: (
  id: string,
  updates: Partial<Hospitalization>
) => void;

removeHospitalization: (
  id: string
) => void;

addOperation: (
  operation: Operation
) => void;

updateOperation: (
  id: string,
  updates: Partial<Operation>
) => void;

removeOperation: (
  id: string
) => void;

addBloodTransfusion: (
  transfusion: BloodTransfusion
) => void;

updateBloodTransfusion: (
  id: string,
  updates: Partial<BloodTransfusion>
) => void;

removeBloodTransfusion: (
  id: string
) => void;

addMajorTrauma: (
  trauma: MajorTrauma
) => void;

updateMajorTrauma: (
  id: string,
  updates: Partial<MajorTrauma>
) => void;

removeMajorTrauma: (
  id: string
) => void;

addICUAdmission: (
  admission: ICUAdmission
) => void;

updateICUAdmission: (
  id: string,
  updates: Partial<ICUAdmission>
) => void;

removeICUAdmission: (
  id: string
) => void;


// ======================================================
// Family History
// ======================================================


addFamilyDisease: (
  disease: FamilyDisease
) => void;

updateFamilyDisease: (
  id: string,
  updates: Partial<FamilyDisease>
) => void;

removeFamilyDisease: (
  id: string
) => void;

// ======================================================
// Medication History
// ======================================================

addMedication: (medication: Medication) => void;

updateMedication: (
  id: string,
  updates: Partial<Medication>
) => void;

removeMedication: (id: string) => void;

updateCompliance: (
  value: string
) => void;

updateSelfMedication: (
  value: string
) => void;

updateSelfMedicationDetails: (
  value: string
) => void;

updateSupplements: (
  value: string
) => void;

updateSupplementDetails: (
  value: string
) => void;

// ======================================================
// Allergy History
// ======================================================

updateHasAllergy: (
    value: string
) => void;

addAllergy: (
    allergy: Allergy
) => void;

updateAllergy: (
    id: string,
    allergy: Omit<Allergy, "id">
) => void;

removeAllergy: (
    id: string
) => void;

// ======================================================
// Vital Signs
// ======================================================

updateVitalSigns: (
  updates: Partial<VitalSigns>
) => void;

updateBloodPressure: (
  systolic: string,
  diastolic: string
) => void;

// ======================================================
// General Inspection
// ======================================================

updateGeneralInspection: (
  updates: Partial<GeneralInspection>
) => void;

toggleGeneralFinding: (
  finding: string
) => void;

toggleEdemaLocation: (
  location: string
) => void;

updateRegionalSection: (
  section: keyof RegionalExamination,
  updates: Partial<
    RegionalExamination[keyof RegionalExamination]
  >
) => void;

toggleRegionalFinding: (
  section: keyof RegionalExamination,
  finding: string
) => void;

updateSelectedSystem: (
  systemId: string
) => void;

updateSystemExaminationField: (
  systemId: string,
  fieldId: string,
  fieldLabel: string,
  value: DynamicValue,
  unit?: string
) => void;

// ======================================================
// Diagnosis
// ======================================================

updatePrimaryDiagnosis(
  diagnosis?: Diagnosis
): void;

clearPrimaryDiagnosis: () => void;

addDifferentialDiagnosis: (
  diagnosis: Diagnosis
) => void;

removeDifferentialDiagnosis(
  diagnosis: string
): void;

setAiSuggestedDiagnoses: (
  diagnoses: Diagnosis[]
) => void;

// ======================================================
// Investigations
// ======================================================

addRequestedInvestigation: (
  investigation: Investigation
) => void;

removeRequestedInvestigation(
  name: string
): void;

updateInvestigationStatus(
  name: string,
  status: Investigation["status"]
): void;

setAiSuggestedInvestigations: (
  investigations: Investigation[]
) => void;

// ======================================================
// Investigation Results
// ======================================================

updateInvestigationResult: (
  investigationId: string,
  fieldId: string,
  fieldLabel: string,
  value: DynamicValue,
  unit?: string
) => void;

removeInvestigationResult: (
  investigationId: string
) => void;

// ======================================================
// Procedures
// ======================================================

addProcedure: (
  procedure: Procedure
) => void;

updateProcedure: (
  index: number,
  details: string
) => void;

removeProcedure: (
  index: number
) => void;

// ======================================================
// Referrals
// ======================================================

addReferral: (
  referral: Referral
) => void;

updateReferral: (
  index: number,
  details: string
) => void;

removeReferral: (
  index: number
) => void;

// ======================================================
// Prescription
// ======================================================

addPrescriptionMedication: (
  medication: PrescriptionMedication
) => void;

updatePrescriptionMedication: (
  index: number,
  updates: Partial<PrescriptionMedication>
) => void;

removePrescriptionMedication: (
  index: number
) => void;

updatePrescriptionAdvice: (
  value: string
) => void;

updatePrescriptionNotes: (
  value: string
) => void;

updatePrescriptionFollowUp: (
  value: string
) => void;

  resetVisit: () => void;
}

export const useVisitStore =
  create<VisitStore>((set) => ({
    visit: createEmptyVisitForm(),

    setVisit: (visit) =>
      set({
        visit,
      }),

    updateVisit: (updates) =>
      set((state) => ({
        visit: {
          ...state.visit,
          ...updates,
        },
      })),

    updateAnalysisField: (
      fieldId,
      fieldLabel,
      value,
      unit
    ) =>
      set((state) => {
        const fields =
          state.visit.history.hpi.analysis.fields;

        const index = fields.findIndex(
          (field) =>
            field.fieldId === fieldId
        );

        let updatedFields;

        if (index >= 0) {
          updatedFields = [...fields];

          updatedFields[index] = {
            ...updatedFields[index],
            value,
            unit,
          };
        } else {
          updatedFields = [
            ...fields,
            {
              fieldId,
              fieldLabel,
              value,
              unit,
            },
          ];
        }

        return {
          visit: {
            ...state.visit,
            history: {
              ...state.visit.history,
              hpi: {
                ...state.visit.history.hpi,
                analysis: {
                  ...state.visit.history.hpi
                    .analysis,
                  fields: updatedFields,
                },
              },
            },
          },
        };
      }),

    updateRelatedSystemField: (
            fieldId,
            fieldLabel,
            value,
            unit
          ) =>
            set((state) => {
              const fields =
                state.visit.history.hpi
                  .relatedSystemSymptoms.fields;

              const index = fields.findIndex(
                (field) =>
                  field.fieldId === fieldId
              );

              let updatedFields;

              if (index >= 0) {
                updatedFields = [...fields];

                updatedFields[index] = {
                  ...updatedFields[index],
                  value,
                  unit,
                };
              } else {
                updatedFields = [
                  ...fields,
                  {
                    fieldId,
                    fieldLabel,
                    value,
                    unit,
                  },
                ];
              }

              return {
                visit: {
                  ...state.visit,
                  history: {
                    ...state.visit.history,
                    hpi: {
                      ...state.visit.history.hpi,
                      relatedSystemSymptoms: {
                        ...state.visit.history.hpi
                          .relatedSystemSymptoms,
                        fields: updatedFields,
                      },
                    },
                  },
                },
              };
            }),

    updateSystematicReviewField: (
              fieldId,
              fieldLabel,
              value,
              unit
            ) =>
              set((state) => {
                const fields =
                  state.visit.history.hpi.systematicReview.systems;

                const index = fields.findIndex(
                  (field) => field.fieldId === fieldId
                );

                let updatedFields;

                if (index >= 0) {
                  updatedFields = [...fields];
                  updatedFields[index] = {
                    ...updatedFields[index],
                    value,
                    unit,
                  };
                } else {
                  updatedFields = [
                    ...fields,
                    {
                      fieldId,
                      fieldLabel,
                      value,
                      unit,
                    },
                  ];
                }

                return {
                  visit: {
                    ...state.visit,
                    history: {
                      ...state.visit.history,
                      hpi: {
                        ...state.visit.history.hpi,
                        systematicReview: {
                          ...state.visit.history.hpi.systematicReview,
                          systems: updatedFields,
                        },
                      },
                    },
                  },
                };
              }),

    updatePediatricField: (
                section,
                fieldId,
                fieldLabel,
                value,
                unit
              ) =>
                set((state) => {
                  const history =
                    state.visit.history.pediatricHistory ??
                    {
                      prenatalHistory: [],
                      birthHistory: [],
                      neonatalHistory: [],
                      feedingHistory: [],
                      developmentHistory: [],
                      schoolHistory: [],
                    };

                  const fields = history[section];

                  const index = fields.findIndex(
                    (field) => field.fieldId === fieldId
                  );

                  let updatedFields;

                  if (index >= 0) {
                    updatedFields = [...fields];
                    updatedFields[index] = {
                      ...updatedFields[index],
                      value,
                      unit,
                    };
                  } else {
                    updatedFields = [
                      ...fields,
                      {
                        fieldId,
                        fieldLabel,
                        value,
                        unit,
                      },
                    ];
                  }

                  return {
                    visit: {
                      ...state.visit,
                      history: {
                        ...state.visit.history,
                        pediatricHistory: {
                          ...history,
                          [section]: updatedFields,
                        },
                      },
                    },
                  };
                }),

    updateVaccinationField: (
                  fieldId,
                  fieldLabel,
                  value,
                  unit
                ) =>
                  set((state) => {
                    const fields =
                      state.visit.history
                        .vaccinationHistory.fields;

                    const index = fields.findIndex(
                      (field) =>
                        field.fieldId === fieldId
                    );

                    let updatedFields;

                    if (index >= 0) {
                      updatedFields = [...fields];
                      updatedFields[index] = {
                        ...updatedFields[index],
                        value,
                        unit,
                      };
                    } else {
                      updatedFields = [
                        ...fields,
                        {
                          fieldId,
                          fieldLabel,
                          value,
                          unit,
                        },
                      ];
                    }

                    return {
                      visit: {
                        ...state.visit,
                        history: {
                          ...state.visit.history,
                          vaccinationHistory: {
                            fields: updatedFields,
                          },
                        },
                      },
                    };
                  }),

    updateMenstrualField: (
                    fieldId,
                    fieldLabel,
                    value,
                    unit
                  ) =>
                    set((state) => {
                      const fields =
                        state.visit.history
                          .menstrualHistory.fields;

                      const index = fields.findIndex(
                        (field) =>
                          field.fieldId === fieldId
                      );

                      let updatedFields;

                      if (index >= 0) {
                        updatedFields = [...fields];

                        updatedFields[index] = {
                          ...updatedFields[index],
                          value,
                          unit,
                        };
                      } else {
                        updatedFields = [
                          ...fields,
                          {
                            fieldId,
                            fieldLabel,
                            value,
                            unit,
                          },
                        ];
                      }

                      return {
                        visit: {
                          ...state.visit,
                          history: {
                            ...state.visit.history,
                            menstrualHistory: {
                              fields: updatedFields,
                            },
                          },
                        },
                      };
                    }),

    updateSocialField: (
      fieldId,
      fieldLabel,
      value,
      unit
    ) =>
      set((state) => {
        const fields =
          state.visit.history.socialHistory.fields;

        const index = fields.findIndex(
          (field) =>
            field.fieldId === fieldId
        );

        let updatedFields;

        if (index >= 0) {
          updatedFields = [...fields];

          updatedFields[index] = {
            ...updatedFields[index],
            value,
            unit,
          };
        } else {
          updatedFields = [
            ...fields,
            {
              fieldId,
              fieldLabel,
              value,
              unit,
            },
          ];
        }

        return {
          visit: {
            ...state.visit,
            history: {
              ...state.visit.history,
              socialHistory: {
                fields: updatedFields,
              },
            },
          },
        };
      }),

    updatePastHistoryField: (
      fieldId,
      fieldLabel,
      value,
      unit
    ) =>
      set((state) => {
        const fields =
          state.visit.history
            .pastHistory.fields;

        const index = fields.findIndex(
          (field) =>
            field.fieldId === fieldId
        );

        let updatedFields;

        if (index >= 0) {
          updatedFields = [...fields];

          updatedFields[index] = {
            ...updatedFields[index],
            value,
            unit,
          };
        } else {
          updatedFields = [
            ...fields,
            {
              fieldId,
              fieldLabel,
              value,
              unit,
            },
          ];
        }

        return {
          visit: {
            ...state.visit,
            history: {
              ...state.visit.history,
              pastHistory: {
                ...state.visit.history.pastHistory,
                fields: updatedFields,
              },
            },
          },
        };
      }),

      addHospitalization: (hospitalization) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          hospitalizations: [
            ...state.visit.history.pastHistory.hospitalizations,
            hospitalization,
          ],
        },
      },
    },
  })),

updateHospitalization: (id, updates) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          hospitalizations:
            state.visit.history.pastHistory.hospitalizations.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        },
      },
    },
  })),

removeHospitalization: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          hospitalizations:
            state.visit.history.pastHistory.hospitalizations.filter(
              (item) => item.id !== id
            ),
        },
      },
    },
  })),

  addOperation: (operation) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          operations: [
            ...state.visit.history.pastHistory.operations,
            operation,
          ],
        },
      },
    },
  })),

updateOperation: (id, updates) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          operations:
            state.visit.history.pastHistory.operations.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        },
      },
    },
  })),

removeOperation: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          operations:
            state.visit.history.pastHistory.operations.filter(
              (item) => item.id !== id
            ),
        },
      },
    },
  })),

  addBloodTransfusion: (transfusion) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          bloodTransfusions: [
            ...state.visit.history.pastHistory
              .bloodTransfusions,
            transfusion,
          ],
        },
      },
    },
  })),

updateBloodTransfusion: (id, updates) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          bloodTransfusions:
            state.visit.history.pastHistory.bloodTransfusions.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        },
      },
    },
  })),

removeBloodTransfusion: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          bloodTransfusions:
            state.visit.history.pastHistory.bloodTransfusions.filter(
              (item) => item.id !== id
            ),
        },
      },
    },
  })),

  addMajorTrauma: (trauma) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          majorTraumas: [
            ...state.visit.history.pastHistory
              .majorTraumas,
            trauma,
          ],
        },
      },
    },
  })),

updateMajorTrauma: (id, updates) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          majorTraumas:
            state.visit.history.pastHistory.majorTraumas.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        },
      },
    },
  })),

removeMajorTrauma: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          majorTraumas:
            state.visit.history.pastHistory.majorTraumas.filter(
              (item) => item.id !== id
            ),
        },
      },
    },
  })),

  addICUAdmission: (admission) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          icuAdmissions: [
            ...state.visit.history.pastHistory
              .icuAdmissions,
            admission,
          ],
        },
      },
    },
  })),

updateICUAdmission: (id, updates) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          icuAdmissions:
            state.visit.history.pastHistory.icuAdmissions.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        },
      },
    },
  })),

removeICUAdmission: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        pastHistory: {
          ...state.visit.history.pastHistory,
          icuAdmissions:
            state.visit.history.pastHistory.icuAdmissions.filter(
              (item) => item.id !== id
            ),
        },
      },
    },
  })),

    

    addMedication: (medication) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              currentMedications: [
                ...state.visit.history.drugHistory.currentMedications,
                medication,
              ],
            },
          },
        },
      })),

    updateMedication: (id, updates) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              currentMedications:
                state.visit.history.drugHistory.currentMedications.map(
                  (medication) =>
                    medication.id === id
                      ? {
                          ...medication,
                          ...updates,
                        }
                      : medication
                ),
            },
          },
        },
      })),

    removeMedication: (id) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              currentMedications:
                state.visit.history.drugHistory.currentMedications.filter(
                  (medication) =>
                    medication.id !== id
                ),
            },
          },
        },
      })),

    updateCompliance: (value) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              compliance: value,
            },
          },
        },
      })),

    updateSelfMedication: (value) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              selfMedication: value,
            },
          },
        },
      })),

    updateSelfMedicationDetails: (value) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              selfMedicationDetails: value,
            },
          },
        },
      })),

    updateSupplements: (value) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              supplements: value,
            },
          },
        },
      })),

    updateSupplementDetails: (value) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            drugHistory: {
              ...state.visit.history.drugHistory,
              supplementDetails: value,
            },
          },
        },
      })),

    updateHasAllergy: (value) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            allergyHistory: {
              ...state.visit.history.allergyHistory,
              hasAllergy: value,
              allergies:
                value === "No"
                  ? []
                  : state.visit.history.allergyHistory.allergies,
            },
          },
        },
      })),

    addAllergy: (allergy) =>
    set((state) => ({
        visit: {
            ...state.visit,
            history: {
                ...state.visit.history,
                allergyHistory: {
                    ...state.visit.history
                        .allergyHistory,
                    allergies: [
                        ...state.visit.history
                            .allergyHistory
                            .allergies,
                        allergy,
                    ],
                },
            },
        },
    })),

    updateAllergy: (
        id,
        allergy
    ) =>
        set((state) => ({
            visit: {
                ...state.visit,
                history: {
                    ...state.visit.history,
                    allergyHistory: {
                        ...state.visit.history
                            .allergyHistory,
                        allergies:
                            state.visit.history
                                .allergyHistory
                                .allergies.map((item) =>
                                item.id === id
                                    ? {
                                          ...item,
                                          ...allergy,
                                      }
                                    : item
                            ),
                    },
                },
            },
        })),

        removeAllergy: (id) =>
    set((state) => ({
        visit: {
            ...state.visit,
            history: {
                ...state.visit.history,
                allergyHistory: {
                    ...state.visit.history
                        .allergyHistory,
                    allergies:
                        state.visit.history
                            .allergyHistory
                            .allergies.filter(
                                (item) =>
                                    item.id !==
                                    id
                            ),
                },
            },
        },
    })),

    addFamilyDisease: (disease) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        familyHistory: {
          ...state.visit.history.familyHistory,
          familyDiseases: [
            ...state.visit.history.familyHistory
              .familyDiseases,
            disease,
          ],
        },
      },
    },
  })),

  updateFamilyDisease: (
  id,
  updates
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        familyHistory: {
          ...state.visit.history.familyHistory,
          familyDiseases:
            state.visit.history.familyHistory.familyDiseases.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        },
      },
    },
  })),

  removeFamilyDisease: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      history: {
        ...state.visit.history,
        familyHistory: {
          ...state.visit.history.familyHistory,
          familyDiseases:
            state.visit.history.familyHistory.familyDiseases.filter(
              (item) => item.id !== id
            ),
        },
      },
    },
  })),

        updateVitalSigns: (updates) =>
      set((state) => {
        const current =
          state.visit.examination.vitalSigns;

        const vitalSigns = {
          ...current,
          ...updates,
        };

        const weight = parseFloat(
          vitalSigns.weight
        );

        const height = parseFloat(
          vitalSigns.height
        );

        let bmi = "";

        if (
          !isNaN(weight) &&
          !isNaN(height) &&
          weight > 0 &&
          height > 0
        ) {
          const heightMeters = height / 100;

          bmi = (
            weight /
            (heightMeters * heightMeters)
          ).toFixed(1);
        }

        return {
          visit: {
            ...state.visit,
            examination: {
              ...state.visit.examination,
              vitalSigns: {
                ...vitalSigns,
                bmi,
              },
            },
          },
        };
      }),

    updateBloodPressure: (
      systolic,
      diastolic
    ) =>
      set((state) => ({
        visit: {
          ...state.visit,
          examination: {
            ...state.visit.examination,
            vitalSigns: {
              ...state.visit.examination
                .vitalSigns,
              bloodPressure: {
                systolic,
                diastolic,
              },
            },
          },
        },
      })),

      updateGeneralInspection: (
        updates
      ) =>
        set((state) => ({
          visit: {
            ...state.visit,
            examination: {
              ...state.visit.examination,
              generalInspection: {
                ...state.visit.examination
                  .generalInspection,
                ...updates,
              },
            },
          },
        })),

      toggleGeneralFinding: (
        finding
      ) =>
        set((state) => {
          const current =
            state.visit.examination
              .generalInspection.findings;

          const findings =
            current.includes(finding)
              ? current.filter(
                  (x) => x !== finding
                )
              : [...current, finding];

          return {
            visit: {
              ...state.visit,
              examination: {
                ...state.visit.examination,
                generalInspection: {
                  ...state.visit.examination
                    .generalInspection,
                  findings,
                },
              },
            },
          };
        }),

      toggleEdemaLocation: (
        location
      ) =>
        set((state) => {
          const current =
            state.visit.examination
              .generalInspection
              .edemaLocations;

          const edemaLocations =
            current.includes(location)
              ? current.filter(
                  (x) => x !== location
                )
              : [...current, location];

          return {
            visit: {
              ...state.visit,
              examination: {
                ...state.visit.examination,
                generalInspection: {
                  ...state.visit.examination
                    .generalInspection,
                  edemaLocations,
                },
              },
            },
          };
        }),

        updateRegionalSection: (
        section,
        updates
      ) =>
        set((state) => ({
          visit: {
            ...state.visit,
            examination: {
              ...state.visit.examination,
              regionalExamination: {
                ...state.visit.examination
                  .regionalExamination,
                [section]: {
                  ...state.visit.examination
                    .regionalExamination[
                    section
                  ],
                  ...updates,
                },
              },
            },
          },
        })),

      toggleRegionalFinding: (
        section,
        finding
      ) =>
        set((state) => {
          const current =
            state.visit.examination
              .regionalExamination[
              section
            ].findings;

          let findings: string[];

          if (finding === "NAD") {
            findings = ["NAD"];
          } else {
            findings = current.filter(
              (item) => item !== "NAD"
            );

            if (
              findings.includes(finding)
            ) {
              findings = findings.filter(
                (item) =>
                  item !== finding
              );
            } else {
              findings = [
                ...findings,
                finding,
              ];
            }

            if (findings.length === 0) {
              findings = ["NAD"];
            }
          }

          return {
            visit: {
              ...state.visit,
              examination: {
                ...state.visit.examination,
                regionalExamination: {
                  ...state.visit.examination
                    .regionalExamination,
                  [section]: {
                    ...state.visit
                      .examination
                      .regionalExamination[
                      section
                    ],
                    findings,
                  },
                },
              },
            },
          };
        }),

    updateSelectedSystem: (
        systemId
      ) =>
        set((state) => ({
          visit: {
            ...state.visit,
            examination: {
              ...state.visit.examination,
              systemExamination: {
                ...state.visit.examination
                  .systemExamination,
                selectedSystem: systemId,
              },
            },
          },
        })),

      updateSystemExaminationField: (
        systemId,
        fieldId,
        fieldLabel,
        value,
        unit
      ) =>
        set((state) => {
          const systems =
            state.visit.examination
              .systemExamination.systems;

          const systemIndex =
            systems.findIndex(
              (system) =>
                system.systemId === systemId
            );

          let updatedSystems;

          if (systemIndex >= 0) {
            const fields =
              systems[systemIndex].fields;

            const fieldIndex =
              fields.findIndex(
                (field) =>
                  field.fieldId === fieldId
              );

            let updatedFields;

            if (fieldIndex >= 0) {
              updatedFields = [...fields];

              updatedFields[fieldIndex] = {
                ...updatedFields[fieldIndex],
                value,
                unit,
              };
            } else {
              updatedFields = [
                ...fields,
                {
                  fieldId,
                  fieldLabel,
                  value,
                  unit,
                },
              ];
            }

            updatedSystems = [...systems];

            updatedSystems[systemIndex] = {
              ...updatedSystems[systemIndex],
              fields: updatedFields,
            };
          } else {
            updatedSystems = [
              ...systems,
              {
                systemId,
                systemName: systemId,
                fields: [
                  {
                    fieldId,
                    fieldLabel,
                    value,
                    unit,
                  },
                ],
              },
            ];
          }

          return {
            visit: {
              ...state.visit,
              examination: {
                ...state.visit.examination,
                systemExamination: {
                  ...state.visit.examination
                    .systemExamination,
                  systems: updatedSystems,
                },
              },
            },
          };
        }),

      updatePrimaryDiagnosis: (diagnosis) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        diagnosis: {
          ...state.visit.assessment.diagnosis,
          primaryDiagnosis: diagnosis,
        },
      },
    },
  })),

clearPrimaryDiagnosis: () =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        diagnosis: {
          ...state.visit.assessment.diagnosis,
          primaryDiagnosis: undefined,
        },
      },
    },
  })),

addDifferentialDiagnosis: (diagnosis) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        diagnosis: {
          ...state.visit.assessment.diagnosis,
          differentialDiagnoses: [
            ...state.visit.assessment.diagnosis
              .differentialDiagnoses,
            diagnosis,
          ],
        },
      },
    },
  })),

removeDifferentialDiagnosis: (diagnosis) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        diagnosis: {
          ...state.visit.assessment.diagnosis,
          differentialDiagnoses:
            state.visit.assessment.diagnosis.differentialDiagnoses.filter(
              (item) =>
                item.diagnosis !== diagnosis
            ),
        },
      },
    },
  })),

setAiSuggestedDiagnoses: (diagnoses) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        diagnosis: {
          ...state.visit.assessment.diagnosis,
          aiSuggestedDiagnoses: diagnoses,
        },
      },
    },
  })),

    addRequestedInvestigation: (investigation) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations: [
            ...state.visit.assessment
              .investigations
              .requestedInvestigations,
            investigation,
          ],
        },
      },
    },
  })),

removeRequestedInvestigation: (name) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations:
            state.visit.assessment.investigations.requestedInvestigations.filter(
              (item) => item.name !== name
            ),
        },
      },
    },
  })),

updateInvestigationStatus: (
  name,
  status
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations:
            state.visit.assessment.investigations.requestedInvestigations.map(
              (item) =>
                item.name === name
                  ? {
                      ...item,
                      status,
                    }
                  : item
            ),
        },
      },
    },
  })),

setAiSuggestedInvestigations: (
  investigations
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          aiSuggestedInvestigations:
            investigations,
        },
      },
    },
  })),

    updateInvestigationResult: (
  investigationId,
  fieldId,
  fieldLabel,
  value,
  unit
) =>
  set((state) => {
    const results =
      state.visit.assessment
        .investigations.results;

    const resultIndex =
      results.findIndex(
        (item) =>
          item.investigationId ===
          investigationId
      );

    let updatedResults;

    if (resultIndex >= 0) {
      const fields =
        results[resultIndex].values;

      const fieldIndex =
        fields.findIndex(
          (field) =>
            field.fieldId === fieldId
        );

      let updatedFields;

      if (fieldIndex >= 0) {
        updatedFields = [...fields];
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          value,
          unit,
        };
      } else {
        updatedFields = [
          ...fields,
          {
            fieldId,
            fieldLabel,
            value,
            unit,
          },
        ];
      }

      updatedResults = [...results];
      updatedResults[resultIndex] = {
        ...updatedResults[resultIndex],
        values: updatedFields,
      };
    } else {
      updatedResults = [
        ...results,
        {
          investigationId,
          values: [
            {
              fieldId,
              fieldLabel,
              value,
              unit,
            },
          ],
        },
      ];
    }

    return {
      visit: {
        ...state.visit,
        assessment: {
          ...state.visit.assessment,
          investigations: {
            ...state.visit.assessment
              .investigations,
            results: updatedResults,
          },
        },
      },
    };
  }),

removeInvestigationResult: (
  investigationId
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment
            .investigations,
          results:
            state.visit.assessment
              .investigations.results.filter(
                (item) =>
                  item.investigationId !==
                  investigationId
              ),
        },
      },
    },
  })),

    addProcedure: (procedure) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          procedures: [
            ...state.visit.assessment
              .proceduresReferrals
              .procedures,
            procedure,
          ],
        },
      },
    },
  })),

updateProcedure: (
  index,
  details
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          procedures:
            state.visit.assessment
              .proceduresReferrals
              .procedures.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        details,
                      }
                    : item
              ),
        },
      },
    },
  })),

removeProcedure: (index) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          procedures:
            state.visit.assessment
              .proceduresReferrals
              .procedures.filter(
                (_, i) => i !== index
              )
        },
      },
    },
  })),

    addReferral: (referral) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          referrals: [
            ...state.visit.assessment
              .proceduresReferrals
              .referrals,
            referral,
          ],
        },
      },
    },
  })),

updateReferral: (
  index,
  details
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          referrals:
            state.visit.assessment
              .proceduresReferrals
              .referrals.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        details,
                      }
                    : item
              ),
        },
      },
    },
  })),

removeReferral: (index) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          referrals:
            state.visit.assessment
              .proceduresReferrals
              .referrals.filter(
                (_, i) => i !== index
              ),
        },
      },
    },
  })),

  addPrescriptionMedication: (
  medication
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        prescription: {
          ...state.visit.assessment
            .prescription,
          medications: [
            ...state.visit.assessment
              .prescription
              .medications,
            medication,
          ],
        },
      },
    },
  })),

updatePrescriptionMedication: (
  index,
  updates
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        prescription: {
          ...state.visit.assessment
            .prescription,
          medications:
            state.visit.assessment
              .prescription
              .medications.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        ...updates,
                      }
                    : item
              ),
        },
      },
    },
  })),

removePrescriptionMedication: (
  index
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        prescription: {
          ...state.visit.assessment
            .prescription,
          medications:
            state.visit.assessment
              .prescription
              .medications.filter(
                (_, i) => i !== index
              ),
        },
      },
    },
  })),

updatePrescriptionAdvice: (
  value
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        prescription: {
          ...state.visit.assessment
            .prescription,
          advice: value,
        },
      },
    },
  })),

updatePrescriptionNotes: (
  value
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        prescription: {
          ...state.visit.assessment
            .prescription,
          notes: value,
        },
      },
    },
  })),

updatePrescriptionFollowUp: (
  value
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        prescription: {
          ...state.visit.assessment
            .prescription,
          followUp: value,
        },
      },
    },
  })),

    resetVisit: () =>
      set({
        visit: createEmptyVisitForm(),
      }),
  }));