/**
 * Drop-in replacements for React Native's Modal and ActivityIndicator that
 * stay still in e-ink mode: modals appear without sliding or fading, and
 * spinners become a static ellipsis instead of refreshing the panel forever.
 */
import { useTheme } from "@/styles/ThemeContext";
import {
  type ActivityIndicatorProps,
  type ModalProps,
  ActivityIndicator as RNActivityIndicator,
  Modal as RNModal,
  Text,
} from "react-native";

export function Modal(props: ModalProps) {
  const { isEink } = useTheme();
  return <RNModal {...props} animationType={isEink ? "none" : props.animationType} />;
}

export function ActivityIndicator(props: ActivityIndicatorProps) {
  const { isEink, colors } = useTheme();
  if (!isEink) return <RNActivityIndicator {...props} />;
  if (props.animating === false && props.hidesWhenStopped !== false) return null;
  const size = props.size === "large" ? 28 : typeof props.size === "number" ? props.size : 18;
  return (
    <Text
      accessibilityRole="progressbar"
      style={[
        { fontSize: size, lineHeight: size * 1.1, color: props.color ?? colors.foreground },
        props.style as object,
      ]}
    >
      ···
    </Text>
  );
}
