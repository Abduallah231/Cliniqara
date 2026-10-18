import * as SecureStore from "expo-secure-store";

const APP_LOCK_PIN_KEY = "cliniqara.app-lock.pin.v1";

export async function saveAppLockPin(pin: string): Promise<void> {
  if (!/^\d{4}$/.test(pin)) throw new Error("PIN must contain exactly four digits.");
  await SecureStore.setItemAsync(APP_LOCK_PIN_KEY, pin);
}

export async function verifyAppLockPin(pin: string): Promise<boolean> {
  const savedPin = await SecureStore.getItemAsync(APP_LOCK_PIN_KEY);
  return Boolean(savedPin && savedPin === pin);
}

export async function hasAppLockPin(): Promise<boolean> {
  return (await SecureStore.getItemAsync(APP_LOCK_PIN_KEY)) !== null;
}

export async function clearAppLockPin(): Promise<void> {
  await SecureStore.deleteItemAsync(APP_LOCK_PIN_KEY);
}
