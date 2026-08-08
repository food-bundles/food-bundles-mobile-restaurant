import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { Input } from '@/components/primitives';
import { useT } from '@/i18n';
import { account } from '@/mocks';

export default function BusinessDetails() {
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
        <Text style={styles.title}>{t('business_title')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.fields}>
          <Input label={t('business_name')} value={account.businessName} onChangeText={() => undefined} />
          <Input label={t('business_address')} value={account.address} onChangeText={() => undefined} />
          <Input label={t('underwriting_tin')} value={account.tin} onChangeText={() => undefined} />
          <Input
            label={t('business_contactPerson')}
            value={`${account.managerName} · ${account.phone}`}
            onChangeText={() => undefined}
          />
          <Input label={t('business_email')} value={account.email} onChangeText={() => undefined} />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('business_saveChanges')}
          style={styles.saveButton}
        >
          <Text style={styles.saveLabel}>{t('business_saveChanges')}</Text>
        </Pressable>
      </StickyFooter>
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
  title: { ...text.h2, color: color.ink },
  fields: { gap: space.md, marginTop: space.md },
  saveButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLabel: { ...text.bodySemi, color: color.paper },
});
