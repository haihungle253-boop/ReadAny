/**
 * E-ink mode state — a module-level flag so non-React code (animation patches,
 * reader bridge) can read it synchronously. ThemeProvider keeps it in sync with
 * the "eink" theme.
 */
import { Platform } from "react-native";

let enabled = false;
const listeners = new Set<(value: boolean) => void>();

export function isEinkEnabled(): boolean {
  return enabled;
}

export function setEinkEnabled(value: boolean): void {
  if (enabled === value) return;
  enabled = value;
  for (const listener of listeners) listener(value);
}

export function subscribeEink(listener: (value: boolean) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Onyx BOOX firmware (also found on devices flashed with it, e.g. Xiaoyuan S1
 * running Note X firmware) reports "ONYX" as the manufacturer.
 */
export function isOnyxDevice(): boolean {
  if (Platform.OS !== "android") return false;
  const c = Platform.constants as { Manufacturer?: string; Brand?: string };
  return [c.Manufacturer, c.Brand].some((v) => (v ?? "").toLowerCase().includes("onyx"));
}
