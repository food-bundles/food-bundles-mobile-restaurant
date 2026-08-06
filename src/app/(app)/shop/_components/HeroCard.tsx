import { Pressable, StyleSheet, Text } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText } from '@/components/product';

export interface HeroCardProps {
  onPress: () => void;
  title: string;
  subtitle: string;
  dark?: boolean;
  amount?: number;
  children?: React.ReactNode;
}

export function HeroCard({ onPress, title, subtitle, dark, amount, children }: HeroCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.card, dark && styles.cardDark]}
    >
      <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
      <Text style={[styles.subtitle, dark && styles.subtitleDark]}>{subtitle}</Text>
      {amount !== undefined ? (
        <PriceText amount={amount} size="lg" colorOverride={dark ? color.paper : color.ink} />
      ) : null}
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 142,
    width: 260,
    borderRadius: radius.lg,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    padding: space.md,
    justifyContent: 'center',
    gap: space.xs,
  },
  cardDark: { backgroundColor: color.pine, borderWidth: 0 },
  title: { ...text.bodySemi, color: color.ink },
  titleDark: { color: color.paper },
  subtitle: { ...text.caption, color: color.secondary },
  subtitleDark: { color: color.onPineSoft },
});
