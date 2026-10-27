import { Image, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
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
        <SwipeRow key={line.productId} onDelete={() => remove(line.productId)} deleteLabel={`Remove ${line.name || line.productId} from basket`}>
          <View style={[styles.row, { backgroundColor: colors.paper }]}>
            {line.imageUri ? (
              <Image source={{ uri: line.imageUri }} style={[styles.thumb, { backgroundColor: colors.neutral }]} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder, { backgroundColor: colors.neutral }]} />
            )}
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>
                {line.name || line.productId}
              </Text>
              {line.unit ? (
                <Text style={[styles.unit, { color: colors.muted }]}>{line.unit}</Text>
              ) : null}
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
  thumb: { width: 48, height: 48, borderRadius: radius.sm },
  thumbPlaceholder: {},
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  unit: { ...text.caption, marginTop: 2 },
});
