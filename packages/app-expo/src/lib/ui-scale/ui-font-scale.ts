/**
 * App-wide UI text scale (settings → Appearance → "Interface text size").
 *
 * Kept outside React context so the Text patch (install-text-scale.tsx) can
 * read it anywhere, including components mounted outside ThemeProvider.
 */
import * as SecureStore from "expo-secure-store";
import { useSyncExternalStore } from "react";

export const UI_FONT_SCALES = [1, 1.15, 1.3, 1.5, 1.75, 2] as const;

const STORAGE_KEY = "readany-ui-font-scale";

let scale = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getUiFontScale(): number {
  return scale;
}

export function setUiFontScale(value: number): void {
  if (!Number.isFinite(value) || value <= 0 || value === scale) return;
  scale = value;
  emit();
  SecureStore.setItemAsync(STORAGE_KEY, String(value)).catch(() => {});
}

export function useUiFontScale(): number {
  return useSyncExternalStore(subscribe, getUiFontScale, getUiFontScale);
}

export function loadUiFontScale(): void {
  SecureStore.getItemAsync(STORAGE_KEY)
    .then((saved) => {
      const value = Number(saved);
      if (saved && Number.isFinite(value) && value > 0 && value !== scale) {
        scale = value;
        emit();
      }
    })
    .catch(() => {});
}
