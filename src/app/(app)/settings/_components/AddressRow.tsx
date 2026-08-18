import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { LocationPinIcon } from '@/components/icons';
import { useT } from '@/i18n';
import type { Address } from '@/mocks/types';

export interface AddressRowProps {
  address: Address;
}

export function AddressRow({ address }: AddressRowProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(app)/settings/address/[id]', params: { id: address.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${address.label}, ${address.street}`}
      style={[
        styles.card,
        { backgroundColor: colors.paper, borderColor: colors.hairline },
        address.isDefault && { borderWidth: 1.5, borderColor: colors.leaf },
      ]}
    >
      <LocationPinIcon color={address.isDefault ? colors.leaf : colors.secondary} />
      <View style={styles.textCol}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.ink }]}>{address.label}</Text>
          {address.isDefault ? (
            <View style={[styles.defaultBadge, { backgroundColor: colors.tintLeaf }]}>
              <Text style={[styles.defaultLabel, { color: colors.pine }]}>{t('addresses_default')}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.street, { color: colors.secondary }]}>{address.street}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  textCol: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  label: { ...text.bodySemi },
  defaultBadge: { borderRadius: radius.pill, paddingHorizontal: space.xs, paddingVertical: 2 },
  defaultLabel: { ...text.micro },
  street: { ...text.caption, marginTop: 2 },
});
