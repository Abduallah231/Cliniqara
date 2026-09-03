import { create } from "zustand";
import {
  VisitForm,
  createEmptyVisitForm,
} from "@/models/VisitForm";
import { DynamicValue } from "@/models/VisitForm/assessment";
import {
  PediatricHistory,
  Medication,
  MedicationCompliance,
  Allergy,
  Hospitalization,
  Operation,
  BloodTransfusion,
  MajorTrauma,
  ICUAdmission,
  FamilyDisease,
  RelatedSystemItem,
  RelatedSystemType
} from "@/models/VisitForm/history";
import {
  VitalSigns,
  GeneralInspection,
  RegionalExamination,
  ExaminationSystem,
} from "@/models/VisitForm/examination";
import {
  Diagnosis,
  Investigation,
  InvestigationImage,
  InvestigationResult,
  Procedure,
  Referral,
  PrescriptionMedication,
} from "@/models/VisitForm/assessment";

import {
  Clinic,
  ClinicInformation,
  ClinicWorkingHours,
  Doctor,
  Staff,
} from "@/models/VisitForm/clinic";

type VaccinationHistoryField =
  | "vaccinationStatus"
  | "missedVaccines"
  | "partialReason"
  | "partialOtherDetails"
  | "unvaccinatedReason"
  | "unvaccinatedOtherDetails"
  | "previousReaction"
  | "reactionSeverity"
  | "reactionDetails";

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

  updateRelatedSystem: (
    system: RelatedSystemType,
    updates: Partial<RelatedSystemItem>
  ) => void;

  toggleRelatedSystemSymptom: (
    system: RelatedSystemType,
    symptom: string
  ) => void;

  updateRelatedSystemOtherFinding: (
    system: RelatedSystemType,
    otherFinding: string
  ) => void;

  setRelatedSystems: (
    systems: RelatedSystemItem[]
  ) => void;

  updateSystematicReviewField: (
    fieldId: string,
    fieldLabel: string,
    value: DynamicValue,
    unit?: string
  ) => void;

  updatePediatricHistory: (
    updates: Partial<PediatricHistory>
  ) => void;

updateVaccinationField(
  field: VaccinationHistoryField,
  value: DynamicValue
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
  value: MedicationCompliance
) => void;

updateSelfMedication: (
  value: boolean
) => void;

updateSelfMedicationDetails: (
  value: string
) => void;

updateSupplements: (
  value: boolean
) => void;

updateSupplementDetails: (
  value: string
) => void;

// ======================================================
// Allergy History
// ======================================================

