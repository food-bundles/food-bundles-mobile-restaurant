import { StyleSheet, Text, View } from "react-native";
import { space, text, useTheme } from "@/theme";
import { SwipeRow } from "@/components/layout";
import {
  QuantityStepper,
  PriceText,
  ProductLineImage,
} from "@/components/product";
import { useCartStore } from "@/stores";

export function CartList() {
  const { colors } = useTheme();
  const lines = useCartStore((state) => state.lines);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);
  const remove = useCartStore((state) => state.remove);

  return (
    <View>
      {lines.map((line) => {
        const name = line.name ?? "Product";
        const unit = line.unit ?? "";
        const unitPrice = line.unitPrice ?? 0;
        return (
          <SwipeRow
            key={line.productId}
            onDelete={() => remove(line.productId)}
            deleteLabel={`Remove ${name} from cart`}
          >
            <View style={[styles.row, { backgroundColor: colors.paper }]}>
              <ProductLineImage source={undefined} label={name} />
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{name}</Text>
                <Text style={[styles.unit, { color: colors.muted }]}>
                  {unit}
                </Text>
              </View>
              <QuantityStepper
                qty={line.qty}
                onInc={() => inc(line.productId)}
                onDec={() => dec(line.productId)}
              />
              <PriceText amount={unitPrice * line.qty} size="md" />
            </View>
          </SwipeRow>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  unit: { ...text.caption },
});
