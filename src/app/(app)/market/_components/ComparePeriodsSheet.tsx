import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { COMPARISON_PRESETS, type ComparisonPreset } from '@/mocks';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export interface ComparePeriodsSheetProps {
  visible: boolean;
  selected: ComparisonPreset;
  onSelect: (preset: ComparisonPreset) => void;
  onClose: () => void;
}

const PRESET_LABEL: Record<ComparisonPreset, TranslationKey> = {
  WEEK: 'compare_week',
  MONTH: 'compare_month',
  QUARTER: 'compare_quarter',
};

/** Bottom sheet for picking a Week/Month/Quarter comparison period. */
export function ComparePeriodsSheet({ visible, selected, onSelect, onClose }: ComparePeriodsSheetProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('action_close')}
          style={styles.scrimTouchable}
        >
          <View style={[styles.scrim, { backgroundColor: colors.ink }]} />
        </Pressable>
        <View style={[styles.sheet, { backgroundColor: colors.paper }]}>
          <View style={[styles.grabber, { backgroundColor: colors.hairline }]} />
          <Text style={[styles.title, { color: colors.ink }]}>{t('compare_title')}</Text>
          {COMPARISON_PRESETS.map((preset) => {
            const active = preset === selected;
            return (
              <Pressable
                key={preset}
                onPress={() => onSelect(preset)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(PRESET_LABEL[preset])}
                style={[styles.option, { borderColor: active ? colors.leaf : colors.hairline }]}
              >
                <Text style={[styles.optionLabel, { color: active ? colors.leaf : colors.ink }]}>
                  {t(PRESET_LABEL[preset])}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  scrimTouchable: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: { flex: 1, opacity: 0.4 },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.lg,
  },
  grabber: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: space.sm },
  title: { ...text.h2, marginBottom: space.md },
  option: {
    minHeight: hit.min,
    borderWidth: 1.5,
    borderRadius: radius.md,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    marginBottom: space.sm,
  },
  optionLabel: { ...text.bodySemi },
});
