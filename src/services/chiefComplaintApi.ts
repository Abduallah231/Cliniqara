import chiefComplaints from "@/data/chiefComplaints";
import { getComplaintTemplate } from "@/features/complaints/registry/ComplaintRegistry";

export type ChiefComplaintOption = {
  id: string;
  code?: string | null;
  name: string;
  usageCount?: number;
};

export async function getChiefComplaints(
  search?: string,
) {
  const query = search?.trim().toLocaleLowerCase() ?? "";
  return chiefComplaints
    .filter((item) => !query || item.label.toLocaleLowerCase().includes(query))
    .map((item) => ({ id: item.id, code: item.id.replaceAll("-", "_").toUpperCase(), name: item.label, usageCount: 0 }));
}

export async function getClinicChiefComplaints(
  clinicId: string,
): Promise<ChiefComplaintOption[]> {
  void clinicId;
  return getChiefComplaints();
}

export async function getChiefComplaintTemplate(
  id: string,
) {
  const normalized = id.replaceAll("-", "_").toUpperCase();
  return { template: getComplaintTemplate(normalized) ?? null };
}