updateHasAllergy: (
    value: boolean
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

setSystemExaminationSystems: (
  systems: ExaminationSystem[]
) => void;

// ======================================================
// Diagnosis
// ======================================================

updatePrimaryDiagnosis(
  diagnosis?: Diagnosis
): void;

clearPrimaryDiagnosis: () => void;

setDiagnosis: (
  diagnosis: {
    primaryDiagnosis?: Diagnosis;
    differentialDiagnoses: Diagnosis[];
  }
) => void;

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

setInvestigationsAssessment: (
  requestedInvestigations: Investigation[],
  results: InvestigationResult[],
) => void;

reconcileInvestigationsPersistence: (
  persistedInvestigations: Investigation[],
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
// Investigation Images
// ======================================================
addInvestigationImage: (
  investigationId: string,
  image: InvestigationImage
) => void;

removeInvestigationImage: (
  investigationId: string,
  fileUrl: string
) => void;

setInvestigationImages: (
  investigationId: string,
  images: InvestigationImage[]
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

setProcedures: (
  procedures: Procedure[]
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

setReferrals: (
  referrals: Referral[]
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

// ======================================================
// Clinic Information
// ======================================================

updateClinicInformation: (
  updates: Partial<ClinicInformation>
) => void;

updateWorkingHours: (
  updates: Partial<ClinicWorkingHours>
) => void;

toggleWorkingDay: (
  day: string
) => void;

// ======================================================
// Doctors
// ======================================================

addDoctor: (
  doctor: Doctor
) => void;

updateDoctor: (
  id: string,
  updates: Partial<Doctor>
) => void;

removeDoctor: (
  id: string
) => void;

// ======================================================
// Staff
// ======================================================

addStaff: (
  staff: Staff
) => void;

updateStaff: (
  id: string,
  updates: Partial<Staff>
) => void;

removeStaff: (
  id: string
) => void;

setChiefComplaint: (
  complaintId: string,
  complaintName: string
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

    setChiefComplaint: (
      complaintId,
      complaintName
    ) =>
      set((state) => {
        const currentComplaintId =
          state.visit.history.chiefComplaint.complaintId;

        const complaintChanged =
          currentComplaintId !== complaintId;

        return {
          visit: {
            ...state.visit,

            history: {
              ...state.visit.history,

              chiefComplaint: {
                ...state.visit.history.chiefComplaint,
                complaintId,
                complaintName,

                /*
                * New chief complaint =
                * completely new analysis context.
                */
                ...(complaintChanged && {
                  durationValue: undefined,
                  durationUnit: undefined,
                }),
              },

              hpi: {
                ...state.visit.history.hpi,

                analysis: {
                  ...state.visit.history.hpi.analysis,

                  /*
                  * NEVER carry analysis fields
                  * from the previous complaint.
                  */
                  ...(complaintChanged && {
                    fields: [],
                  }),
                },
              },
            },
          },
        };
      }),

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

    setRelatedSystems: (systems) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            hpi: {
              ...state.visit.history.hpi,
              relatedSystemSymptoms: {
                systems,
              },
            },
          },
        },
      })),

    updateRelatedSystem: (
      system,
      updates
    ) =>
      set((state) => {
        const current =
          state.visit.history.hpi.relatedSystemSymptoms
            .systems;

        const index = current.findIndex(
          (item) => item.system === system
        );

        let systems: RelatedSystemItem[];

        if (index >= 0) {
          systems = [...current];

          systems[index] = {
            ...systems[index],
            ...updates,
          };
        } else {
          systems = [
            ...current,
            {
              system,
              symptoms: [],
              otherFinding: null,
              ...updates,
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
                  systems,
                },
              },
            },
          },
        };
      }),

    toggleRelatedSystemSymptom: (
      system,
      symptom
    ) =>
      set((state) => {
        const current =
          state.visit.history.hpi.relatedSystemSymptoms
            .systems;

        const existing = current.find(
          (item) => item.system === system
        );

        const symptoms = existing
          ? existing.symptoms.includes(symptom)
            ? existing.symptoms.filter(
                (item) => item !== symptom
              )
            : [...existing.symptoms, symptom]
          : [symptom];

        const systems = existing
          ? current.map((item) =>
              item.system === system
                ? {
                    ...item,
                    symptoms,
                  }
                : item
            )
          : [
              ...current,
              {
                system,
                symptoms,
                otherFinding: null,
              },
            ];

        return {
          visit: {
            ...state.visit,
            history: {
              ...state.visit.history,
              hpi: {
                ...state.visit.history.hpi,
                relatedSystemSymptoms: {
                  systems,
                },
              },
            },
          },
        };
      }),

    updateRelatedSystemOtherFinding: (
      system,
      otherFinding
    ) =>
      set((state) => {
        const current =
          state.visit.history.hpi.relatedSystemSymptoms
            .systems;

        const existing = current.find(
          (item) => item.system === system
        );

        const systems = existing
          ? current.map((item) =>
              item.system === system
                ? {
                    ...item,
                    otherFinding,
                  }
                : item
            )
          : [
              ...current,
              {
                system,
                symptoms: [],
                otherFinding,
              },
            ];

        return {
          visit: {
            ...state.visit,
            history: {
              ...state.visit.history,
              hpi: {
                ...state.visit.history.hpi,
                relatedSystemSymptoms: {
                  systems,
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

    updatePediatricHistory: (updates) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            pediatricHistory: {
              ...state.visit.history.pediatricHistory,
              ...updates,
            },
          },
        },
      })),

    updateVaccinationField: (field, value) =>
      set((state) => ({
        visit: {
          ...state.visit,
          history: {
            ...state.visit.history,
            vaccinationHistory: {
              ...state.visit.history.vaccinationHistory,
              [field]: value,
            },
          },
        },
      })
    ),

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
          state.visit.history.pastHistory.fields;

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
                value === false
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
              ...state.visit.examination.vitalSigns,
              systolicBP: systolic,
              diastolicBP: diastolic,
            },
          },
        },
      })
    ),

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
      
    setSystemExaminationSystems: (
        systems
      ) =>
        set((state) => ({
          visit: {
            ...state.visit,
            examination: {
              ...state.visit.examination,
              systemExamination: {
                ...state.visit.examination
                  .systemExamination,
                systems,
              },
            },
          },
        })),

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

  setDiagnosis: (diagnosis) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        diagnosis: {
          ...state.visit.assessment.diagnosis,
          primaryDiagnosis:
            diagnosis.primaryDiagnosis,
          differentialDiagnoses:
            diagnosis.differentialDiagnoses,
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

  setInvestigationsAssessment: (
  requestedInvestigations,
  results,
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations,
          results,
        },
      },
    },
  })),

  reconcileInvestigationsPersistence: (
  persistedInvestigations,
) =>
  set((state) => {
    const currentInvestigations =
      state.visit.assessment.investigations;

    const persistedByName = new Map(
      persistedInvestigations.map(
        (investigation) => [
          investigation.name,
          investigation,
        ],
      ),
    );

    const currentRequested =
      currentInvestigations
        .requestedInvestigations;

    const idMap = new Map<
      string,
      string
    >();

    const reconciledRequested =
      currentRequested.map(
        (current) => {
          const persisted =
            persistedByName.get(
              current.name,
            );

          if (!persisted) {
            return current;
          }

          const oldIdentifier =
            current.id ??
            current.name;

          if (persisted.id) {
            idMap.set(
              oldIdentifier,
              persisted.id,
            );
          }

          return {
            ...current,
            id: persisted.id,
            code:
              current.code ??
              persisted.code,
            images:
              persisted.images ??
              current.images ??
              [],
          };
        },
      );

    const reconciledResults =
      currentInvestigations.results.map(
        (result) => {
          const newId =
            idMap.get(
              result.investigationId,
            );

          if (!newId) {
            return result;
          }

          return {
            ...result,
            investigationId: newId,
          };
        },
      );

    return {
      visit: {
        ...state.visit,
        assessment: {
          ...state.visit.assessment,
          investigations: {
            ...currentInvestigations,
            requestedInvestigations:
              reconciledRequested,
            results:
              reconciledResults,
          },
        },
      },
    };
  }),

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
            {
              ...investigation,
              images: investigation.images ?? [],
            },
          ],
        },
      },
    },
  })),

