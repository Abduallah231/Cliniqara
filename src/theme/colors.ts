import type { ActiveColorScheme } from "@/components/common/runtimeTheme";

const LIGHT_COLORS = {
  primary: "#003594",
  primaryLight: "#EAF1FF",
  background: "#F3F6FB",
  card: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  secondaryText: "#6B7280",
  placeholder: "#9CA3AF",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  white: "#FFFFFF",
  black: "#000000",
};

const DARK_COLORS: typeof LIGHT_COLORS = {
  primary: "#83B2FF",
  primaryLight: "#1C3455",
  background: "#0B1524",
  card: "#152238",
  border: "#34445B",
  text: "#EDF3FC",
  secondaryText: "#AAB8CB",
  placeholder: "#8494AA",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#FB7185",
  white: "#FFFFFF",
  black: "#000000",
};

export const COLORS: Record<keyof typeof LIGHT_COLORS, string> = { ...LIGHT_COLORS };

export function setColorPalette(scheme: ActiveColorScheme) {
  Object.assign(COLORS, scheme === "dark" ? DARK_COLORS : LIGHT_COLORS);
}
