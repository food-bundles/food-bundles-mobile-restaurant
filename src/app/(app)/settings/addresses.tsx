import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PlusIcon } from '@/components/icons';
import { AddressRow } from './_components/AddressRow';
import { addresses } from '@/mocks';
import { useT } from '@/i18n';

export default function Addresses() {
  const t = useT();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('addresses_title')}
        trailing={
          <Pressable
            onPress={() => router.push({ pathname: '/(app)/settings/address/[id]', params: { id: 'new' } })}
            accessibilityRole="button"
            accessibilityLabel={t('a11y_addAddress')}
            style={styles.addButton}
          >
            <PlusIcon color={color.paper} />
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
  container: { flex: 1, backgroundColor: color.oat },
  addButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
