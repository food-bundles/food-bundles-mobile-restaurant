import { StyleSheet, View } from 'react-native';
import { color } from '@/theme';
import { VoucherIcon } from '@/components/icons';
import { PaymentTileBase } from './PaymentTileBase';

export interface VoucherTileProps {
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function VoucherTile({ selected, onPress, disabled }: VoucherTileProps) {
  return (
    <PaymentTileBase
      selected={selected}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel="Pay with voucher credit"
      title="Voucher (credit)"
      subtitle="Confirm with OTP"
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
