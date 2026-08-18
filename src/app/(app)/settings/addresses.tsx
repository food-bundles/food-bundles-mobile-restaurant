import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PlusIcon } from '@/components/icons';
import { AddressRow } from './_components/AddressRow';
import { addresses } from '@/mocks';
import { useT } from '@/i18n';

export default function Addresses() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader
        title={t('addresses_title')}
        trailing={
          <Pressable
            onPress={() => router.push({ pathname: '/(app)/settings/address/[id]', params: { id: 'new' } })}
            accessibilityRole="button"
            accessibilityLabel={t('a11y_addAddress')}
            style={[styles.addButton, { backgroundColor: colors.leaf }]}
          >
            <PlusIcon color={colors.paper} />
          </Pressable>
        }
      />
      <ScreenScroll contentInsetBottom={40}>
        {addresses.map((address) => (
          <AddressRow key={address.id} address={address} />
        ))}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
