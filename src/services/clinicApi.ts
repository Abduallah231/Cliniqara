import { useClinicStore } from "@/store/clinicStore";
import type {
  ClinicMember,
  CreateClinicDto,
  JoinCode,
  MyClinic,
  MyMembershipRequest,
  UpdateClinicDto,
} from "@/types/clinic";
import { api } from "./api";

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

  if (memberships.length === 0) {
    return memberships;
  }

  const selectedClinic =
    await getSelectedClinic();

  if (!selectedClinic) {
    await selectClinic(
      memberships[0].clinic.id,
    );
  }

  return memberships;
}

export async function setCurrentClinic(
  clinicId: string,
) {
  const { data } = await api.patch(
    "/clinics/current",
    {
      clinicId,
    },
  );

  return data;
}

export async function getMyMembershipRequests(): Promise<
  MyMembershipRequest[]
> {
  const { data } = await api.get(
    "/clinics/my-membership-requests",
  );

  return data;
}

export async function selectClinic(
  clinicId: string,
): Promise<MyClinic> {
  const store = useClinicStore.getState();

  const clinic = store.clinics.find(
    (item) =>
      item.clinic.id === clinicId,
  );

  if (!clinic) {
    throw new Error(
      "Clinic not found in local store",
    );
  }

  // Update UI immediately.
  store.setCurrentClinic(clinic);

  // Persist selection on backend.
  const { data } = await api.patch(
    "/clinics/selected",
    { clinicId },
  );

  // Refresh local clinic data from backend response.
  if (data) {
    useClinicStore
      .getState()
      .setCurrentClinic(data);
  }

  return data;
}

export async function getSelectedClinic(): Promise<MyClinic | null> {
  const { data } = await api.get(
    "/clinics/selected",
  );

  if (data) {
    useClinicStore
      .getState()
      .setCurrentClinic(data);
  }

  return data;
}