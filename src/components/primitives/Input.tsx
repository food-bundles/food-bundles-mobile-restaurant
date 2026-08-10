import { useId } from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';

export interface InputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  helper?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  editable?: boolean;
  rightSlot?: React.ReactNode;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  keyboardType,
  secureTextEntry,
  editable = true,
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
        <Text style={styles.helperText}>{helper}</Text>
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
  helperText: { ...text.caption, color: color.muted, marginTop: space.xs },
});
