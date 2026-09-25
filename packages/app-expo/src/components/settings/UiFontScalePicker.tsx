/**
 * Picker for the app-wide interface text size (not the book text size, which
 * lives in the reader settings). Changes apply immediately everywhere.
 */
import { UI_FONT_SCALES, setUiFontScale, useUiFontScale } from "@/lib/ui-scale/ui-font-scale";
import { fontSize, fontWeight, radius, useColors } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function UiFontScalePicker() {
  const { t } = useTranslation();
  const colors = useColors();
  const scale = useUiFontScale();

  return (
    <View style={s.container}>
      <View style={s.options}>
        {UI_FONT_SCALES.map((value) => {
          const active = Math.abs(scale - value) < 0.001;
          return (
            <TouchableOpacity
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                s.option,
                { borderColor: active ? colors.primary : colors.border },
                active && s.optionActive,
              ]}
              onPress={() => setUiFontScale(value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.optionLabel,
                  { color: active ? colors.primary : colors.foreground },
                  active && { fontWeight: fontWeight.bold },
                ]}
              >
                {Math.round(value * 100)}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[s.preview, { color: colors.mutedForeground }]}>
        {t(
          "settings.uiFontScalePreview",
          "Menus, buttons and AI chat use this size. Book text has its own setting in the reader.",
        )}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { gap: 12 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    minWidth: 64,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  optionActive: { borderWidth: 2 },
  optionLabel: { fontSize: fontSize.sm },
  preview: { fontSize: fontSize.sm, lineHeight: 20 },
});
