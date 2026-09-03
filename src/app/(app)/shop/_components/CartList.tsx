import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { SwipeRow } from '@/components/layout';
import { QuantityStepper, PriceText, ProductLineImage } from '@/components/product';
import { useCartStore } from '@/stores';
import { products } from '@/mocks';

export function CartList() {
  const { colors } = useTheme();
  const lines = useCartStore((state) => state.lines);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);
  const remove = useCartStore((state) => state.remove);

  return (
    <View>
      {lines.map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        return (
          <SwipeRow
            key={line.productId}
            onDelete={() => remove(line.productId)}
            deleteLabel={`Remove ${product.name} from cart`}
          >
            <View style={[styles.row, { backgroundColor: colors.paper }]}>
              <ProductLineImage source={product.image} label={product.name} />
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{product.name}</Text>
                <Text style={[styles.unit, { color: colors.muted }]}>{product.unit}</Text>
              </View>
              <QuantityStepper qty={line.qty} onInc={() => inc(line.productId)} onDec={() => dec(line.productId)} />
              <PriceText amount={product.price * line.qty} size="md" />
            </View>
          </SwipeRow>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
  },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  unit: { ...text.caption },
});
