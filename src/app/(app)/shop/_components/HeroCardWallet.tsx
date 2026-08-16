import { StyleSheet, Text, View } from 'react-native';
import { PriceText } from '@/components/product';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';
import { color, text } from '@/theme';

export interface HeroCardWalletProps {
  overline: string;
  balance: number;
  subtitle: string;
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardWallet({ overline, balance, subtitle, linkLabel, onPress }: HeroCardWalletProps) {
  return (
    <HeroCardShell onPress={onPress} accessibilityLabel={`${overline}, ${subtitle}`} tone="dark" overline={overline}>
      <View>
        <PriceText amount={balance} size="hero" colorOverride={color.paper} />
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <HeroCardLink label={linkLabel} />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  subtitle: { ...text.caption, color: color.onPineSoft, marginTop: 2 },
});
