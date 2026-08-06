import { StyleSheet, View } from 'react-native';
import { color } from '@/theme';
import { WalletIcon } from '@/components/icons';
import { formatRwf } from '@/lib';
import { PaymentTileBase } from './PaymentTileBase';

export interface WalletTileProps {
  selected: boolean;
  onPress: () => void;
  balance: number;
  disabled?: boolean;
}

export function WalletTile({ selected, onPress, balance, disabled }: WalletTileProps) {
  return (
    <PaymentTileBase
      selected={selected}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel="Pay with prepaid wallet"
      title="Prepaid wallet"
      subtitle={`Balance ${formatRwf(balance)}`}
      logos={
        <View style={styles.logo}>
          <WalletIcon size={18} color={color.pine} />
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
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
