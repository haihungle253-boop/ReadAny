/**
 * Scoped text scaling: every React Native <Text>/<TextInput> rendered inside a
 * <ChatTextScale> is scaled by the chat font size; everything else is left
 * exactly as it is.
 *
 * Chat screens are built from many components with hard-coded font sizes,
 * plus a third-party markdown renderer. Instead of threading a size through
 * all of them, react-native's Text/TextInput exports are swapped (once, from
 * index.js) for wrappers that multiply fontSize/lineHeight by the scale in
 * context. Outside a provider the scale is 1 and the wrappers pass through.
 *
 * Must be imported from index.js BEFORE the app: Metro compiles
 * `import { Text } from "react-native"` to `require("react-native").Text`,
 * evaluated once when each module loads.
 */
import { type ComponentType, type Context, type ReactNode, createContext, useContext } from "react";
import type { StyleProp, TextInputProps, TextProps, TextStyle } from "react-native";
import { StyleSheet } from "react-native";
import { CHAT_FONT_BASE, loadChatFontSize, useChatFontSize } from "./chat-font-size";

/** React Native's implicit fontSize when a style sets none. */
const RN_DEFAULT_FONT_SIZE = 14;

const TextScaleContext = createContext(1);

/**
 * Scales all text below it by the chat font size setting. `maxScale` keeps
 * compact chrome (headers, toolbars) from outgrowing its layout.
 */
export function ChatTextScale({ children, maxScale }: { children: ReactNode; maxScale?: number }) {
  const size = useChatFontSize();
  const scale = size / CHAT_FONT_BASE;
  return (
    <TextScaleContext.Provider value={maxScale ? Math.min(scale, maxScale) : scale}>
      {children}
    </TextScaleContext.Provider>
  );
}

/** Wraps a screen so all of its text follows the chat font size. */
export function withChatTextScale<P extends object>(Screen: ComponentType<P>): ComponentType<P> {
  function ChatTextScaled(props: P) {
    return (
      <ChatTextScale>
        <Screen {...props} />
      </ChatTextScale>
    );
  }
  ChatTextScaled.displayName = `ChatTextScaled(${Screen.displayName ?? Screen.name})`;
  return ChatTextScaled;
}

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

type RNModule = typeof import("react-native");

function install() {
  // A plain require: `import * as` would hand us Metro's copy of the exports
  // object, and redefining properties on the copy changes nothing.
  const rn = require("react-native") as RNModule & Record<string, unknown>;
  const BaseText = rn.Text;
  const BaseTextInput = rn.TextInput;
  const TextAncestorContext = rn.unstable_TextAncestorContext as Context<boolean>;

  function Text(props: TextProps) {
    const scale = useContext(TextScaleContext);
    const insideText = useContext(TextAncestorContext);
    if (scale === 1) return <BaseText {...props} />;
    return <BaseText {...props} style={scaledStyle(props.style, scale, insideText)} />;
  }

  function TextInput(props: TextInputProps) {
    const scale = useContext(TextScaleContext);
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
loadChatFontSize();
