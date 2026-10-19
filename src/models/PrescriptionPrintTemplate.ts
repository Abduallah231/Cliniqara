export type PrescriptionPrintFieldKey =
  | "doctorName" | "patientName" | "age" | "date" | "prescriptionBody";

export type PrescriptionPrintField = {
  id: string;
  key: PrescriptionPrintFieldKey;
  x: number;
  y: number;
  width: number;
  height: number;
  font: "sans-serif" | "serif" | "monospace";
  fontSize: number;
  bold: boolean;
  alignment: "left" | "center" | "right";
  direction: "ltr" | "rtl";
};

export type PaperSize = "A4" | "A5" | "A6" | "LETTER" | "HALF_LETTER" | "EXECUTIVE" | "CUSTOM";

export type PrescriptionPrintTemplate = {
  clinicId: string;
  scanUri: string;
  scanWidth: number;
  scanHeight: number;
  fields: PrescriptionPrintField[];
  paperSize: PaperSize;
  customWidthMm: number;
  customHeightMm: number;
  orientation: "portrait" | "landscape";
  marginsMm: { top: number; right: number; bottom: number; left: number };
  scale: number;
  createdAt: string;
  updatedAt: string;
};

export const PRESCRIPTION_PRINT_FIELDS: Array<{ key: PrescriptionPrintFieldKey; label: string }> = [
  { key: "doctorName", label: "Doctor Name" },
  { key: "patientName", label: "Patient Name" },
  { key: "age", label: "Age" },
  { key: "date", label: "Date" },
  { key: "prescriptionBody", label: "Prescription Content Area" },
];

export const DEFAULT_PRESCRIPTION_PRINT_TEMPLATE = {
  paperSize: "A4" as const,
  customWidthMm: 210,
  customHeightMm: 297,
  orientation: "portrait" as const,
  marginsMm: { top: 10, right: 10, bottom: 10, left: 10 },
  scale: 100,
};
