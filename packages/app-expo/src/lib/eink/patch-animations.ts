/**
 * E-ink animation guard — every animation frame is a partial refresh on an
 * e-ink panel, so moving UI turns into flicker and ghosting. While e-ink mode
 * is on, RN Animated transitions jump straight to their end value and looping
 * animations (spinners, pulses) never start, leaving values at rest.
 *
 * Patches the shared Animated object once at startup; the check happens at
 * call time, so toggling the theme takes effect for the next animation.
 */
import { Animated } from "react-native";
import { isEinkEnabled } from "./eink-state";

type CompositeAnimation = Animated.CompositeAnimation;

const noopAnimation: CompositeAnimation = {
  start: (callback) => callback?.({ finished: true }),
  stop: () => {},
  reset: () => {},
};

let installed = false;

export function installEinkAnimationPatch(): void {
  if (installed) return;
  installed = true;

  // Typed as read-only exports, but at runtime `Animated` is a plain object
  // shared by every importer (react-native/Libraries/Animated/AnimatedExports).
  const animated = Animated as {
    -readonly [K in "timing" | "spring" | "loop"]: (typeof Animated)[K];
  };
  const timing = Animated.timing;
  const spring = Animated.spring;
  const loop = Animated.loop;

  animated.timing = (value, config) =>
    timing(value, isEinkEnabled() ? { ...config, duration: 0, delay: 0 } : config);

  animated.spring = (value, config) =>
    isEinkEnabled()
      ? timing(value, {
          toValue: config.toValue as Animated.TimingAnimationConfig["toValue"],
          duration: 0,
          delay: 0,
          useNativeDriver: config.useNativeDriver,
        })
      : spring(value, config);

  animated.loop = (animation, config) =>
    isEinkEnabled() ? noopAnimation : loop(animation, config);
}
