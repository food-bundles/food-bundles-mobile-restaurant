import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { SwipeRow } from '@/components/layout';
import { QuantityStepper, PriceText } from '@/components/product';
import { useGuestCartStore } from '@/stores';

export function GuestCartList() {
  const { colors } = useTheme();
  const lines = useGuestCartStore((state) => state.lines);
  const inc = useGuestCartStore((state) => state.inc);
  const dec = useGuestCartStore((state) => state.dec);
  const remove = useGuestCartStore((state) => state.remove);

  return (
    <View>
      {lines.map((line) => (
        <SwipeRow key={line.productId} onDelete={() => remove(line.productId)} deleteLabel={`Remove ${line.productId} from basket`}>
          <View style={[styles.row, { backgroundColor: colors.paper }]}>
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]}>{line.productId}</Text>
            </View>
            <QuantityStepper qty={line.qty} onInc={() => inc(line.productId)} onDec={() => dec(line.productId)} />
            <PriceText amount={line.unitPrice * line.qty} size="md" />
          </View>
        </SwipeRow>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
});
