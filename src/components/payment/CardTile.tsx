import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';
import { useT } from '@/i18n';
import { PaymentTileBase } from './PaymentTileBase';

export interface CardTileProps {
  selected: boolean;
  onPress: () => void;
  maskedNumber?: string;
}

export function CardTile({ selected, onPress, maskedNumber = '•••• •••• •••• 0000' }: CardTileProps) {
  const t = useT();

  return (
    <PaymentTileBase
      selected={selected}
      onPress={onPress}
      accessibilityLabel={t('a11y_payWithCard')}
      title={t('paymentTile_cardTitle')}
      subtitle={t('paymentTile_cardSubtitle')}
      logos={
        <View style={styles.logos}>
          <View style={[styles.logo, { backgroundColor: color.visa }]}>
            <Text style={styles.logoLabel}>VISA</Text>
          </View>
          <View style={[styles.logo, { backgroundColor: color.mastercard }]}>
            <Text style={styles.logoLabel}>MC</Text>
          </View>
        </View>
      }
      expandedContent={
        <View>
          <Text style={styles.masked}>{maskedNumber}</Text>
          <Text style={styles.note}>{t('paymentTile_cardNote')}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  logos: { flexDirection: 'row', gap: space.xs },
  logo: { width: 32, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  logoLabel: { ...text.micro, color: color.paper },
  masked: { ...text.bodySemi, color: color.ink, fontVariant: ['tabular-nums'] },
  note: { ...text.caption, color: color.muted, marginTop: 2 },
});
