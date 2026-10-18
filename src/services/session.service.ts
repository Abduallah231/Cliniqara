import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDoctorStore } from "@/store/doctorStore";
import { useClinicStore } from "@/store/clinicStore";
import { deleteLocalRecord } from "./localDatabase";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
class SessionService {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }

  async saveAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(
      ACCESS_TOKEN_KEY,
      token,
    );
  }

  async clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
    ]);
    await deleteLocalRecord("auth_user", "current").catch(() => undefined);

    useDoctorStore
      .getState()
      .clearDoctor();

    useClinicStore
      .getState()
      .clearClinics();
  }
  async logout(): Promise<void> {
    await this.clearSession();
  }
}

export default new SessionService();
