import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { Input } from '@/components/primitives';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export type PurposeOption = 'BRIDGE_CASH_FLOW' | 'STOCK_PEAK_SEASON' | 'NEW_RESTAURANT_SETUP' | 'OTHER';

export interface PurposeChipsProps {
  selected: PurposeOption;
  onSelect: (value: PurposeOption) => void;
  otherText: string;
  onChangeOtherText: (text: string) => void;
}

const OPTIONS: { value: PurposeOption; labelKey: TranslationKey }[] = [
  { value: 'BRIDGE_CASH_FLOW', labelKey: 'underwriting_purposeBridge' },
  { value: 'STOCK_PEAK_SEASON', labelKey: 'underwriting_purposeStock' },
  { value: 'NEW_RESTAURANT_SETUP', labelKey: 'underwriting_purposeSetup' },
  { value: 'OTHER', labelKey: 'underwriting_purposeOther' },
];

/** 2x2 grid of purpose chips; selecting "Other" reveals a free-text field below the grid. */
export function PurposeChips({ selected, onSelect, otherText, onChangeOtherText }: PurposeChipsProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View>
      <View style={styles.grid}>
        {OPTIONS.map((option) => {
          const active = option.value === selected;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t(option.labelKey)}
              style={[
                styles.chip,
                { borderColor: colors.hairline },
                active && { backgroundColor: colors.leaf, borderColor: colors.leaf },
              ]}
            >
              <Text style={[styles.chipLabel, { color: active ? colors.paper : colors.body }]}>
                {t(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selected === 'OTHER' ? (
        <View style={styles.otherGap}>
          <Input
            label={t('underwriting_purposeOtherLabel')}
            value={otherText}
            onChangeText={onChangeOtherText}
            placeholder={t('underwriting_purposeOtherPlaceholder')}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: hit.min,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
  },
  chipLabel: { ...text.label, textAlign: 'center' },
  otherGap: { marginTop: space.md },
});
