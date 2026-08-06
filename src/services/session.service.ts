import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDoctorStore } from "@/store/doctorStore";
import { useClinicStore } from "@/store/clinicStore";
const ACCESS_TOKEN_KEY = "accessToken";
const GUEST_MODE_KEY = "guestMode";

class SessionService {
  async saveAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  }

  async clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([
      ACCESS_TOKEN_KEY,
      GUEST_MODE_KEY,
    ]);

    useDoctorStore
      .getState()
      .clearDoctor();

    useClinicStore
      .getState()
      .clearClinic();
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

  async logout() {
    await this.clearSession();
  }
}

export default new SessionService();