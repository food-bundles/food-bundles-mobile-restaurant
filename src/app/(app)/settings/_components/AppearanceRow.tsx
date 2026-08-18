import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme, useThemeStore, type ThemeOverride } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const OPTION_KEY: Record<ThemeOverride, TranslationKey> = {
  light: 'settings_appearanceLight',
  dark: 'settings_appearanceDark',
  system: 'settings_appearanceSystem',
};

/** Three-way Light / Dark / System appearance switch for Settings → Account. */
export function AppearanceRow() {
  const t = useT();
  const { colors } = useTheme();
  const override = useThemeStore((state) => state.override);
  const setOverride = useThemeStore((state) => state.setOverride);

  return (
    <View style={[styles.section, { borderTopColor: colors.hairline }]}>
      <Text style={[styles.label, { color: colors.ink }]}>{t('settings_appearance')}</Text>
      <View style={[styles.track, { backgroundColor: colors.neutral }]} accessibilityRole="tablist">
        {(['light', 'dark', 'system'] as const).map((option) => {
          const selected = option === override;
          return (
            <Pressable
              key={option}
              onPress={() => setOverride(option)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={t(OPTION_KEY[option])}
              style={[styles.segment, selected && { backgroundColor: colors.paper }]}
            >
              <Text style={[styles.segmentLabel, { color: selected ? colors.leaf : colors.secondary }]}>
                {t(OPTION_KEY[option])}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: space.md, borderTopWidth: 1 },
  label: { ...text.label, marginBottom: space.sm },
  track: { flexDirection: 'row', borderRadius: radius.pill, padding: 3 },
  segment: { flex: 1, minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  segmentLabel: { ...text.label },
});
