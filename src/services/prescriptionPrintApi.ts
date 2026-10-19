import { File, Paths } from "expo-file-system";
import { getLocalRecord, putLocalRecord } from "@/services/localDatabase";
import { getClinicMembers, getMyClinics } from "@/services/clinicApi";
import { getVisit, getPrescription } from "@/services/visitApi";
import { useDoctorStore } from "@/store/doctorStore";
import type { Patient } from "@/types/patient";
import type { Visit } from "@/types/visit";
import {
  DEFAULT_PRESCRIPTION_PRINT_TEMPLATE,
  type PrescriptionPrintField,
  type PrescriptionPrintFieldKey,
  type PrescriptionPrintTemplate,
} from "@/models/PrescriptionPrintTemplate";

const COLLECTION = "clinic_prescription_print_template";
const safeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "_");

export async function assertClinicPrintAccess(clinicId: string) {
  const clinic = (await getMyClinics()).find((item) => item.clinic.id === clinicId);
  const userId = useDoctorStore.getState().doctor?.id;
  if (!userId || !clinic || clinic.role === "RECEPTION") throw new Error("An active clinic doctor or owner is required to manage and print prescriptions.");
  return clinic;
}

export async function getClinicPrescriptionPrintTemplate(clinicId: string) {
  await assertClinicPrintAccess(clinicId);
  const record = await getLocalRecord<PrescriptionPrintTemplate>(COLLECTION, clinicId);
  if (!record || record.value.clinicId !== clinicId) return null;
  return record.value;
}

export async function saveClinicPrescriptionPrintTemplate(
  clinicId: string,
  input: Omit<PrescriptionPrintTemplate, "clinicId" | "createdAt" | "updatedAt">,
) {
  await assertClinicPrintAccess(clinicId);
  if (!input.scanUri || !Number.isFinite(input.scanWidth) || !Number.isFinite(input.scanHeight) || input.scanWidth <= 0 || input.scanHeight <= 0) {
    throw new Error("Choose a clear prescription scan before saving.");
  }
  if (input.fields.length > 30 || input.fields.some((field) =>
    !isValidField(field) || field.x < 0 || field.y < 0 || field.x > 1 || field.y > 1 || field.width <= 0 || field.height <= 0 || field.x + field.width > 1 || field.y + field.height > 1
  )) throw new Error("One or more print fields have invalid positions or sizes.");
  if (!Number.isFinite(input.scale) || input.scale < 50 || input.scale > 150) throw new Error("Print scale must be between 50% and 150%.");
  const sizes: Record<string, [number, number]> = { A4: [210, 297], A5: [148, 210], A6: [105, 148], LETTER: [216, 279], HALF_LETTER: [140, 216], EXECUTIVE: [184, 267] };
  const paper = input.paperSize === "CUSTOM" ? [input.customWidthMm, input.customHeightMm] as [number, number] : sizes[input.paperSize];
  if (!paper || paper.some((dimension) => !Number.isFinite(dimension) || dimension < 50 || dimension > 500)) throw new Error("Choose a supported paper size or custom dimensions between 50 and 500 mm.");
  const [paperWidth, paperHeight] = input.orientation === "landscape" ? [paper[1], paper[0]] : paper;
  const margins = input.marginsMm;
  if ([margins.top, margins.right, margins.bottom, margins.left].some((margin) => !Number.isFinite(margin) || margin < 0) ||
    margins.left + margins.right >= paperWidth || margins.top + margins.bottom >= paperHeight) throw new Error("Print margins must fit inside the selected paper.");
  const current = await getLocalRecord<PrescriptionPrintTemplate>(COLLECTION, clinicId);
  const now = new Date().toISOString();
  const value: PrescriptionPrintTemplate = {
    ...input,
    clinicId,
    createdAt: current?.value.createdAt ?? now,
    updatedAt: now,
  };
  // Primary key is clinicId: saving a replacement atomically overwrites the clinic's sole active template.
  await putLocalRecord({ collection: COLLECTION, id: clinicId, clinicId, value });
  return value;
}

function isValidField(field: PrescriptionPrintField): field is PrescriptionPrintField {
  return !!field && typeof field.id === "string" && typeof field.key === "string" &&
    Number.isFinite(field.x) && Number.isFinite(field.y) && Number.isFinite(field.width) && Number.isFinite(field.height) &&
    Number.isFinite(field.fontSize) && field.fontSize >= 6 && field.fontSize <= 48 &&
    ["sans-serif", "serif", "monospace"].includes(field.font) && ["left", "center", "right"].includes(field.alignment) && ["ltr", "rtl"].includes(field.direction);
}

