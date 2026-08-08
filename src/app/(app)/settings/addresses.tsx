import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon, PlusIcon } from '@/components/icons';
import { AddressRow } from './_components/AddressRow';
import { addresses } from '@/mocks';
import { useT } from '@/i18n';

export default function Addresses() {
  const t = useT();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('addresses_title')}</Text>
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/settings/address/[id]', params: { id: 'new' } })}
          accessibilityRole="button"
          accessibilityLabel="Add address"
          style={styles.addButton}
        >
          <PlusIcon color={color.paper} />
        </Pressable>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink, flex: 1 },
  addButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
