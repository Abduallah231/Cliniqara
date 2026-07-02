export interface PrescriptionMedication {
  id: string;

  name: string;

  dose: string;

  frequency: string;

  duration: string;
}

export interface PrescriptionTemplate {
  id: string;

  folderId?: string;

  title: string;

  medications: PrescriptionMedication[];

  patientAdvice: string[];

  followUp: string;

  notes: string;

  updatedAt: string;
}