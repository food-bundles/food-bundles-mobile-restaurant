import { StyleSheet, Text, View } from 'react-native';
import { color, radius, text } from '@/theme';
import { useT } from '@/i18n';

export interface OtpBoxesProps {
  value: string;
  length?: number;
}

export function OtpBoxes({ value, length = 6 }: OtpBoxesProps) {
  const t = useT();
  const digits = Array.from({ length }, (_, index) => value[index]);

  return (
    <View style={styles.row} accessibilityLabel={t('a11y_otpProgress', { filled: value.length, total: length })}>
      {digits.map((digit, index) => {
        const filled = digit !== undefined;
        return (
          <View key={index} style={[styles.box, filled && styles.boxFilled]}>
            <Text style={[styles.digit, !filled && styles.digitEmpty]}>{digit ?? '—'}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  box: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.disabledLine,
    borderRadius: radius.md - 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: { borderColor: color.leaf },
  digit: { ...text.h2, color: color.ink },
  digitEmpty: { color: color.disabledLine },
});
