import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { FeedTimelineItem } from './_components/FeedTimelineItem';
import { useT } from '@/i18n';

export default function OrderFeed() {
  const t = useT();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

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
        <View>
          <Text style={styles.title}>{t('notif_orderFeedTitle', { orderId })}</Text>
          <Text style={styles.subtitle}>
            {t('st_intransit')} · {t('notif_arrivingAround', { time: '10:30' })}
          </Text>
        </View>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        <FeedTimelineItem
          title={t('notif_outForDelivery')}
          subtitle={t('notif_driverAssigned', { time: '10:05' })}
          active
        />
        <FeedTimelineItem title={t('notif_readyAtDepot')} subtitle={t('notif_packedChecked', { time: '09:48' })} />
        <FeedTimelineItem title={t('notif_preparingLabel')} subtitle={t('notif_sortingProduce', { time: '09:20' })} />
        <FeedTimelineItem
          title={t('notif_confirmedLabel')}
          subtitle={t('notif_depotAccepted', { time: '08:55' })}
          isLast
        />
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
  title: { ...text.h2, color: color.ink },
  subtitle: { ...text.caption, color: color.tintedAmberText, marginTop: 2 },
});
