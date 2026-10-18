import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import type { FontSizePreference } from "@/store/appSettingsStore";

export type ActiveColorScheme = "light" | "dark";

const darkColorReplacements: Record<string, string> = {
  "#003594": "#83B2FF",
  "#EAF1FF": "#1C3455",
  "#F3F6FB": "#0B1524",
  "#FFFFFF": "#152238",
  "#FFFFFF00": "#FFFFFF00",
  "#E5E7EB": "#34445B",
  "#111827": "#EDF3FC",
  "#6B7280": "#AAB8CB",
  "#9CA3AF": "#8494AA",
  "#16A34A": "#4ADE80",
  "#F59E0B": "#FBBF24",
  "#DC2626": "#FB7185",
  "#000000": "#FFFFFF",
  "#EEF6FF": "#1C3455",
  "#D6DCE5": "#34445B",
};

function normalizedColor(value: unknown): string | undefined {
  return typeof value === "string" ? value.toUpperCase() : undefined;
}

function luminance(color: string): number | undefined {
  const match = /^#([0-9A-F]{6})$/i.exec(color);
  if (!match) return undefined;
  const channels = [0, 2, 4].map((index) => parseInt(match[1].slice(index, index + 2), 16) / 255);
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function mapColor(value: unknown, property: string, scheme: ActiveColorScheme): unknown {
  if (scheme !== "dark") return value;
  const color = normalizedColor(value);
  if (!color) return value;
  const brightness = luminance(color);
  if (property === "backgroundColor") {
    if (color === "#000000") return "#080D16";
    const known = darkColorReplacements[color];
    if (known) return known;
    if (brightness !== undefined && brightness > 0.76) {
      return brightness > 0.94 ? "#152238" : "#1D2D43";
    }
  }
  if (property.toLowerCase().includes("border")) {
    const known = darkColorReplacements[color];
    if (known) return known;
    if (brightness !== undefined && brightness > 0.45) return "#34445B";
  }
  if (property === "color") {
    if (color === "#FFFFFF" || color === "#FFFFFFFF") return "#FFFFFF";
    const known = darkColorReplacements[color];
    if (known) return known;
    if (brightness !== undefined && brightness < 0.13) return "#EDF3FC";
  }
  return value;
}

export function transformRuntimeStyle<T extends TextStyle | ViewStyle>(
  style: StyleProp<T>,
  scheme: ActiveColorScheme,
  fontSize?: FontSizePreference,
): StyleProp<T> {
  const flattened = StyleSheet.flatten(style);
  if (!flattened) return style;
  const result: Record<string, unknown> = { ...flattened };
  for (const key of ["color", "backgroundColor", "borderColor", "borderTopColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderStartColor", "borderEndColor"] as const) {
    if (key in result) result[key] = mapColor(result[key], key, scheme);
  }
  if (fontSize && "fontSize" in result && typeof result.fontSize === "number") {
    const scale = fontSize === "Small" ? 0.88 : fontSize === "Large" ? 1.14 : 1;
    result.fontSize = Math.round(result.fontSize * scale);
    if (typeof result.lineHeight === "number") result.lineHeight = Math.round(result.lineHeight * scale);
  }
  return result as StyleProp<T>;
}
