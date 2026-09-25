/**
 * "Aa" header button for the chat screens: adjusts the shared chat text size
 * with the same A- / A+ stepper the reader uses for book text.
 */
import {
  CHAT_FONT_MAX,
  CHAT_FONT_MIN,
  setChatFontSize,
  useChatFontSize,
} from "@/lib/chat-font/chat-font-size";
import { fontSize, fontWeight, radius, useColors } from "@/styles/theme";
import type { ThemeColors } from "@/styles/theme";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ChatFontSizeButton() {
  const { t } = useTranslation();
  const colors = useColors();
  const s = makeStyles(colors);
  const size = useChatFontSize();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={s.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t("chat.fontSize", "对话字号")}
      >
        <Text style={s.triggerText}>Aa</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <Pressable style={s.card} onPress={() => {}}>
            <View style={s.row}>
              <Text style={s.label}>{t("chat.fontSize", "对话字号")}</Text>
              <View style={s.control}>
                <TouchableOpacity
                  style={[s.stepBtn, size <= CHAT_FONT_MIN && s.stepBtnDisabled]}
                  onPress={() => setChatFontSize(size - 1)}
                  disabled={size <= CHAT_FONT_MIN}
                >
                  <Text style={s.stepBtnText}>A-</Text>
                </TouchableOpacity>
                <Text style={s.value}>{size}</Text>
                <TouchableOpacity
                  style={[s.stepBtn, size >= CHAT_FONT_MAX && s.stepBtnDisabled]}
                  onPress={() => setChatFontSize(size + 1)}
                  disabled={size >= CHAT_FONT_MAX}
                >
                  <Text style={s.stepBtnText}>A+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={s.hint}>
              {t("chat.fontSizeHint", "对话和笔记浮窗共用这个字号，书籍正文字号在阅读设置里调。")}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    trigger: {
      minWidth: 32,
      height: 32,
      paddingHorizontal: 4,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    triggerText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.foreground,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.12)",
      justifyContent: "flex-start",
      paddingTop: 52,
      paddingHorizontal: 12,
    },
    card: {
      alignSelf: "flex-end",
      minWidth: 260,
      maxWidth: 420,
      gap: 8,
      padding: 16,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      elevation: 14,
    },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
    label: { fontSize: fontSize.sm, color: colors.foreground, fontWeight: fontWeight.medium },
    control: { flexDirection: "row", alignItems: "center", gap: 12 },
    stepBtn: {
      minWidth: 36,
      minHeight: 36,
      paddingHorizontal: 6,
      borderRadius: radius.lg,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    stepBtnDisabled: { opacity: 0.4 },
    stepBtnText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground },
    value: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.foreground,
      minWidth: 32,
      textAlign: "center",
    },
    hint: { fontSize: fontSize.xs, lineHeight: 16, color: colors.mutedForeground },
  });
