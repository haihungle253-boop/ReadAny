/**
 * Scales every React Native <Text> and <TextInput> by the UI font scale.
 *
 * Most screens hard-code phone-sized font sizes, which are too small on a
 * 10" e-ink tablet. Rather than touching every style, this swaps the Text and
 * TextInput exports of `react-native` for thin wrappers that multiply
 * fontSize/lineHeight. Third-party components (markdown renderer, navigation
 * tab labels) pick it up too.
 *
 * Must be imported from index.js BEFORE the app: Metro compiles
 * `import { Text } from "react-native"` to `require("react-native").Text`,
 * evaluated once when each module loads.
 */
import { type Context, useContext } from "react";
import type { StyleProp, TextInputProps, TextProps, TextStyle } from "react-native";
import { StyleSheet } from "react-native";
import { loadUiFontScale, useUiFontScale } from "./ui-font-scale";

/** React Native's implicit fontSize when a style sets none. */
const RN_DEFAULT_FONT_SIZE = 14;

type RNModule = typeof import("react-native");

function scaledStyle(
  style: StyleProp<TextStyle>,
  scale: number,
  inheritsFontSize: boolean,
): StyleProp<TextStyle> {
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const override: TextStyle = {};
  // Nested <Text> without its own size inherits the parent's (already scaled).
  const fontSize = flat.fontSize ?? (inheritsFontSize ? undefined : RN_DEFAULT_FONT_SIZE);
  if (fontSize != null) override.fontSize = fontSize * scale;
  if (flat.lineHeight != null) override.lineHeight = flat.lineHeight * scale;
  return [style, override];
}

function install() {
  // A plain require: `import * as` would hand us Metro's copy of the exports
  // object, and redefining properties on the copy changes nothing.
  const rn = require("react-native") as RNModule & Record<string, unknown>;
  const BaseText = rn.Text;
  const BaseTextInput = rn.TextInput;
  const TextAncestorContext = rn.unstable_TextAncestorContext as Context<boolean>;

  function Text(props: TextProps) {
    const scale = useUiFontScale();
    const insideText = useContext(TextAncestorContext);
    if (scale === 1) return <BaseText {...props} />;
    return <BaseText {...props} style={scaledStyle(props.style, scale, insideText)} />;
  }

  function TextInput(props: TextInputProps) {
    const scale = useUiFontScale();
    if (scale === 1) return <BaseTextInput {...props} />;
    return <BaseTextInput {...props} style={scaledStyle(props.style, scale, false)} />;
  }

  // Keep statics such as TextInput.State and displayName.
  Object.assign(Text, BaseText);
  Object.assign(TextInput, BaseTextInput);

  // react-native's index exports these as configurable getters.
  Object.defineProperty(rn, "Text", { configurable: true, enumerable: true, get: () => Text });
  Object.defineProperty(rn, "TextInput", {
    configurable: true,
    enumerable: true,
    get: () => TextInput,
  });
}

install();
loadUiFontScale();