export type SavedPrescriptionPrintData = {
  clinicId: string;
  doctorName: string;
  fields: Partial<Record<PrescriptionPrintFieldKey, string>>;
};

function text(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join("\n");
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).map(text).filter(Boolean).join(" · ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value).trim();
}

function ageText(patient: Patient | undefined): string {
  if (!patient) return "";
  const dob = patient.dateOfBirth ? new Date(patient.dateOfBirth) : null;
  if (dob && !Number.isNaN(dob.getTime())) {
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) years--;
    return years >= 0 ? `${years} years` : "";
  }
  const value = patient.estimatedAgeValue;
  const unit = patient.estimatedAgeUnit;
  return value ? `${value} ${unit ?? ""}`.trim() : "";
}

function formatDate(raw: unknown) {
  const date = raw ? new Date(String(raw)) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : "";
}

export async function getSavedVisitPrescriptionPrintData(visitId: string): Promise<SavedPrescriptionPrintData> {
  if (!visitId) throw new Error("Visit is missing.");
  // Re-read saved state at the point of preview; unsaved Zustand form state is never used here.
  const visit = await getVisit(visitId) as Visit & Record<string, any>;
  const clinicId = visit.clinicId;
  const clinic = await assertClinicPrintAccess(clinicId);
  const currentUserId = useDoctorStore.getState().doctor?.id;
  if (visit.doctorId !== currentUserId && clinic.role !== "OWNER") {
    throw new Error("Only the visit's doctor or a clinic owner can print this prescription.");
  }
  const [patientRecord, prescriptionData, visitDoctorRecord, clinicMembers] = await Promise.all([
    getLocalRecord<Patient>("patients", visit.patientId),
    getPrescription(visitId),
    getLocalRecord<any>("users", visit.doctorId),
    getClinicMembers(clinicId),
  ]);
  const patient = patientRecord?.value;
  const saved: { medications?: any[]; advice?: string | null; notes?: string | null; followUp?: string | null } = prescriptionData ?? {};
  const medications = Array.isArray(saved.medications) ? saved.medications : [];
  const medicationCards = medications.map((item: any) => {
    const medication = text(item.medication ?? item.drug?.commercialNameEn);
    const instructions = text(item.instructions);
    return [medication ? `Medication: ${medication}` : "", instructions ? `Instructions: ${instructions}` : ""]
      .filter(Boolean).join("\n");
  }).filter(Boolean);
  const diagnosis = text(visit.diagnosis?.primaryDiagnosisName);
  const footer = [
    text(saved.advice) ? `Advice: ${text(saved.advice)}` : "",
    text(saved.notes) ? `Notes: ${text(saved.notes)}` : "",
    text(saved.followUp) ? `Follow-up: ${text(saved.followUp)}` : "",
  ].filter(Boolean).join("\n");
  const body: string[] = [];
  if (diagnosis) body.push(`Diagnosis: ${diagnosis}`);
  if (medicationCards.length) body.push(medicationCards.join("\n\n"));
  if (footer) body.push(footer);
  const patientName = patient?.fullName ?? visit.patient?.fullName ?? "";
  const doctor = useDoctorStore.getState().doctor;
  const doctorName = visitDoctorRecord?.value?.fullName ?? clinicMembers.find((member) => member.userId === visit.doctorId)?.user.fullName ?? (doctor?.id === visit.doctorId ? doctor.fullName : "");
  const fields: SavedPrescriptionPrintData["fields"] = {
    doctorName, patientName, age: ageText(patient), date: formatDate(visit.visitDate),
    prescriptionBody: body.join("\n\n"),
  };
  return { clinicId, doctorName, fields };
}

export async function persistPrescriptionTemplateScan(clinicId: string, sourceUri: string): Promise<string> {
  await assertClinicPrintAccess(clinicId);
  const destination = new File(Paths.document, `prescription-template-${safeId(clinicId)}-${Date.now()}.jpg`);
  await new File(sourceUri).copy(destination);
  return destination.uri;
}

export async function removeReplacedTemplateScan(clinicId: string, previousUri?: string | null) {
  if (!previousUri) return;
  const destination = new File(previousUri);
  // Only remove files in our template naming convention, never arbitrary picked files.
  if (destination.name.startsWith(`prescription-template-${safeId(clinicId)}-`) && destination.exists) destination.delete();
}

export { DEFAULT_PRESCRIPTION_PRINT_TEMPLATE };
