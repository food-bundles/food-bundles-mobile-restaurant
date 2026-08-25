import { StyleSheet, View } from 'react-native';
import { radius, space, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { ChannelToggleRow } from './_components/ChannelToggleRow';
import { useNotificationsStore } from '@/stores';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { NotificationChannel } from '@/mocks/types';

const CHANNEL_ORDER: NotificationChannel[] = [
  'order',
  'wallet',
  'voucher',
  'marketPrice',
  'priceAlert',
  'consent',
  'repayment',
  'system',
];

const NAME_KEY: Record<NotificationChannel, TranslationKey> = {
  order: 'notif_filterOrders',
  wallet: 'notif_filterWallet',
  voucher: 'notif_filterVouchers',
  marketPrice: 'notif_filterMarket',
  priceAlert: 'notif_filterAlerts',
  consent: 'settings_notifConsentName',
  repayment: 'settings_notifRepaymentName',
  system: 'notif_filterSystem',
};

const DESCRIPTION_KEY: Record<NotificationChannel, TranslationKey> = {
  order: 'settings_notifOrdersDesc',
  wallet: 'settings_notifWalletDesc',
  voucher: 'settings_notifVouchersDesc',
  marketPrice: 'settings_notifMarketDesc',
  priceAlert: 'settings_notifPriceAlertsDesc',
  consent: 'settings_notifConsentDesc',
  repayment: 'settings_notifRepaymentDesc',
  system: 'settings_notifSystemDesc',
};

/** Per-channel notification toggles: disabling a channel keeps it in-store but skips the native push. */
export default function NotificationSettings() {
  const t = useT();
  const { colors } = useTheme();
  const channelPrefs = useNotificationsStore((state) => state.channelPrefs);
  const toggleChannel = useNotificationsStore((state) => state.toggleChannel);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('settings_notificationsTitle')} />
      <ScreenScroll contentInsetBottom={40}>
        <View style={[styles.group, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          {CHANNEL_ORDER.map((channel, index) => (
            <ChannelToggleRow
              key={channel}
              channel={channel}
              name={t(NAME_KEY[channel])}
              description={t(DESCRIPTION_KEY[channel])}
              enabled={channelPrefs[channel]}
              onToggle={() => toggleChannel(channel, !channelPrefs[channel])}
              isLast={index === CHANNEL_ORDER.length - 1}
            />
          ))}
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  group: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden', marginTop: space.md },
});
