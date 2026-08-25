import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { Input } from '@/components/primitives';
import { useT } from '@/i18n';

export interface TinInputProps {
  value: string;
  onChangeText: (value: string) => void;
  prefilled: boolean;
}

/** TIN field: number-pad input, auto 3-3-3 grouped, with a note when pre-filled from the account. */
export function TinInput({ value, onChangeText, prefilled }: TinInputProps) {
  const t = useT();
  const { colors } = useTheme();

  const onChange = (next: string) => {
    const digits = next.replace(/\D/g, '').slice(0, 9);
    const grouped = digits.replace(/(\d{3})(?=\d)/g, '$1 ');
    onChangeText(grouped);
  };

  return (
    <View>
      <Input label={t('underwriting_tin')} value={value} onChangeText={onChange} keyboardType="number-pad" maxLength={11} />
      {prefilled ? (
        <Text style={[styles.note, { color: colors.secondary }]}>{t('underwriting_tinPrefilledNote')}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  note: { ...text.caption, marginTop: space.xs },
});
