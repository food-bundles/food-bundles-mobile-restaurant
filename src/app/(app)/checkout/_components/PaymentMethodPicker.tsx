import { View, StyleSheet } from 'react-native';
import { space } from '@/theme';
import { MobileMoneyTile, CardTile, WalletTile, VoucherTile } from '@/components/payment';
import { useCheckoutStore, useSessionStore, isVouchersUnlocked } from '@/stores';
import { account } from '@/mocks';

export function PaymentMethodPicker() {
  const method = useCheckoutStore((state) => state.method);
  const setMethod = useCheckoutStore((state) => state.setMethod);
  const phone = useCheckoutStore((state) => state.phone);
  const setPhone = useCheckoutStore((state) => state.setPhone);
  const tier = useSessionStore((state) => state.tier);
  const vouchersUnlocked = isVouchersUnlocked(tier);

  return (
    <View style={styles.list}>
      <MobileMoneyTile
        selected={method === 'MOBILE_MONEY'}
        onPress={() => setMethod('MOBILE_MONEY')}
        phone={phone}
        onChangeNumber={() => setPhone(phone === account.phone ? account.altPhone : account.phone)}
      />
      <CardTile selected={method === 'CARD'} onPress={() => setMethod('CARD')} />
      <WalletTile
        selected={method === 'CASH'}
        onPress={() => setMethod('CASH')}
        balance={account.walletBalance}
      />
      <VoucherTile
        selected={method === 'VOUCHER'}
        onPress={() => setMethod('VOUCHER')}
        disabled={!vouchersUnlocked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
});
