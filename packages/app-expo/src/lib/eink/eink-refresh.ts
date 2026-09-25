/**
 * Ghosting cleanup for e-ink mode: periodically flash the whole panel.
 * Only does anything on Onyx BOOX firmware (see modules/eink-refresh);
 * elsewhere the system's own refresh policy applies.
 */
import { useEffect, useRef } from "react";
import EinkRefresh from "../../../modules/eink-refresh";
import { isEinkEnabled } from "./eink-state";

/** Page turns between full refreshes while reading. */
export const PAGES_PER_FULL_REFRESH = 8;

let pageTurns = 0;

export function requestFullRefresh(delayMs = 250): void {
  if (!isEinkEnabled()) return;
  EinkRefresh.fullRefresh(delayMs);
}

export function notePageTurn(): void {
  if (!isEinkEnabled()) return;
  pageTurns += 1;
  if (pageTurns >= PAGES_PER_FULL_REFRESH) {
    pageTurns = 0;
    // Give the WebView time to paint the new page first.
    requestFullRefresh(300);
  }
}

/** Full refresh once a streamed AI answer finishes (many partial repaints). */
export function useFullRefreshWhenStreamEnds(isStreaming: boolean): void {
  const wasStreaming = useRef(false);
  useEffect(() => {
    if (wasStreaming.current && !isStreaming) requestFullRefresh(400);
    wasStreaming.current = isStreaming;
  }, [isStreaming]);
}
