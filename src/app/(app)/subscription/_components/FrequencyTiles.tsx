import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { CalendarIcon, CheckIcon, RepeatIcon, RocketIcon } from '@/components/icons';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export type FrequencyOption = 'RARELY' | 'SOMETIMES' | 'OFTEN';

export interface FrequencyTilesProps {
  selected: FrequencyOption;
  onSelect: (value: FrequencyOption) => void;
}

const TILE_SIZE = 100;

const OPTIONS: {
  value: FrequencyOption;
  icon: (color: string) => React.ReactNode;
  labelKey: TranslationKey;
  sublabelKey: TranslationKey;
}[] = [
  {
    value: 'RARELY',
    icon: (color) => <CalendarIcon size={22} color={color} />,
    labelKey: 'underwriting_rarely',
    sublabelKey: 'underwriting_rarelySub',
  },
  {
    value: 'SOMETIMES',
    icon: (color) => <RepeatIcon size={22} color={color} />,
    labelKey: 'underwriting_sometimes',
    sublabelKey: 'underwriting_sometimesSub',
  },
  {
    value: 'OFTEN',
    icon: (color) => <RocketIcon size={22} color={color} />,
    labelKey: 'underwriting_veryOften',
    sublabelKey: 'underwriting_veryOftenSub',
  },
];

/** 3 large usage-frequency tiles (icon + label + sublabel), selected tile shows a leaf border, tint and checkmark. */
export function FrequencyTiles({ selected, onSelect }: FrequencyTilesProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
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
              styles.tile,
              { borderColor: colors.hairline, backgroundColor: colors.paper },
              active && { borderColor: colors.leaf, borderWidth: 2, backgroundColor: colors.tintLeaf },
            ]}
          >
            {active ? (
              <View style={[styles.checkOverlay, { backgroundColor: colors.leaf }]}>
                <CheckIcon size={10} color={colors.paper} />
              </View>
            ) : null}
            {option.icon(active ? colors.leaf : colors.secondary)}
            <Text style={[styles.label, { color: active ? colors.leaf : colors.ink }]}>{t(option.labelKey)}</Text>
            <Text style={[styles.sublabel, { color: colors.secondary }]}>{t(option.sublabelKey)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  tile: {
    flex: 1,
    minHeight: TILE_SIZE,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xs,
    position: 'relative',
  },
  checkOverlay: {
    position: 'absolute',
    top: space.xs,
    right: space.xs,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label, marginTop: space.xs, textAlign: 'center' },
  sublabel: { ...text.micro, textAlign: 'center', marginTop: 2 },
});
