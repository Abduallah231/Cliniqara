import { useClinicStore } from "@/store/clinicStore";
import { useDoctorStore } from "@/store/doctorStore";
import type { ClinicMember, CreateClinicDto, JoinCode, MyClinic, MyMembershipRequest, UpdateClinicDto } from "@/types/clinic";
import { getLocalRecord, listLocalRecords, putLocalRecord } from "./localDatabase";

const makeId = (prefix: string) => `local-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const memberships = async () => {
  const userId = useDoctorStore.getState().doctor?.id;
  if (!userId) return [];
  const [clinics, memberRows] = await Promise.all([
    listLocalRecords<MyClinic>("clinics"),
    listLocalRecords<ClinicMember>("clinic_members"),
  ]);
  const userMemberships = memberRows.map((row) => row.value).filter((member) => member.userId === userId && member.status === "ACTIVE");
  return clinics.map((row) => row.value).filter((item) => item.clinic.createdById === userId || userMemberships.some((member) => member.clinicId === item.clinic.id)).map((item) => {
    const membership = userMemberships.find((member) => member.clinicId === item.clinic.id);
    return membership ? { ...item, membershipId: membership.id, role: membership.clinicRole } : item;
  });
};

export async function getMyClinics(): Promise<MyClinic[]> { return memberships(); }

export async function createClinic(dto: CreateClinicDto): Promise<MyClinic> {
  const doctor = useDoctorStore.getState().doctor;
  if (!doctor) throw new Error("Sign in to create a clinic");
  const now = new Date().toISOString();
  const id = makeId("clinic");
  const result: MyClinic = {
    membershipId: makeId("membership"), role: "OWNER",
    clinic: { ...dto, id, clinicCode: id.slice(-8).toUpperCase(), email: dto.email ?? null, isActive: true, createdById: doctor.id, createdAt: now, updatedAt: now },
  };
  await putLocalRecord({ collection: "clinics", id, value: result });
  await putLocalRecord({ collection: "settings", id: "selected_clinic", value: id });
  await putLocalRecord({ collection: "clinic_members", id: result.membershipId, clinicId: id, value: { id: result.membershipId, clinicId: id, userId: doctor.id, clinicRole: "OWNER", status: "ACTIVE", joinedAt: now, removedAt: null, user: { id: doctor.id, userCode: doctor.userCode, accountType: doctor.accountType, doctorLevel: doctor.accountType === "DOCTOR" ? "DOCTOR" : null, fullName: doctor.fullName, specialty: doctor.specialty, professionalTitle: doctor.professionalTitle } } satisfies ClinicMember });
  useClinicStore.getState().setClinics([...(useClinicStore.getState().clinics), result]);
  useClinicStore.getState().setCurrentClinic(result);
  return result;
}

export async function updateClinic(clinicId: string, dto: UpdateClinicDto) {
  const current = await getLocalRecord<MyClinic>("clinics", clinicId);
  if (!current) throw new Error("Clinic not found on this device");
  const result = { ...current.value, clinic: { ...current.value.clinic, ...dto, updatedAt: new Date().toISOString() } };
  await putLocalRecord({ collection: "clinics", id: clinicId, value: result });
  useClinicStore.getState().setClinics((await memberships()).map((item) => item.clinic.id === clinicId ? result : item));
  return result;
}

export async function createJoinCode(clinicId: string): Promise<JoinCode> {
  const code: JoinCode = { id: makeId("join"), clinicId, code: Math.random().toString(36).slice(2, 8).toUpperCase(), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() };
  await putLocalRecord({ collection: "clinic_join_codes", id: code.id, clinicId, value: code });
  return code;
}

export async function joinClinic(joinCode: string) {
  const code = (await listLocalRecords<JoinCode>("clinic_join_codes")).map((row) => row.value).find((item) => item.code === joinCode.trim().toUpperCase() && new Date(item.expiresAt) > new Date());
  if (!code) throw new Error("This join code is unavailable on this device");
  const clinic = await getLocalRecord<MyClinic>("clinics", code.clinicId);
  const doctor = useDoctorStore.getState().doctor;
  if (!clinic || !doctor) throw new Error("Clinic or signed-in account is unavailable on this device");
  const membershipId = makeId("membership");
  const now = new Date().toISOString();
  const role = doctor.accountType === "RECEPTION" ? "RECEPTION" : "DOCTOR";
  const member: ClinicMember = {
    id: membershipId, clinicId: code.clinicId, userId: doctor.id,
    clinicRole: role, status: "PENDING", joinedAt: now, removedAt: null,
    user: { id: doctor.id, userCode: doctor.userCode, accountType: doctor.accountType, doctorLevel: doctor.accountType === "DOCTOR" ? "DOCTOR" : null, fullName: doctor.fullName, specialty: doctor.specialty, professionalTitle: doctor.professionalTitle },
  };
  await putLocalRecord({ collection: "clinic_members", id: membershipId, clinicId: code.clinicId, value: member });
  const request: MyMembershipRequest = {
    id: membershipId, clinicId: code.clinicId, status: "PENDING", createdAt: now,
    clinic: { id: clinic.value.clinic.id, clinicCode: clinic.value.clinic.clinicCode, name: clinic.value.clinic.name, city: clinic.value.clinic.city },
  };
  await putLocalRecord({ collection: "clinic_requests", id: membershipId, clinicId: code.clinicId, value: request });
  return member;
}

export async function getClinicMembers(clinicId: string): Promise<ClinicMember[]> {
  return (await listLocalRecords<ClinicMember>("clinic_members", clinicId)).map((row) => row.value).filter((member) => member.status !== "REMOVED");
}
export async function getMembershipRequests(clinicId: string): Promise<ClinicMember[]> { return (await getClinicMembers(clinicId)).filter((member) => member.status === "PENDING"); }

async function updateMembership(clinicId: string, membershipId: string, patch: Partial<ClinicMember>) {
  const current = await getLocalRecord<ClinicMember>("clinic_members", membershipId);
  if (!current || current.clinicId !== clinicId) throw new Error("Membership not found on this device");
  const updated = { ...current.value, ...patch };
  await putLocalRecord({ collection: "clinic_members", id: membershipId, clinicId, value: updated });
  return updated;
}
export async function approveMembership(clinicId: string, membershipId: string) { return updateMembership(clinicId, membershipId, { status: "ACTIVE" }); }
export async function rejectMembership(clinicId: string, membershipId: string) { return updateMembership(clinicId, membershipId, { status: "REMOVED", removedAt: new Date().toISOString() }); }
export async function removeMember(clinicId: string, membershipId: string) { return rejectMembership(clinicId, membershipId); }
export async function leaveClinic(membershipId: string) {
  const current = await getLocalRecord<ClinicMember>("clinic_members", membershipId);
  if (!current) throw new Error("Membership not found on this device");
  return updateMembership(current.clinicId ?? "", membershipId, { status: "REMOVED", removedAt: new Date().toISOString() });
}
export async function transferOwnership(clinicId: string, membershipId: string) {
  const current = await getLocalRecord<MyClinic>("clinics", clinicId);
  if (!current) throw new Error("Clinic not found on this device");
  const nextOwner = await updateMembership(clinicId, membershipId, { clinicRole: "OWNER" });
  const updated = { ...current.value, role: "DOCTOR" as const };
  await putLocalRecord({ collection: "clinics", id: clinicId, value: updated });
  return nextOwner;
}
async function setClinicActive(clinicId: string, isActive: boolean) {
  const current = await getLocalRecord<MyClinic>("clinics", clinicId);
  if (!current) throw new Error("Clinic not found on this device");
  const updated = { ...current.value, clinic: { ...current.value.clinic, isActive, updatedAt: new Date().toISOString() } };
  await putLocalRecord({ collection: "clinics", id: clinicId, value: updated });
  useClinicStore.getState().setClinics((await memberships()).map((item) => item.clinic.id === clinicId ? updated : item));
  return updated;
}
export async function deactivateClinic(clinicId: string) { return setClinicActive(clinicId, false); }
export async function reactivateClinic(clinicId: string) { return setClinicActive(clinicId, true); }

export async function loadClinics(): Promise<MyClinic[]> {
  const items = await memberships();
  useClinicStore.getState().setClinics(items);
  if (items.length && !useClinicStore.getState().currentClinic) await selectClinic(items[0].clinic.id);
  return items;
}
export async function setCurrentClinic(clinicId: string) { return selectClinic(clinicId); }
export async function getMyMembershipRequests(): Promise<MyMembershipRequest[]> {
  const userId = useDoctorStore.getState().doctor?.id;
  if (!userId) return [];
  const requests = (await listLocalRecords<MyMembershipRequest>("clinic_requests")).map((row) => row.value);
  const memberIds = new Set((await listLocalRecords<ClinicMember>("clinic_members")).map((row) => row.value).filter((member) => member.userId === userId && member.status === "PENDING").map((member) => member.id));
  return requests.filter((request) => memberIds.has(request.id));
}
export async function selectClinic(clinicId: string): Promise<MyClinic> {
  const clinic = (await memberships()).find((item) => item.clinic.id === clinicId);
  if (!clinic) throw new Error("Clinic not found on this device");
  useClinicStore.getState().setCurrentClinic(clinic);
  await putLocalRecord({ collection: "settings", id: "selected_clinic", value: clinicId });
  return clinic;
}
export async function getSelectedClinic(): Promise<MyClinic | null> {
  const currentId = (await getLocalRecord<string>("settings", "selected_clinic"))?.value;
  const selected = currentId ? (await memberships()).find((item) => item.clinic.id === currentId) ?? null : useClinicStore.getState().currentClinic;
  if (selected) useClinicStore.getState().setCurrentClinic(selected);
  return selected;
}
