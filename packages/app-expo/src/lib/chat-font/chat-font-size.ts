/**
 * Text size for the AI chat screens (library chat and in-book chat share it)
 * and the reader's note tooltip. Book text keeps its own reader setting.
 *
 * Stored as the size of chat body text in px, like the reader's font size.
 */
import * as SecureStore from "expo-secure-store";
import { useSyncExternalStore } from "react";

/** Chat body text size the chat styles were designed for (fontSize.sm). */
export const CHAT_FONT_BASE = 14;
export const CHAT_FONT_MIN = 12;
export const CHAT_FONT_MAX = 40;

const STORAGE_KEY = "readany-chat-font-size";

let size = CHAT_FONT_BASE;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function clamp(value: number) {
  return Math.min(CHAT_FONT_MAX, Math.max(CHAT_FONT_MIN, Math.round(value)));
}

export function getChatFontSize(): number {
  return size;
}

export function setChatFontSize(value: number): void {
  if (!Number.isFinite(value)) return;
  const next = clamp(value);
  if (next === size) return;
  size = next;
  emit();
  SecureStore.setItemAsync(STORAGE_KEY, String(next)).catch(() => {});
}

export function useChatFontSize(): number {
  return useSyncExternalStore(subscribe, getChatFontSize, getChatFontSize);
}

export function loadChatFontSize(): void {
  SecureStore.getItemAsync(STORAGE_KEY)
    .then((saved) => {
      const value = Number(saved);
      if (saved && Number.isFinite(value) && clamp(value) !== size) {
        size = clamp(value);
        emit();
      }
    })
    .catch(() => {});
}
