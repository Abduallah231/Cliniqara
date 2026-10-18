import { api } from "./api";
import SessionService from "./session.service";
import { getLocalRecord, putLocalRecord } from "./localDatabase";
import { AUTH_ENABLED } from "@/config/features";

export type RegisterDto = {
  fullName: string;
  email: string;
  phone: string;
  password: string;

  accountType: "DOCTOR" | "RECEPTION";
  doctorLevel?: "DOCTOR";

  nationalId?: string;

  medicalLicenseNumber?: string;

  nationalIdImage?: string;

  medicalLicenseImage?: string;
  specialty?: string;

  professionalTitle?: string;
};

export async function register(dto: RegisterDto) {
  if (!AUTH_ENABLED) {
    throw new Error("Account registration is disabled in offline mode.");
  }
  const { data } = await api.post("/auth/register", dto);
  return data;
}

export async function login(
  email: string,
  password: string
) {
  if (!AUTH_ENABLED) {
    throw new Error("Login is disabled in offline mode.");
  }
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  await SessionService.saveTokens(
    data.accessToken,
    data.refreshToken,
  );

  if (data.user?.id) {
    await putLocalRecord({
      collection: "auth_user",
      id: "current",
      value: data.user,
    });
  }

  return data;
}

export async function getCachedUser() {
  return (await getLocalRecord<Record<string, unknown>>("auth_user", "current"))?.value ?? null;
}
