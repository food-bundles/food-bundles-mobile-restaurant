import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { formatRwf } from '@/lib';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';

export interface HeroCardVouchersProps {
  overline: string;
  subscribed: boolean;
  title: string;
  subtitle: string;
  linkLabel: string;
  usedFraction?: number;
  available?: number;
  onPress: () => void;
}

export function HeroCardVouchers({
  overline,
  subscribed,
  title,
  subtitle,
  linkLabel,
  usedFraction = 0,
  available = 0,
  onPress,
}: HeroCardVouchersProps) {
  return (
    <HeroCardShell onPress={onPress} accessibilityLabel={`${overline}, ${title}`} tone="dark" overline={overline}>
      <View>
        {subscribed ? (
          <View style={styles.creditBar}>
            <View style={[styles.creditFill, { width: `${Math.round(usedFraction * 100)}%` }]} />
          </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {subscribed ? <Text style={styles.available}>{formatRwf(available)}</Text> : null}
      </View>
      <HeroCardLink label={linkLabel} />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  creditBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: color.onPineSoft,
    overflow: 'hidden',
    marginBottom: space.sm,
  },
  creditFill: { height: '100%', backgroundColor: color.marigold, borderRadius: radius.sm },
  title: { ...text.h2, color: color.paper },
  subtitle: { ...text.caption, color: color.onPineSoft, marginTop: 2 },
  available: { ...text.priceLg, color: color.paper, marginTop: space.xs },
});
