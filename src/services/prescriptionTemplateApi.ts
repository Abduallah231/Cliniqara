import { getLocalRecord, listLocalRecords, putLocalRecord } from "./localDatabase";
import { useDoctorStore } from "@/store/doctorStore";

const localId = () => `local-template-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const clinicTemplates = async (clinicId?: string) => (await listLocalRecords<PrescriptionTemplate>("prescription_templates")).map((row) => row.value).filter((item) => item.isActive && (clinicId ? item.scope === "CLINIC" && item.clinicId === clinicId : item.scope === "USER" && item.userId === useDoctorStore.getState().doctor?.id));
const clinicFolders = async (clinicId?: string) => (await listLocalRecords<PrescriptionTemplateFolder>("prescription_template_folders")).map((row) => row.value).filter((item) => item.isActive && (clinicId ? item.scope === "CLINIC" && item.clinicId === clinicId : item.scope === "USER" && item.userId === useDoctorStore.getState().doctor?.id));
async function createTemplate(scope: "USER" | "CLINIC", clinicId: string | undefined, dto: CreatePrescriptionTemplateInput): Promise<PrescriptionTemplate> {
  const now = new Date().toISOString();
  const template: PrescriptionTemplate = {
    ...dto,
    id: localId(),
    scope,
    userId: scope === "USER" ? useDoctorStore.getState().doctor?.id : null,
    clinicId: clinicId ?? null,
    folderId: dto.folderId ?? null,
    advice: dto.advice ?? null,
    notes: dto.notes ?? null,
    followUp: dto.followUp ?? null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    medications: dto.medications.map((medication, index) => ({
      id: localId(), drugId: medication.drugId, medication: medication.drugId,
      instructions: medication.instructions, durationValue: medication.durationValue ?? null,
      durationUnit: medication.durationUnit ?? null, sortOrder: medication.sortOrder ?? index,
    })),
  };
  await putLocalRecord({ collection: "prescription_templates", id: template.id, clinicId, value: template });
  return template;
}
async function createFolder(scope: "USER" | "CLINIC", clinicId: string | undefined, dto: CreatePrescriptionTemplateFolderInput): Promise<PrescriptionTemplateFolder> {
  const now = new Date().toISOString();
  const folder: PrescriptionTemplateFolder = {
    id: localId(), name: dto.name.trim(), scope,
    userId: scope === "USER" ? useDoctorStore.getState().doctor?.id : null,
    clinicId: clinicId ?? null, isActive: true, createdAt: now, updatedAt: now,
  };
  await putLocalRecord({ collection: "prescription_template_folders", id: folder.id, clinicId, value: folder });
  return folder;
}

export type PrescriptionTemplateScope =
  | "USER"
  | "CLINIC"
  | "GLOBAL";

export type PrescriptionTemplateDurationUnit =
  | "DAYS"
  | "WEEKS"
  | "MONTHS"
  | "YEARS";

export type PrescriptionTemplateMedication = {
  id: string;
  drugId: string | null;
  medication: string;
  instructions: string;
  durationValue: number | null;
  durationUnit:
    | PrescriptionTemplateDurationUnit
    | null;
  sortOrder: number;
  templateId?: string;
};

export type PrescriptionTemplateFolder = {
  id: string;
  name: string;
  scope: PrescriptionTemplateScope;
  userId?: string | null;
  clinicId?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PrescriptionTemplate = {
  id: string;
  title: string;
  scope: PrescriptionTemplateScope;
  userId?: string | null;
  clinicId?: string | null;
  folderId?: string | null;
  advice?: string | null;
  notes?: string | null;
  followUp?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  folder?: PrescriptionTemplateFolder | null;
  medications: PrescriptionTemplateMedication[];
};

export type CreatePrescriptionTemplateMedicationInput = {
  drugId: string;
  instructions: string;
  durationValue?: number | null;
  durationUnit?:
    | PrescriptionTemplateDurationUnit
    | null;
  sortOrder?: number;
};

export type CreatePrescriptionTemplateInput = {
  title: string;
  folderId?: string | null;
  advice?: string | null;
  notes?: string | null;
  followUp?: string | null;
  medications: CreatePrescriptionTemplateMedicationInput[];
};

export type UpdatePrescriptionTemplateInput =
  Partial<CreatePrescriptionTemplateInput> & {
    isActive?: boolean;
  };

export type CreatePrescriptionTemplateFolderInput = {
  name: string;
};

export type UpdatePrescriptionTemplateFolderInput = {
  name?: string;
  isActive?: boolean;
};

// ======================================================
// USER TEMPLATES
// ======================================================

export async function getUserTemplates(): Promise<
  PrescriptionTemplate[]
> {
  return clinicTemplates();
}

export async function createUserTemplate(
  dto: CreatePrescriptionTemplateInput,
): Promise<PrescriptionTemplate> {
  return createTemplate("USER", undefined, dto);
}

export async function getUserTemplateFolders(): Promise<
  PrescriptionTemplateFolder[]
> {
  return clinicFolders();
}

export async function createUserTemplateFolder(
  dto: CreatePrescriptionTemplateFolderInput,
): Promise<PrescriptionTemplateFolder> {
  return createFolder("USER", undefined, dto);
}

// ======================================================
// CLINIC TEMPLATES
// ======================================================

export async function getClinicTemplates(
  clinicId: string,
): Promise<PrescriptionTemplate[]> {
  return clinicTemplates(clinicId);
}

export async function createClinicTemplate(
  clinicId: string,
  dto: CreatePrescriptionTemplateInput,
): Promise<PrescriptionTemplate> {
  return createTemplate("CLINIC", clinicId, dto);
}

export async function getClinicTemplateFolders(
  clinicId: string,
): Promise<PrescriptionTemplateFolder[]> {
  return clinicFolders(clinicId);
}

export async function createClinicTemplateFolder(
  clinicId: string,
  dto: CreatePrescriptionTemplateFolderInput,
): Promise<PrescriptionTemplateFolder> {
  return createFolder("CLINIC", clinicId, dto);
}

// ======================================================
// GLOBAL TEMPLATES
// ======================================================

export async function getGlobalTemplates(): Promise<
  PrescriptionTemplate[]
> {
  return (await listLocalRecords<PrescriptionTemplate>("prescription_templates")).map((row) => row.value).filter((item) => item.scope === "GLOBAL" && item.isActive);
}

export async function getGlobalTemplateFolders(): Promise<
  PrescriptionTemplateFolder[]
> {
  return (await listLocalRecords<PrescriptionTemplateFolder>("prescription_template_folders")).map((row) => row.value).filter((item) => item.scope === "GLOBAL" && item.isActive);
}

// ======================================================
// SINGLE TEMPLATE
// ======================================================

export async function getPrescriptionTemplate(
  templateId: string,
): Promise<PrescriptionTemplate> {
  const template = await getLocalRecord<PrescriptionTemplate>("prescription_templates", templateId);
  if (!template) throw new Error("Template not found on this device");
  return template.value;
}

export async function updatePrescriptionTemplate(
  templateId: string,
  dto: UpdatePrescriptionTemplateInput,
): Promise<PrescriptionTemplate> {
  const current = await getPrescriptionTemplate(templateId);
  const updated = { ...current, ...dto, updatedAt: new Date().toISOString() };
  await putLocalRecord({ collection: "prescription_templates", id: templateId, clinicId: current.clinicId, value: updated });
  return updated;
}

export async function deactivatePrescriptionTemplate(
  templateId: string,
) {
  return updatePrescriptionTemplate(templateId, { isActive: false });
}

// ======================================================
// FOLDERS
// ======================================================

export async function updatePrescriptionTemplateFolder(
  folderId: string,
  dto: UpdatePrescriptionTemplateFolderInput,
): Promise<PrescriptionTemplateFolder> {
  const current = await getLocalRecord<PrescriptionTemplateFolder>("prescription_template_folders", folderId);
  if (!current) throw new Error("Folder not found on this device");
  const updated = { ...current.value, ...dto, updatedAt: new Date().toISOString() };
  await putLocalRecord({ collection: "prescription_template_folders", id: folderId, clinicId: current.clinicId, value: updated });
  return updated;
}

export async function deactivatePrescriptionTemplateFolder(
  folderId: string,
) {
  return updatePrescriptionTemplateFolder(folderId, { isActive: false });
}
