import { api } from "./api";
import type {
  ClinicMember,
  CreateClinicDto,
  JoinCode,
  MyClinic,
  UpdateClinicDto,
  MyMembershipRequest,
} from "@/types/clinic";
import { useClinicStore } from "@/store/clinicStore";

export async function getMyClinics(): Promise<MyClinic[]> {
  const { data } = await api.get("/clinics/me");
  return data;
}

export async function createClinic(dto: CreateClinicDto) {
  const { data } = await api.post("/clinics", dto);
  return data;
}

export async function updateClinic(
  clinicId: string,
  dto: UpdateClinicDto,
) {
  const { data } = await api.patch(
    `/clinics/${clinicId}`,
    dto,
  );
  return data;
}

export async function createJoinCode(
  clinicId: string,
): Promise<JoinCode> {
  const { data } = await api.post(
    `/clinics/${clinicId}/join-code`,
  );
  return data;
}

export async function joinClinic(joinCode: string) {
  const { data } = await api.post("/clinics/join", {
    joinCode: joinCode.trim().toUpperCase(),
  });
  return data;
}

export async function getClinicMembers(
  clinicId: string,
): Promise<ClinicMember[]> {
  const { data } = await api.get(
    `/clinics/${clinicId}/members`,
  );
  return data;
}

export async function getMembershipRequests(
  clinicId: string,
): Promise<ClinicMember[]> {
  const { data } = await api.get(
    `/clinics/${clinicId}/membership-requests`,
  );
  return data;
}

export async function approveMembership(
  clinicId: string,
  membershipId: string,
) {
  const { data } = await api.patch(
    `/clinics/${clinicId}/members/${membershipId}/approve`,
  );
  return data;
}

export async function rejectMembership(
  clinicId: string,
  membershipId: string,
) {
  const { data } = await api.patch(
    `/clinics/${clinicId}/members/${membershipId}/reject`,
  );
  return data;
}

export async function removeMember(
  clinicId: string,
  membershipId: string,
) {
  const { data } = await api.patch(
    `/clinics/${clinicId}/members/${membershipId}/remove`,
  );
  return data;
}

export async function leaveClinic(
  membershipId: string,
) {
  const { data } = await api.patch(
    `/clinics/members/${membershipId}/leave`,
  );
  return data;
}

export async function transferOwnership(
  clinicId: string,
  membershipId: string,
) {
  const { data } = await api.patch(
    `/clinics/${clinicId}/transfer-ownership`,
    { membershipId },
  );
  return data;
}

export async function deactivateClinic(
  clinicId: string,
) {
  const { data } = await api.patch(
    `/clinics/${clinicId}/deactivate`,
  );
  return data;
}

export async function reactivateClinic(
  clinicId: string,
) {
  const { data } = await api.patch(
    `/clinics/${clinicId}/reactivate`,
  );
  return data;
}

export async function loadClinics(): Promise<MyClinic[]> {
  const memberships = await getMyClinics();

  useClinicStore
    .getState()
    .setClinics(memberships);

  return memberships;
}

export async function getMyMembershipRequests(): Promise<
  MyMembershipRequest[]
> {
  const { data } = await api.get(
    "/clinics/my-membership-requests",
  );

  return data;
}