removeRequestedInvestigation: (identifier) =>
  set((state) => {
    const requested =
      state.visit.assessment.investigations
        .requestedInvestigations;

    const investigation =
      requested.find(
        (item) =>
          item.id === identifier ||
          item.name === identifier,
      );

    if (!investigation) {
      return state;
    }

    const investigationId =
      investigation.id ?? investigation.name;

    return {
      visit: {
        ...state.visit,
        assessment: {
          ...state.visit.assessment,
          investigations: {
            ...state.visit.assessment.investigations,

            requestedInvestigations:
              requested.filter(
                (item) =>
                  item.id !== identifier &&
                  item.name !== identifier,
              ),

            results:
              state.visit.assessment.investigations.results.filter(
                (item) =>
                  item.investigationId !==
                  investigationId,
              ),
          },
        },
      },
    };
  }),

updateInvestigationStatus: (
  identifier,
  status,
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations:
            state.visit.assessment.investigations
              .requestedInvestigations.map(
                (item) =>
                  item.id === identifier ||
                  item.name === identifier
                    ? {
                        ...item,
                        status,
                      }
                    : item,
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

      // ======================================================
// Investigation Images
// ======================================================
addInvestigationImage: (
  investigationId,
  image,
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations:
            state.visit.assessment.investigations
              .requestedInvestigations.map(
                (investigation) =>
                  investigation.id ===
                  investigationId
                    ? {
                        ...investigation,
                        images: [
                          ...(investigation.images ?? []),
                          {
                            ...image,
                            sortOrder:
                              image.sortOrder ??
                              (
                                investigation.images ??
                                []
                              ).length,
                          },
                        ],
                      }
                    : investigation,
              ),
        },
      },
    },
  })),

