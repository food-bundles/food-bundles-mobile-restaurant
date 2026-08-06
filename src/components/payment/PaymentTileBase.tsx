import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';

export interface PaymentTileBaseProps {
  selected: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  logos: React.ReactNode;
  title: string;
  subtitle: string;
  expandedContent?: React.ReactNode;
}

export function PaymentTileBase({
  selected,
  onPress,
  accessibilityLabel,
  disabled,
  logos,
  title,
  subtitle,
  expandedContent,
}: PaymentTileBaseProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, selected && styles.selected, disabled && styles.disabled]}
    >
      <View style={styles.row}>
        {logos}
        <View style={styles.textCol}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]} />
      </View>
      {selected && expandedContent ? <View style={styles.expanded}>{expandedContent}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: color.hairline,
    backgroundColor: color.paper,
    padding: space.md,
  },
  selected: { borderColor: color.leaf },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  textCol: { flex: 1 },
  title: { ...text.bodySemi, color: color.ink },
  subtitle: { ...text.caption, color: color.muted, marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.disabledLine,
  },
  radioSelected: { borderColor: color.leaf, backgroundColor: color.leaf },
  expanded: { marginTop: space.md, paddingTop: space.md, borderTopWidth: 1, borderTopColor: color.hairline },
});
