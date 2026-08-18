import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { FeedTimelineItem } from './_components/FeedTimelineItem';
import { useT } from '@/i18n';

export default function OrderFeed() {
  const t = useT();
  const { colors } = useTheme();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader
        title={t('notif_orderFeedTitle', { orderId })}
        subtitle={`${t('st_intransit')} · ${t('notif_arrivingAround', { time: '10:30' })}`}
      />
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
  container: { flex: 1 },
});
