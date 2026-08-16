import { useId } from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { InfoCircleIcon } from '@/components/icons';

export interface InputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  helper?: string;
  /** 'amber' pairs the helper with an info-circle icon for required-later style notices. */
  helperTone?: 'muted' | 'amber';
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  editable?: boolean;
  maxLength?: number;
  rightSlot?: React.ReactNode;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  helperTone = 'muted',
  keyboardType,
  secureTextEntry,
  editable = true,
  maxLength,
  rightSlot,
}: InputProps) {
  const id = useId();

  return (
    <View>
      <Text style={styles.label} nativeID={id}>
        {label}
      </Text>
      <View style={[styles.row, Boolean(error) && styles.rowError, !editable && styles.rowDisabled]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          maxLength={maxLength}
          placeholderTextColor={color.muted}
          accessibilityLabel={label}
          accessibilityLabelledBy={id}
          style={[styles.input, !editable && styles.inputDisabled]}
        />
        {rightSlot}
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helper ? (
        <View style={styles.helperRow}>
          {helperTone === 'amber' ? <InfoCircleIcon size={14} /> : null}
          <Text style={[styles.helperText, helperTone === 'amber' && styles.helperTextAmber]}>{helper}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...text.label, color: color.ink, marginBottom: space.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hit.min,
    borderWidth: 1.5,
    borderColor: color.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    backgroundColor: color.paper,
  },
  rowError: { borderColor: color.chili },
  rowDisabled: { backgroundColor: color.neutral },
  input: { ...text.body, color: color.ink, flex: 1, paddingVertical: space.sm },
  inputDisabled: { color: color.muted },
  errorText: { ...text.caption, color: color.chili, marginTop: space.xs },
  helperRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.xs, marginTop: space.xs },
  helperText: { ...text.caption, color: color.muted, flex: 1 },
  helperTextAmber: { color: color.tintedAmberText },
});
