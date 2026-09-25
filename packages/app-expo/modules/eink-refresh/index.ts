import { requireNativeModule } from "expo";
import { Platform } from "react-native";

interface EinkRefreshModule {
  /** True on Onyx BOOX firmware, where the panel can be driven directly. */
  isSupported(): boolean;
  /** Flash the whole panel (GC16) to clear ghosting. False if unsupported. */
  fullRefresh(delayMs: number): boolean;
}

const noop: EinkRefreshModule = {
  isSupported: () => false,
  fullRefresh: () => false,
};

function resolveModule(): EinkRefreshModule {
  if (Platform.OS !== "android") return noop;
  try {
    return requireNativeModule<EinkRefreshModule>("EinkRefresh");
  } catch {
    return noop;
  }
}

const mod: EinkRefreshModule = resolveModule();

export default mod;
