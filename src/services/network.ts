import { api } from "./api";

export async function isServerAlive() {
  try {
    await api.get("/");
    return true;
  } catch {
    return false;
  }
}