removeInvestigationImage: (
  investigationId,
  fileUrl,
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations:
            state.visit.assessment.investigations
              .requestedInvestigations.map(
                (investigation) =>
                  investigation.id ===
                  investigationId
                    ? {
                        ...investigation,
                        images: (
                          investigation.images ?? []
                        )
                          .filter(
                            (image) =>
                              image.fileUrl !==
                              fileUrl,
                          )
                          .map(
                            (
                              image,
                              index,
                            ) => ({
                              ...image,
                              sortOrder: index,
                            }),
                          ),
                      }
                    : investigation,
              ),
        },
      },
    },
  })),

setInvestigationImages: (
  investigationId,
  images,
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        investigations: {
          ...state.visit.assessment.investigations,
          requestedInvestigations:
            state.visit.assessment.investigations
              .requestedInvestigations.map(
                (investigation) =>
                  investigation.id ===
                  investigationId
                    ? {
                        ...investigation,
                        images,
                      }
                    : investigation,
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

  setProcedures: (procedures) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          procedures,
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

  setReferrals: (referrals) =>
  set((state) => ({
    visit: {
      ...state.visit,
      assessment: {
        ...state.visit.assessment,
        proceduresReferrals: {
          ...state.visit.assessment
            .proceduresReferrals,
          referrals,
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

  updateClinicInformation: (updates) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        information: {
          ...state.visit.clinic.information,
          ...updates,
        },
      },
    },
  })),

  updateWorkingHours: (updates) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        workingHours: {
          ...state.visit.clinic.workingHours,
          ...updates,
        },
      },
    },
  })),

  toggleWorkingDay: (day) =>
  set((state) => {
    const current =
      state.visit.clinic.workingHours.days;

    const days = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];

    return {
      visit: {
        ...state.visit,
        clinic: {
          ...state.visit.clinic,
          workingHours: {
            ...state.visit.clinic.workingHours,
            days,
          },
        },
      },
    };
  }),

  addDoctor: (doctor) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        doctors: [
          ...state.visit.clinic.doctors,
          doctor,
        ],
      },
    },
  })),

  updateDoctor: (
  id,
  updates
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        doctors:
          state.visit.clinic.doctors.map(
            (doctor) =>
              doctor.id === id
                ? {
                    ...doctor,
                    ...updates,
                  }
                : doctor
          ),
      },
    },
  })),

  removeDoctor: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        doctors:
          state.visit.clinic.doctors.filter(
            (doctor) =>
              doctor.id !== id
          ),
      },
    },
  })),

  addStaff: (staff) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        staff: [
          ...state.visit.clinic.staff,
          staff,
        ],
      },
    },
  })),

  updateStaff: (
  id,
  updates
) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        staff:
          state.visit.clinic.staff.map(
            (member) =>
              member.id === id
                ? {
                    ...member,
                    ...updates,
                  }
                : member
          ),
      },
    },
  })),

  removeStaff: (id) =>
  set((state) => ({
    visit: {
      ...state.visit,
      clinic: {
        ...state.visit.clinic,
        staff:
          state.visit.clinic.staff.filter(
            (member) =>
              member.id !== id
          ),
      },
    },
  })),

    resetVisit: () =>
      set({
        visit: createEmptyVisitForm(),
      }),
  }));