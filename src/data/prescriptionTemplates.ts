import { PrescriptionTemplate } from "@/models";

export const prescriptionTemplates: PrescriptionTemplate[] = [
  {
    id: "template-1",
    title: "Hypertension",
    medications: [
      {
        id: "1",
        name: "Amlodipine",
        dose: "5 mg",
        frequency: "Once Daily",
        duration: "30 Days",
      },
      {
        id: "2",
        name: "Perindopril",
        dose: "5 mg",
        frequency: "Once Daily",
        duration: "30 Days",
      },
    ],
    patientAdvice: [
      "Low salt diet",
      "Regular exercise",
      "Monitor blood pressure",
    ],
    followUp: "After 2 Weeks",
    notes: "First-line uncomplicated HTN",
    updatedAt: "Today",
  },

  {
    id: "template-2",
    folderId: "folder-2",
    title: "Type 2 Diabetes",
    medications: [
      {
        id: "1",
        name: "Metformin",
        dose: "500 mg",
        frequency: "Twice Daily",
        duration: "30 Days",
      },
    ],
    patientAdvice: [
      "Diabetic diet",
      "Daily walking",
    ],
    followUp: "After 1 Month",
    notes: "",
    updatedAt: "Yesterday",
  },

  {
    id: "template-3",
    folderId: "folder-3",
    title: "Acute URTI",
    medications: [
      {
        id: "1",
        name: "Paracetamol",
        dose: "500 mg",
        frequency: "Three Times Daily",
        duration: "5 Days",
      },
    ],
    patientAdvice: [
      "Increase fluids",
      "Rest",
    ],
    followUp: "PRN",
    notes: "",
    updatedAt: "3 Days Ago",
  },
];