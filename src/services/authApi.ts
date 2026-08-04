import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

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

  await AsyncStorage.setItem(
    "accessToken",
    data.accessToken
  );

  await AsyncStorage.setItem(
    "refreshToken",
    data.refreshToken
  );

  await AsyncStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  return data;
}

export async function logout() {
  await AsyncStorage.multiRemove([
    "accessToken",
    "refreshToken",
    "user",
    "guestMode",
  ]);
}

export async function loginAsGuest() {
  await AsyncStorage.setItem(
    "guestMode",
    "true"
  );

  await AsyncStorage.multiRemove([
    "accessToken",
    "refreshToken",
    "user",
  ]);
}