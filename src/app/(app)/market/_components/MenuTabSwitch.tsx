import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export type MenuTab = 'byMeal' | 'byIngredient';

export interface MenuTabSwitchProps {
  active: MenuTab;
  onSelect: (tab: MenuTab) => void;
}

/** Segmented "By meal" / "By ingredient" tab switch for the generated menu output. */
export function MenuTabSwitch({ active, onSelect }: MenuTabSwitchProps) {
  const t = useT();
  const { colors } = useTheme();
  const options: { key: MenuTab; label: string }[] = [
    { key: 'byMeal', label: t('menu_byMeal') },
    { key: 'byIngredient', label: t('menu_byIngredient') },
  ];

  return (
    <View style={[styles.track, { backgroundColor: colors.neutral }]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.key === active;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[styles.segment, selected && { backgroundColor: colors.paper }]}
          >
            <Text style={[styles.label, { color: selected ? colors.leaf : colors.secondary }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.pill, padding: 3 },
  segment: { flex: 1, minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  label: { ...text.label },
});
