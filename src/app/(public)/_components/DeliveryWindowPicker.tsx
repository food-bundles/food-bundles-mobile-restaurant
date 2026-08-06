import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

const WINDOWS = ['9:00 AM – 12:00 PM', '12:00 PM – 3:00 PM', '3:00 PM – 6:00 PM'];

export interface DeliveryWindowPickerProps {
  selected: number;
  onSelect: (index: number) => void;
}

export function DeliveryWindowPicker({ selected, onSelect }: DeliveryWindowPickerProps) {
  const t = useT();

  return (
    <View>
      <Text style={styles.label}>{t('guest_deliveryWindow')}</Text>
      <View style={styles.list}>
        {WINDOWS.map((window, index) => {
          const active = index === selected;
          return (
            <Pressable
              key={window}
              onPress={() => onSelect(index)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={window}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{window}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...text.label, color: color.ink, marginBottom: space.sm },
  list: { gap: space.sm },
  option: {
    minHeight: hit.min,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.hairline,
    paddingHorizontal: space.md,
    justifyContent: 'center',
  },
  optionActive: { borderColor: color.leaf, backgroundColor: color.tintLeaf },
  optionLabel: { ...text.body, color: color.body },
  optionLabelActive: { color: color.pine },
});
