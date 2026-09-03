import { api } from "./api";

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
  const { data } = await api.get(
    "/prescription-templates/user",
  );

  return data;
}

export async function createUserTemplate(
  dto: CreatePrescriptionTemplateInput,
): Promise<PrescriptionTemplate> {
  const { data } = await api.post(
    "/prescription-templates/user",
    dto,
  );

  return data;
}

export async function getUserTemplateFolders(): Promise<
  PrescriptionTemplateFolder[]
> {
  const { data } = await api.get(
    "/prescription-templates/user/folders",
  );

  /*
   * The backend returns folders with their templates.
   * We only need the folder information here.
   */
  return data;
}

export async function createUserTemplateFolder(
  dto: CreatePrescriptionTemplateFolderInput,
): Promise<PrescriptionTemplateFolder> {
  const { data } = await api.post(
    "/prescription-templates/user/folders",
    dto,
  );

  return data;
}

// ======================================================
// CLINIC TEMPLATES
// ======================================================

export async function getClinicTemplates(
  clinicId: string,
): Promise<PrescriptionTemplate[]> {
  const { data } = await api.get(
    `/prescription-templates/clinic/${clinicId}`,
  );

  return data;
}

export async function createClinicTemplate(
  clinicId: string,
  dto: CreatePrescriptionTemplateInput,
): Promise<PrescriptionTemplate> {
  const { data } = await api.post(
    `/prescription-templates/clinic/${clinicId}`,
    dto,
  );

  return data;
}

export async function getClinicTemplateFolders(
  clinicId: string,
): Promise<PrescriptionTemplateFolder[]> {
  const { data } = await api.get(
    `/prescription-templates/clinic/${clinicId}/folders`,
  );

  return data;
}

export async function createClinicTemplateFolder(
  clinicId: string,
  dto: CreatePrescriptionTemplateFolderInput,
): Promise<PrescriptionTemplateFolder> {
  const { data } = await api.post(
    `/prescription-templates/clinic/${clinicId}/folders`,
    dto,
  );

  return data;
}

// ======================================================
// GLOBAL TEMPLATES
// ======================================================

export async function getGlobalTemplates(): Promise<
  PrescriptionTemplate[]
> {
  const { data } = await api.get(
    "/prescription-templates/global",
  );

  return data;
}

export async function getGlobalTemplateFolders(): Promise<
  PrescriptionTemplateFolder[]
> {
  const { data } = await api.get(
    "/prescription-templates/global/folders",
  );

  return data;
}

// ======================================================
// SINGLE TEMPLATE
// ======================================================

export async function getPrescriptionTemplate(
  templateId: string,
): Promise<PrescriptionTemplate> {
  const { data } = await api.get(
    `/prescription-templates/${templateId}`,
  );

  return data;
}

export async function updatePrescriptionTemplate(
  templateId: string,
  dto: UpdatePrescriptionTemplateInput,
): Promise<PrescriptionTemplate> {
  const { data } = await api.patch(
    `/prescription-templates/${templateId}`,
    dto,
  );

  return data;
}

export async function deactivatePrescriptionTemplate(
  templateId: string,
) {
  const { data } = await api.delete(
    `/prescription-templates/${templateId}`,
  );

  return data;
}

// ======================================================
// FOLDERS
// ======================================================

export async function updatePrescriptionTemplateFolder(
  folderId: string,
  dto: UpdatePrescriptionTemplateFolderInput,
): Promise<PrescriptionTemplateFolder> {
  const { data } = await api.patch(
    `/prescription-templates/folders/${folderId}`,
    dto,
  );

  return data;
}

export async function deactivatePrescriptionTemplateFolder(
  folderId: string,
) {
  const { data } = await api.delete(
    `/prescription-templates/folders/${folderId}`,
  );

  return data;
}