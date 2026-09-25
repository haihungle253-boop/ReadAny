import { useThrottledValue } from "@/hooks/use-throttled-value";
import { useTheme } from "@/styles/ThemeContext";

/** How often streamed AI output repaints in e-ink mode. */
export const EINK_STREAM_INTERVAL_MS = 1500;

/**
 * In e-ink mode, repaint a fast-changing value (a streaming AI message) at
 * most every EINK_STREAM_INTERVAL_MS instead of on every token, which would
 * keep the panel flashing. Null/undefined pass through immediately so a
 * finished stream never lingers next to its persisted copy.
 */
export function useEinkThrottledValue<T>(value: T): T {
  const { isEink } = useTheme();
  const throttled = useThrottledValue(value, EINK_STREAM_INTERVAL_MS);
  if (!isEink || value == null) return value;
  return throttled;
}
