import { StyleSheet, View } from 'react-native';
import { color } from '@/theme';
import { VoucherIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { PaymentTileBase } from './PaymentTileBase';

export interface VoucherTileProps {
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function VoucherTile({ selected, onPress, disabled }: VoucherTileProps) {
  const t = useT();

  return (
    <PaymentTileBase
      selected={selected}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={t('a11y_payWithVoucher')}
      title={t('paymentTile_voucherTitle')}
      subtitle={t('paymentTile_voucherSubtitle')}
      logos={
        <View style={styles.logo}>
          <VoucherIcon size={18} color={color.pine} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 32,
    height: 24,
    borderRadius: 6,
    backgroundColor: color.tintMarigold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
