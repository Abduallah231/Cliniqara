import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDoctorStore } from "@/store/doctorStore";
import { useClinicStore } from "@/store/clinicStore";
const ACCESS_TOKEN_KEY = "accessToken";
const GUEST_MODE_KEY = "guestMode";
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
      GUEST_MODE_KEY,
    ]);

    useDoctorStore
      .getState()
      .clearDoctor();

    useClinicStore
      .getState()
      .clearClinics();
  }
  async enableGuestMode(): Promise<void> {
    await AsyncStorage.setItem(GUEST_MODE_KEY, "true");
  }

  async disableGuestMode(): Promise<void> {
    await AsyncStorage.removeItem(GUEST_MODE_KEY);
  }

  async isGuestMode(): Promise<boolean> {
    const value = await AsyncStorage.getItem(GUEST_MODE_KEY);
    return value === "true";
  }

  async logout(): Promise<void> {
    await this.clearSession();
  }
}

export default new SessionService();