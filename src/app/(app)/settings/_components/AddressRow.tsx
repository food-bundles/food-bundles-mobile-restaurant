import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { LocationPinIcon } from '@/components/icons';
import { useT } from '@/i18n';
import type { Address } from '@/mocks/types';

export interface AddressRowProps {
  address: Address;
}

export function AddressRow({ address }: AddressRowProps) {
  const t = useT();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(app)/settings/address/[id]', params: { id: address.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${address.label}, ${address.street}`}
      style={[styles.card, address.isDefault && styles.cardDefault]}
    >
      <LocationPinIcon color={address.isDefault ? color.leaf : color.secondary} />
      <View style={styles.textCol}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{address.label}</Text>
          {address.isDefault ? (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultLabel}>{t('addresses_default')}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.street}>{address.street}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: space.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  cardDefault: { borderWidth: 1.5, borderColor: color.leaf },
  textCol: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  label: { ...text.bodySemi, color: color.ink },
  defaultBadge: { backgroundColor: color.tintLeaf, borderRadius: radius.pill, paddingHorizontal: space.xs, paddingVertical: 2 },
  defaultLabel: { ...text.micro, color: color.pine },
  street: { ...text.caption, color: color.secondary, marginTop: 2 },
});
