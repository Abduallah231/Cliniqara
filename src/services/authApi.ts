import { api } from "./api";
import SessionService from "./session.service";

export type RegisterDto = {
  fullName: string;
  email: string;
  phone: string;
  password: string;

  accountType: "DOCTOR" | "RECEPTION";
  doctorLevel?: "INTERN" | "DOCTOR";

  nationalId?: string;

  medicalLicenseNumber?: string;

  nationalIdImage?: string;

  medicalLicenseImage?: string;
  specialty?: string;

  professionalTitle?: string;
};

export async function register(dto: RegisterDto) {
  const { data } = await api.post("/auth/register", dto);
  return data;
}

export async function login(
  email: string,
  password: string
) {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  await SessionService.saveAccessToken(data.accessToken);

  return data;
}