import { create } from "zustand";
import { getLocalRecord, putLocalRecord } from "@/services/localDatabase";

export type ThemePreference = "System" | "Light" | "Dark";
export type FontSizePreference = "Small" | "Medium" | "Large";

export interface AppSettings {
  theme: ThemePreference;
  fontSize: FontSizePreference;
  appLock: boolean;
  biometric: boolean;
}

export type ActiveColorScheme = "light" | "dark";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "System",
  fontSize: "Medium",
  appLock: false,
  biometric: false,
};

interface AppSettingsStore extends AppSettings {
  activeColorScheme: ActiveColorScheme;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  setActiveColorScheme: (scheme: ActiveColorScheme) => void;
}

export const useAppSettingsStore = create<AppSettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,
  activeColorScheme: "light",
  hydrated: false,

  setActiveColorScheme: (activeColorScheme) => set({ activeColorScheme }),

  hydrate: async () => {
    if (get().hydrated) return;
    const stored = await getLocalRecord<Partial<AppSettings>>(
      "settings",
      "app-preferences",
    );
    const value = stored?.value ?? {};
    set({
      theme: value.theme === "Light" || value.theme === "Dark" ? value.theme : "System",
      fontSize: value.fontSize === "Small" || value.fontSize === "Large" ? value.fontSize : "Medium",
      appLock: value.appLock === true,
      biometric: value.biometric === true,
      hydrated: true,
    });
  },

  updateSettings: async (updates) => {
    const state = get();
    const current: AppSettings = {
      theme: state.theme,
      fontSize: state.fontSize,
      appLock: state.appLock,
      biometric: state.biometric,
    };
    const next = { ...current, ...updates };
    await putLocalRecord({
      collection: "settings",
      id: "app-preferences",
      value: next,
    });
    set(next);
  },
}));
