import { api } from "@/services/api";

class AuthService {
  async me() {
    const response = await api.get("/auth/me");
    return response.data;
  }
}

export default new AuthService();