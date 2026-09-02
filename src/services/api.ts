import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { API_CONFIG } from "../config/apiConfig";
import SessionService from "./session.service";

type RetryableRequestConfig =
  InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export function getApiFileUrl(
  fileUrl: string,
): string {
  if (!fileUrl) {
    return fileUrl;
  }

  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://")
  ) {
    return fileUrl;
  }

  return `${API_CONFIG.BASE_URL.replace(
    /\/$/,
    "",
  )}/${fileUrl.replace(/^\//, "")}`;
}

api.interceptors.request.use(async (config) => {
  const token =
    await SessionService.getAccessToken();

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    if (
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      await SessionService.clearSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken =
        await SessionService.getRefreshToken();

      if (!refreshToken) {
        await SessionService.clearSession();
        return Promise.reject(error);
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/auth/refresh`,
        {
          refreshToken,
        },
        {
          timeout: API_CONFIG.TIMEOUT,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );

      const newAccessToken =
        response.data.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "Refresh response missing access token",
        );
      }

      await SessionService.saveAccessToken(
        newAccessToken,
      );

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      await SessionService.clearSession();

      return Promise.reject(refreshError);
    }
  },
);