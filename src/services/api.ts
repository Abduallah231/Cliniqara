import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import SessionService from "./session.service";

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async config => {

  const token = await SessionService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await SessionService.clearSession();
    }

    return Promise.reject(error);
  }
);