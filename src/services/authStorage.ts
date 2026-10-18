import SessionService from "./session.service";

export const saveAccessToken = (token: string) =>
  SessionService.saveAccessToken(token);

export const clearSession = () =>
  SessionService.logout();
